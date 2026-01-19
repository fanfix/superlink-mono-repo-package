"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Typography, DateRangePicker, AgencyCount, Chart, Loader } from '@superline/design-system';

import { styled } from '@mui/material/styles';

const RevenueContainer = styled(Box)({
  marginBottom: 'var(--padding-xl)'
});

const RevenueCardsContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  marginBottom: '24px',
  justifyContent: 'flex-start'
});

const RevenueGraphContainer = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
});

const GraphHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  alignItems: 'center',
  marginBottom: 'var(--padding-xl)'
});

const GraphTitle = styled(Typography)({
  color: 'var(--color-black-secondary)',
  fontSize: 'var(--font-size-heading-sm)',
  fontWeight: 600
});

const DateRangeContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-sm)',
  paddingBottom: '0px',
});

const ChartScrollContainer = styled(Box)({
  width: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
  paddingBottom: 'var(--padding-sm)',
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#d1d5db',
    borderRadius: '4px',
  },
});

const ChartArea = styled(Box)({
  height: 320,
  position: 'relative',
  flex: 1,
  minWidth: '900px',
});

interface RevenueSectionProps {
  totalRevenue: number;
  periodRevenue: number;
  periodStart: string;
  periodEnd: string;
  revenueData: Array<{ date: string; earnings: number }>;
  onDateRangeChange?: (start: Date, end: Date) => void;
  isLoading?: boolean;
}

export default function RevenueSection({
  totalRevenue,
  periodRevenue,
  periodStart,
  periodEnd,
  revenueData,
  onDateRangeChange,
  isLoading = false,
}: RevenueSectionProps) {
  const periodStartDate = useMemo(() => new Date(periodStart), [periodStart]);
  const periodEndDate = useMemo(() => new Date(periodEnd), [periodEnd]);
  const periodStartLabel = useMemo(
    () => periodStartDate.toLocaleDateString('en-US'),
    [periodStartDate]
  );
  const periodEndLabel = useMemo(
    () => periodEndDate.toLocaleDateString('en-US'),
    [periodEndDate]
  );

  const [selectedDateRange, setSelectedDateRange] = useState({
    start: periodStartDate,
    end: periodEndDate,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setSelectedDateRange({
      start: periodStartDate,
      end: periodEndDate,
    });
  }, [periodStartDate, periodEndDate]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * Normalize date string to YYYY-MM-DD format
   * Handles both YYYY-MM-DD and YYYYMMDD formats
   */
  const normalizeDateToYYYYMMDD = useMemo(() => {
    return (dateInput: string | null | undefined): string | null => {
      if (!dateInput) return null;

      const trimmed = String(dateInput).trim();
      if (!trimmed) return null;

      // Handle YYYYMMDD format (8 digits)
      if (/^\d{8}$/.test(trimmed)) {
        const year = trimmed.slice(0, 4);
        const month = trimmed.slice(4, 6);
        const day = trimmed.slice(6, 8);
        return `${year}-${month}-${day}`;
      }

      // Handle YYYY-MM-DD format or other ISO-like formats
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
    };
  }, []);

  /**
   * Check if a date string (YYYY-MM-DD) falls within the selected date range
   */
  const isDateInRange = useMemo(() => {
    return (dateStr: string | null, startDate: Date | null, endDate: Date | null): boolean => {
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
    };
  }, []);

  /**
   * Sample dates from date range to show approximately 14 days
   * Picks 3-6 dates from each month in the range
   */
  const sampleDatesFromRange = useMemo(() => {
    return (startDate: Date, endDate: Date): string[] => {
      const sampledDates: string[] = [];
      const current = new Date(startDate);
      current.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      // Group dates by month
      const datesByMonth: { [key: string]: Date[] } = {};
      
      while (current <= end) {
        const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
        if (!datesByMonth[monthKey]) {
          datesByMonth[monthKey] = [];
        }
        datesByMonth[monthKey].push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      // Sample 3-6 dates from each month
      Object.keys(datesByMonth).sort().forEach(monthKey => {
        const monthDates = datesByMonth[monthKey];
        const totalDays = monthDates.length;
        
        let sampleCount = Math.min(6, Math.max(3, Math.floor(totalDays / 3)));
        if (totalDays < 3) {
          sampleCount = totalDays;
        }

        const step = totalDays > sampleCount ? Math.floor(totalDays / sampleCount) : 1;
        
        for (let i = 0; i < sampleCount && i * step < totalDays; i++) {
          const index = Math.min(i * step, totalDays - 1);
          const date = monthDates[index];
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          sampledDates.push(dateStr);
        }
      });

      // Limit to approximately 14 days if we have more
      if (sampledDates.length > 14) {
        const step = Math.floor(sampledDates.length / 14);
        return sampledDates.filter((_, index) => index % step === 0 || index === sampledDates.length - 1).slice(0, 14);
      }

      return sampledDates;
    };
  }, []);

  /**
   * Process and filter revenue data with:
   * - Date normalization to YYYY-MM-DD
   * - Date range filtering
   * - MUST show all dates that have records (earnings > 0)
   * - Show all records from start date up to last record date
   * - Fill remaining slots (up to ~14 days) with sampled dates
   * - Including zero-value records for sampled dates
   * - Sorting by date
   */
  const processRevenueData = useMemo(() => {
    if (!Array.isArray(revenueData) || revenueData.length === 0) {
      return [];
    }

    // Process all data with normalized dates
    const allProcessedData = revenueData
      .map(point => {
        const normalizedDate = normalizeDateToYYYYMMDD(point.date);
        
        if (!normalizedDate) {
          return null;
        }

        const earnings = Number(point.earnings || 0);

        return {
          originalDate: point.date,
          normalizedDate,
          earnings,
        };
      })
      .filter((item): item is NonNullable<typeof item> => {
        if (!item) return false;

        // Apply date range filter if dates are selected
        if (selectedDateRange.start && selectedDateRange.end) {
          return isDateInRange(item.normalizedDate, selectedDateRange.start, selectedDateRange.end);
        }

        return true;
      });

    // If date range is selected
    if (selectedDateRange.start && selectedDateRange.end) {
      // Separate records with data (earnings > 0) from zero records
      const recordsWithData = allProcessedData.filter(item => item.earnings > 0);

      // Find the last record date (from records with data)
      let lastRecordDate: Date | null = null;
      if (recordsWithData.length > 0) {
        const sortedRecords = [...recordsWithData].sort((a, b) => {
          const dateA = new Date(a.normalizedDate);
          const dateB = new Date(b.normalizedDate);
          return dateB.getTime() - dateA.getTime();
        });
        lastRecordDate = new Date(sortedRecords[0].normalizedDate);
      }

      // Create a map of all existing data by date
      const dataByDate = new Map<string, typeof allProcessedData[0]>();
      allProcessedData.forEach(item => {
        dataByDate.set(item.normalizedDate, item);
      });

      // MUST include all records with data (earnings > 0)
      const datesWithRecords = new Set<string>();
      recordsWithData.forEach(item => {
        datesWithRecords.add(item.normalizedDate);
      });

      // Build all dates from start date up to last record date
      const allDatesInRange: string[] = [];
      if (lastRecordDate) {
        const start = new Date(selectedDateRange.start);
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
        allProcessedData.forEach(item => {
          allDatesInRange.push(item.normalizedDate);
        });
      }

      // If we have more than ~14 days, sample while ensuring all records with data are included
      let resultDates: string[];
      if (allDatesInRange.length > 14) {
        allDatesInRange.sort((a, b) => {
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

      // Sort final dates
      resultDates.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });

      // Build result from final dates
      return resultDates.map(dateStr => {
        const existing = dataByDate.get(dateStr);
        if (existing) {
          return existing;
        }
        return {
          originalDate: dateStr,
          normalizedDate: dateStr,
          earnings: 0,
        };
      });
    }

    // If no date range selected, return all processed data sorted
    return allProcessedData.sort((a, b) => {
      const dateA = new Date(a.normalizedDate);
      const dateB = new Date(b.normalizedDate);
      return dateA.getTime() - dateB.getTime();
    });
  }, [revenueData, normalizeDateToYYYYMMDD, isDateInRange, selectedDateRange]);

  const chartData = useMemo(() => {
    const processedData = processRevenueData;
    
    return processedData.map(item => {
      const parsedDate = new Date(item.normalizedDate);
      const dateLabel = Number.isNaN(parsedDate.getTime())
        ? item.normalizedDate
        : parsedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

      // Ensure value is always >= 0 (never negative)
      const value = Math.max(0, Number(item.earnings || 0));

      return {
        date: dateLabel,
        value,
        label: `$${value.toLocaleString()}`,
      };
    });
  }, [processRevenueData]);

  const isEmptyState = chartData.length === 0;

  const dateRangeLabel = useMemo(() => {
    if (!selectedDateRange.start || !selectedDateRange.end) {
      return 'Select a date range';
    }

    return `${selectedDateRange.start.toLocaleDateString('en-US')} - ${selectedDateRange.end.toLocaleDateString('en-US')}`;
  }, [selectedDateRange.end, selectedDateRange.start]);

  return (
    <RevenueContainer>
      {/* Single Revenue Card with Graph */}
      
        {/* Revenue Cards Row */}
        <RevenueCardsContainer>
          {/* Total Revenue Card */}
          <AgencyCount
            label="Total"
            count={`$ ${totalRevenue.toLocaleString()}`}
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              boxShadow: 'none',
              border: '1px solid #E5E7EB'
            }}
          />

          {/* Period Revenue Card */}
          <AgencyCount
            label={`${periodStartLabel} - ${periodEndLabel}`}
            count={`$ ${periodRevenue.toLocaleString()}`}
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              boxShadow: 'none',
              border: '1px solid #E5E7EB'
            }}
          />
        </RevenueCardsContainer>
      <RevenueGraphContainer>
        {/* Header with Date Range Picker */}
        <GraphHeader>
          <GraphTitle>Revenue</GraphTitle>
          <DateRangeContainer>
            <DateRangePicker
              startDate={selectedDateRange.start}
              endDate={selectedDateRange.end}
              onDateRangeSelect={(start: Date | null, end: Date | null) => {
                if (start && end) {
                  setSelectedDateRange({ start, end });
                  onDateRangeChange?.(start, end);
                }
              }}
              inputWidth="240px"
              inputHeight="34px"
              calendarWidth="640px"
              sx={{ padding:0 }}
              dateFormat="MM-DD-YYYY"
              placeholder={dateRangeLabel}
              showFormatPlaceholder={false}
            />
           
          </DateRangeContainer>
        </GraphHeader>

        <ChartScrollContainer>
          <ChartArea>
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  gap: 'var(--padding-md)',
                }}
              >
                <Loader size={32} color="black" />
                <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
                  Loading revenue trend…
                </Typography>
              </Box>
            ) : isClient && !isEmptyState ? (
              <Chart
                variant="wave"
                data={chartData}
                height={320}
                maxValue={(() => {
                  const maxVal = chartData.length > 0 
                    ? Math.max(...chartData.map(point => point.value), 0)
                    : 0;
                  // Ensure maxValue is always positive and chart starts from 0
                  return maxVal > 0 ? Math.ceil(maxVal * 1.2) : 10;
                })()}
                showArea
                strokeWidth={2}
                showDataPoints
                showTooltip
                tooltipBackgroundColor="#374151"
                tooltipTextColor="#ffffff"
                textOrientation="horizontal"
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
                  {isEmptyState ? 'No revenue data for this date range.' : ''}
                </Typography>
              </Box>
            )}
          </ChartArea>
        </ChartScrollContainer>
      
      </RevenueGraphContainer>
    </RevenueContainer>
  );
}
