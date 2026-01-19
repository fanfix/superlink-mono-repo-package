'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, styled } from '@mui/material';
import { Typography, Loader } from '@superline/design-system';
import Referrals from './components/Referrals';
import ReferralStats from './components/ReferralStats';
import { useReferralApi } from '../../../hooks';
import type { ReferralTableRow } from './components/ReferralTable';
import { exportToCsv } from '../../../utils/csv';

// Styled container for the page layout
const PageContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-xl)',
  minHeight: '100%',
}));

const CardsContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-xl)',
  alignItems: 'stretch',
  flex: '1 1 auto',
}));

const DEFAULT_RANGE_DAYS = 30;
const EARNINGS_RATE = 0.025;

const formatIsoDate = (date: Date) => date.toISOString().split('T')[0];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    Number.isFinite(value) ? value : 0
  );

const normalizeNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getDefaultDateRange = () => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(today.getMonth() - 2);
  twoMonthsAgo.setHours(0, 0, 0, 0);
  return { start: twoMonthsAgo, end: today };
};

export default function ReferredPage() {
  const {
    referralLink,
    referralCode,
    referralRevenue,
    referralStats,
    referrals,
    isLoading,
    refreshReferralLink,
    refreshReferralDashboard,
  } = useReferralApi();

  const [selectedRange, setSelectedRange] = useState(() => getDefaultDateRange());
  const [initialized, setInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const hasFetchedInitialRef = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || initialized || hasFetchedInitialRef.current) {
      return;
    }

    hasFetchedInitialRef.current = true;

    const loadReferralData = async () => {
      let code = referralCode;

      if (!code) {
        const linkData = await refreshReferralLink();
        code = linkData?.code ?? null;
      }

      if (!code) {
        console.warn('ReferredPage: Referral code not available');
        return;
      }

      await refreshReferralDashboard({
        code,
        startDate: formatIsoDate(selectedRange.start),
        endDate: formatIsoDate(selectedRange.end),
      });

      setInitialized(true);
    };

    loadReferralData().catch(error => {
      console.error('ReferredPage: Failed to load referral data', error);
      hasFetchedInitialRef.current = false;
    });
  }, [
    isClient,
    initialized,
    referralCode,
    refreshReferralDashboard,
    refreshReferralLink,
    selectedRange.end,
    selectedRange.start,
  ]);

  const handleCopyReferral = (link: string) => {
    console.log('Referral link copied:', link);
    // TODO: Add toast notification if available
  };

  const handleViewDetails = () => {
    console.log('View detailed report clicked');
    // TODO: Implement navigation or modal for detailed reports
  };

  const handleDateRangeChange = useCallback(
    (startDate: Date | null, endDate: Date | null) => {
      if (!startDate || !endDate) {
        return;
      }

      setSelectedRange({ start: startDate, end: endDate });

      const fetchForRange = async () => {
        let code = referralCode;

        if (!code) {
          const linkData = await refreshReferralLink();
          code = linkData?.code ?? null;
        }

        if (!code) {
          console.warn('ReferredPage: Cannot fetch referral data without referral code');
          return;
        }

        await refreshReferralDashboard({
          code,
          startDate: formatIsoDate(startDate),
          endDate: formatIsoDate(endDate),
        });
      };

      fetchForRange();
    },
    [referralCode, refreshReferralDashboard, refreshReferralLink]
  );


  /**
   * Normalize date string to YYYY-MM-DD format
   * Handles both YYYY-MM-DD and YYYYMMDD formats
   */
  const normalizeDateToYYYYMMDD = useCallback((dateInput: string | null | undefined): string | null => {
    if (!dateInput) return null;
    const trimmed = String(dateInput).trim();
    if (!trimmed) return null;
    if (/^\d{8}$/.test(trimmed)) {
      const year = trimmed.slice(0, 4);
      const month = trimmed.slice(4, 6);
      const day = trimmed.slice(6, 8);
      return `${year}-${month}-${day}`;
    }
    try {
      const normalized = trimmed.replace(/[_\s]/g, '-');
      const date = new Date(normalized);
      if (isNaN(date.getTime())) {
        return null;
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return null;
    }
  }, []);

  /**
   * Check if a date string (YYYY-MM-DD) falls within the selected date range
   */
  const isDateInRange = useCallback(
    (dateStr: string | null, startDate: Date | null, endDate: Date | null): boolean => {
      if (!dateStr || !startDate || !endDate) return true;
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return true;
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        date.setHours(12, 0, 0, 0);
        return date >= start && date <= end;
      } catch {
        return true;
      }
    },
    []
  );

  /**
   * Process referral revenue data with date normalization, filtering, and sampling
   */
  const processReferralRevenueData = useCallback(() => {
    if (!referralRevenue?.dailyRevenue || referralRevenue.dailyRevenue.length === 0) {
      return [];
    }

    const allProcessedData = referralRevenue.dailyRevenue
      .map((point: { date?: string | null; revenue?: number | null }) => {
        const normalizedDate = normalizeDateToYYYYMMDD(point.date);
        if (!normalizedDate) {
          return null;
        }
        const revenue = normalizeNumber(point.revenue);
        return {
          originalDate: point.date,
          normalizedDate,
          revenue,
        };
      })
      .filter((item: { normalizedDate: string; revenue: number; originalDate: string | null | undefined } | null): item is NonNullable<typeof item> => {
        if (!item) return false;
        if (selectedRange.start && selectedRange.end) {
          return isDateInRange(item.normalizedDate, selectedRange.start, selectedRange.end);
        }
        return true;
      });

    if (selectedRange.start && selectedRange.end) {
      const recordsWithData = allProcessedData.filter((item: { revenue: number }) => item.revenue > 0);
      let lastRecordDate: Date | null = null;
      if (recordsWithData.length > 0) {
        const sortedRecords = [...recordsWithData].sort((a: { normalizedDate: string }, b: { normalizedDate: string }) => {
          const dateA = new Date(a.normalizedDate);
          const dateB = new Date(b.normalizedDate);
          return dateB.getTime() - dateA.getTime();
        });
        lastRecordDate = new Date(sortedRecords[0].normalizedDate);
      }

      const dataByDate = new Map<string, typeof allProcessedData[0]>();
      allProcessedData.forEach((item: { normalizedDate: string; revenue: number }) => {
        dataByDate.set(item.normalizedDate, item);
      });

      const datesWithRecords = new Set<string>();
      recordsWithData.forEach((item: { normalizedDate: string }) => {
        datesWithRecords.add(item.normalizedDate);
      });

      const allDatesInRange: string[] = [];
      if (lastRecordDate) {
        const start = new Date(selectedRange.start);
        start.setHours(0, 0, 0, 0);
        const end = new Date(lastRecordDate);
        end.setHours(23, 59, 59, 999);
        const current = new Date(start);
        while (current <= end) {
          const year = current.getFullYear();
          const month = String(current.getMonth() + 1).padStart(2, '0');
          const day = String(current.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          allDatesInRange.push(dateStr);
          current.setDate(current.getDate() + 1);
        }
      } else {
        allProcessedData.forEach((item: { normalizedDate: string }) => {
          allDatesInRange.push(item.normalizedDate);
        });
      }

      let resultDates: string[];
      if (allDatesInRange.length > 14) {
        allDatesInRange.sort((a: string, b: string) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateA.getTime() - dateB.getTime();
        });

        const sampledDates = new Set<string>();
        sampledDates.add(allDatesInRange[0]);
        sampledDates.add(allDatesInRange[allDatesInRange.length - 1]);
        datesWithRecords.forEach(date => sampledDates.add(date));

        if (sampledDates.size < 14) {
          const step = Math.floor(allDatesInRange.length / (14 - sampledDates.size));
          for (let i = step; i < allDatesInRange.length - 1; i += step) {
            if (sampledDates.size >= 14) break;
            sampledDates.add(allDatesInRange[i]);
          }
        }

        if (sampledDates.size > 14) {
          const sortedSampled = Array.from(sampledDates).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA.getTime() - dateB.getTime();
          });
          
          const finalDates = new Set<string>();
          finalDates.add(sortedSampled[0]);
          finalDates.add(sortedSampled[sortedSampled.length - 1]);
          datesWithRecords.forEach(date => finalDates.add(date));
          
          const step = Math.floor(sortedSampled.length / (14 - finalDates.size));
          for (let i = step; i < sortedSampled.length - 1; i += step) {
            if (finalDates.size >= 14) break;
            finalDates.add(sortedSampled[i]);
          }
          resultDates = Array.from(finalDates);
        } else {
          resultDates = Array.from(sampledDates);
        }
      } else {
        resultDates = allDatesInRange;
      }

      resultDates.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });

      const result = resultDates.map((dateStr: string) => {
        const existing = dataByDate.get(dateStr);
        if (existing) {
          return existing;
        }
        return {
          originalDate: dateStr,
          normalizedDate: dateStr,
          revenue: 0,
        };
      });
      return result;
    }
    return allProcessedData.sort((a: { normalizedDate: string }, b: { normalizedDate: string }) => {
      const dateA = new Date(a.normalizedDate);
      const dateB = new Date(b.normalizedDate);
      return dateA.getTime() - dateB.getTime();
    });
  }, [referralRevenue?.dailyRevenue, normalizeDateToYYYYMMDD, normalizeNumber, isDateInRange, selectedRange.start, selectedRange.end]);

  const chartData = useMemo(() => {
    const processedData = processReferralRevenueData();
    
    return processedData.map((item: { normalizedDate: string; revenue: number }) => {
      const parsedDate = new Date(item.normalizedDate);
      const dateLabel = Number.isNaN(parsedDate.getTime())
        ? item.normalizedDate
        : parsedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
      const value = Math.max(0, item.revenue); // Ensure non-negative
      return {
        date: dateLabel,
        value,
        label: formatCurrency(value),
      };
    });
  }, [processReferralRevenueData]);

  const handleDownload = useCallback(() => {
    const processedData = processReferralRevenueData();
    const dailyRows = processedData.map((item: { normalizedDate: string; revenue: number }) => ({
      date: item.normalizedDate,
      revenue: item.revenue,
    }));

    const startLabel = selectedRange.start ? formatIsoDate(selectedRange.start) : 'start';
    const endLabel = selectedRange.end ? formatIsoDate(selectedRange.end) : 'end';
    const filename = `referral-revenue-${startLabel}_to_${endLabel}.csv`;

    exportToCsv(
      filename,
      [
        { label: 'Date', value: (row: { date: string; revenue: number }) => row.date },
        { label: 'Revenue', value: (row: { date: string; revenue: number }) => row.revenue },
      ],
      dailyRows
    );
  }, [processReferralRevenueData, selectedRange.end, selectedRange.start, formatIsoDate]);

  const tableRows = useMemo<ReferralTableRow[]>(() => {
    if (!referrals?.length) {
      return [];
    }

    return referrals.map((referral) => {
      const rawRevenue =
        typeof referral.totalRevenue === 'number'
          ? referral.totalRevenue
          : typeof referral.revenue === 'number'
          ? referral.revenue
          : Number(referral.totalRevenue ?? referral.revenue ?? 0);

      const totalCreators =
        typeof referral.totalCreators === 'number'
          ? referral.totalCreators
          : Number(referral.totalCreators ?? referral.totalCreator ?? 0) || 0;

      const superlockedCreators =
        typeof referral.superlockedCreators === 'number'
          ? referral.superlockedCreators
          : Number(
              referral.superlockedCreators ?? referral.superLockedCreators ?? 0
            ) || 0;

      const createdAt = referral.createdAt ? new Date(referral.createdAt) : null;
      const status =
        referral.status ??
        (createdAt && !Number.isNaN(createdAt.getTime())
          ? `Added on ${createdAt.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}`
          : '—');

      const ownerEmail =
        (referral as any)?.ownerEmail ??
        (referral as any)?.owner?.email ??
        referral.email ??
        (referral as any)?.email ??
        '—';

      const nameCandidates = [
        referral.name,
        [referral.firstName, referral.lastName].filter(Boolean).join(' ').trim(),
      ].filter((value) => value && value.length > 0);

      return {
        name: nameCandidates[0] || referral.email || '—',
        revenue: formatCurrency(Number.isFinite(rawRevenue) ? rawRevenue : 0),
        totalCreators,
        superlockedCreators,
        email: ownerEmail,
        status,
        avatar:
          referral.avatar ??
          referral.imageURL ??
          referral.profileImage ??
          undefined,
      };
    });
  }, [referrals]);

  const totalRevenueValue =
    referralRevenue?.totalRevenue ?? referralStats?.totalRevenue ?? 0;

  const totalRevenueDisplay = formatCurrency(
    Number.isFinite(totalRevenueValue) ? totalRevenueValue : 0
  );

  const earningsDisplay =
    referralStats?.totalRevenue !== undefined
      ? formatCurrency(Number(referralStats.totalRevenue) * EARNINGS_RATE)
      : undefined;

  if (!isClient) {
    return null;
  }

  // Show loader while initializing or loading
  if (!initialized || isLoading) {
    return (
      <PageContainer>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          flex: 1,
          minHeight: '60vh',
          gap: 'var(--padding-lg)'
        }}>
          <Loader size={40} color="black" />
          <Typography variant="text-md" sx={{ color: 'var(--color-grey-light)' }}>
            Loading referral data...
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer sx={{ padding: { xs: 'var(--padding-md)',sm: 'var(--padding-2xl)',} }}>
      {/* Page Header */}
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-black-secondary)',
            marginBottom: 'var(--padding-sm)',
            fontSize: {
              xs: 'var(--font-size-xl)',
              sm: 'var(--font-size-2xl)',
            },
          }}
        >
          Referrals Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: 'var(--font-size-md)',
            color: 'var(--color-grey-main)',
            lineHeight: 1.5,
          }}
        >
          Manage your referral program and track your performance
        </Typography>
      </Box>

      {/* Cards Container */}
      <CardsContainer>
        {/* Referrals Card */}
        <Referrals
          referralLink={referralLink ?? ''}
          onCopyLink={handleCopyReferral}
        />

        {/* Referral Stats Card */}
        <ReferralStats
          totalRevenue={totalRevenueDisplay}
          earnings={earningsDisplay}
          earningsPercentage={`${(EARNINGS_RATE * 100).toFixed(1)}%`}
          startDate={selectedRange.start}
          endDate={selectedRange.end}
          chartData={chartData}
          tableRows={tableRows}
          onViewDetails={handleViewDetails}
          onDateRangeChange={handleDateRangeChange}
          onDownload={handleDownload}
        />

        {/* Revenue Card */}
      </CardsContainer>
    </PageContainer>
  );
}
