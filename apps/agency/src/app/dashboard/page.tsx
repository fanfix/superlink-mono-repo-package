'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Card, Typography, Image, BarChart, Icon, DateRangePicker, Loader } from '@superline/design-system';
import {
  Dashboard as DashboardIcon,
  Group as TeamsIcon,
  Person as CreatorsIcon,
  Lock as SuperLockedIcon,
  Settings as SettingsIcon,
  Link as ReferredIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  BorderBottom,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardApi } from '../../hooks/useDashboardApi';
import { useCreatorsApi } from '../../hooks/useCreatorsApi';
import { ApiError, TopCreator, createApiError } from '../../api/types';
import { exportToCsv } from '../../utils/csv';

const BASE_CHART_WIDTH = 1126;
const MIN_BAR_WIDTH = 95;
const MIN_BAR_WIDTH_DENSE = 55;
const PROFILE_BAR_WIDTH = 120;
const PROFILE_BAR_WIDTH_DENSE = 70;
const PROFILE_BAR_MAX_WIDTH = 150;
const DENSE_DATA_THRESHOLD = 18;
const TOP_CREATORS_LIMIT = 50;

export default function Dashboard() {
  const { agencyId, isLoading: authLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Fix hydration error - only render client-side after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Debug logging - track when agencyId becomes available
  useEffect(() => {
    if (!isMounted) return;
    
    console.log('Dashboard: Component state updated', {
      agencyId,
      authLoading,
      hasAgencyId: !!agencyId,
    });
    
    // Log when agencyId becomes available (after state API)
    if (agencyId && !authLoading) {
      console.log('Dashboard: agencyId is now available, APIs should trigger automatically');
    }
  }, [agencyId, authLoading, isMounted]);
  
  // Get data from context (APIs are already called in ApiContext)
  const {
    dailyVisits,
    profileVisits,
    recentActivities,
    analytics,
    creators,
    creatorsCount,
    teams,
    teamsCount,
    loading: dashboardLoading,
    error: dashboardError,
    refreshDailyVisits,
    refreshProfileVisits,
  } = useDashboardApi();
  
  const {
    totalEarnings,
    loading: earningsLoading,
    fetchTopCreators,
  } = useCreatorsApi();
  const { execute: fetchTopCreatorsExecute } = fetchTopCreators;

  // Local state for calculated values
  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  const [chartWidth, setChartWidth] = useState<number>(BASE_CHART_WIDTH);
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);
  
  // Use data from context (creators and teams count from analytics or creators/teams data)
  const totalCreators = analytics?.creators || creatorsCount || creators?.length || 0;
  const totalTeams = analytics?.teams || teamsCount || teams?.length || 0;
  
  // Ensure totalEarnings is a number (default to 0 if undefined/null)
  const safeTotalEarnings = totalEarnings ?? 0;
  // State for date ranges
  const [globalTrafficStartDate, setGlobalTrafficStartDate] = useState<Date | null>(null);
  const [globalTrafficEndDate, setGlobalTrafficEndDate] = useState<Date | null>(null);
  const [creatorVisitsStartDate, setCreatorVisitsStartDate] = useState<Date | null>(null);
  const [creatorVisitsEndDate, setCreatorVisitsEndDate] = useState<Date | null>(null);
  const [revenueStartDate, setRevenueStartDate] = useState<Date | null>(null);
  const [revenueEndDate, setRevenueEndDate] = useState<Date | null>(null);
  const [topCreators, setTopCreators] = useState<TopCreator[]>([]);
  const [topCreatorsLoading, setTopCreatorsLoading] = useState(false);
  const [topCreatorsError, setTopCreatorsError] = useState<ApiError | null>(null);
  
  // Pagination state for recent activities
  const [currentActivityPage, setCurrentActivityPage] = useState<number>(1);
  const itemsPerPage = 5; // Number of activities to show per page
  const DEFAULT_ACTIVITY_ICON = '/navbar_icon.png';
  const [activityImageErrors, setActivityImageErrors] = useState<Set<string>>(new Set());
  const totalActivityPages = Math.ceil(recentActivities.length / itemsPerPage);
  const startIndex = (currentActivityPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActivities = recentActivities.slice(startIndex, endIndex);

  // Reset to page 1 when activities change
  useEffect(() => {
    if (recentActivities.length > 0 && currentActivityPage > Math.ceil(recentActivities.length / itemsPerPage)) {
      setCurrentActivityPage(1);
    }
  }, [recentActivities.length, currentActivityPage, itemsPerPage]);

  // Format date for API
  const defaultDateRangeAppliedRef = useRef(false);

  const getDefaultDateRange = useCallback(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    // Calculate 2 months back from today
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    twoMonthsAgo.setHours(0, 0, 0, 0); // Start of day

    return { start: twoMonthsAgo, end: today };
  }, []);

  const formatDate = useCallback((date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }, []);

  // Format number with locale - only after mount to avoid hydration errors
  const formatNumber = (num: number | undefined | null): string => {
    // Handle undefined/null values
    if (num === undefined || num === null || isNaN(num)) {
      return '0';
    }
    
    if (!isMounted) return num.toString();
    return num.toLocaleString();
  };

  // Format date for display - only after mount to avoid hydration errors
  const formatDisplayDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
      if (!isMounted) return '';
      return new Date().toLocaleDateString();
    }
    if (!isMounted) return dateString;
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Format date in MM-DD-YYYY format to match DateRangePicker
  const formatDateMMDDYYYY = useCallback((date: Date | null): string => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }, []);

  // Format date in "Month Day, Year" format for Typography display
  const formatDateLong = useCallback((date: Date | null): string => {
    if (!date) return '';
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }, []);

  const getDateRangeLabel = (startDate: Date | null, endDate: Date | null): string => {
    if (!startDate || !endDate) {
      return 'Select a date range';
    }

    const startLabel = formatDateLong(startDate);
    const endLabel = formatDateLong(endDate);

    return `(${startLabel} - ${endLabel})`;
  };

  const buildCsvFilename = useCallback(
    (prefix: string, startDate: Date | null, endDate: Date | null) => {
      const safePrefix = prefix
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]+/g, '-');
      const start = formatDate(startDate) || 'start';
      const end = formatDate(endDate) || 'end';
      return `${safePrefix}-${start}_to_${end}.csv`;
    },
    [formatDate]
  );

  const normalizeNumber = (value: unknown): number => {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const updateDailyVisitRange = useCallback(
    (startDate: Date | null, endDate: Date | null) => {
      setGlobalTrafficStartDate(startDate);
      setGlobalTrafficEndDate(endDate);
      setRevenueStartDate(startDate);
      setRevenueEndDate(endDate);

      if (!agencyId) {
        return;
      }

      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);

      if (!startDateStr || !endDateStr) {
        return;
      }

      void refreshDailyVisits({
        agencyId,
        startDate: startDateStr,
        endDate: endDateStr,
      });
    },
    [agencyId, formatDate, refreshDailyVisits]
  );

  const handleCreatorVisitsDateRangeChange = useCallback(
    (startDate: Date | null, endDate: Date | null) => {
      setCreatorVisitsStartDate(startDate);
      setCreatorVisitsEndDate(endDate);

      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);

      if (!startDateStr || !endDateStr) {
        return;
      }

      void refreshProfileVisits({
        startDate: startDateStr,
        endDate: endDateStr,
      });
    },
    [formatDate, refreshProfileVisits]
  );

  const handleGlobalTrafficDateRangeChange = useCallback(
    (startDate: Date | null, endDate: Date | null) => {
      updateDailyVisitRange(startDate, endDate);
    },
    [updateDailyVisitRange]
  );

  const handleRevenueDateRangeChange = useCallback(
    (startDate: Date | null, endDate: Date | null) => {
      updateDailyVisitRange(startDate, endDate);
    },
    [updateDailyVisitRange]
  );

  const getScrollableChartWidth = useCallback(
    (datasetLength: number, minBarWidth = MIN_BAR_WIDTH) =>
      Math.max(chartWidth, datasetLength * minBarWidth),
    [chartWidth]
  );

  const formatChartLabel = useCallback(
    (dateInput: string | number | null | undefined) => {
      if (!dateInput) {
        return '';
      }

      const normaliseDateInput = (input: string | number | Date) => {
        if (input instanceof Date) {
          return input;
        }

        if (typeof input === 'number') {
          // Interpret as timestamp (ms or seconds)
          const value = input > 1_000_000_000_000 ? input : input * 1000;
          const parsed = new Date(value);
          return Number.isNaN(parsed.getTime()) ? null : parsed;
        }

        if (typeof input === 'string') {
          // ISO or recognizable string
          const trimmed = input.trim();

          if (!trimmed) {
            return null;
          }

          // Handle YYYYMMDD format
          const digitsOnly = /^\d{8}$/.test(trimmed);
          if (digitsOnly) {
            const year = Number.parseInt(trimmed.slice(0, 4), 10);
            const month = Number.parseInt(trimmed.slice(4, 6), 10) - 1;
            const day = Number.parseInt(trimmed.slice(6, 8), 10);
            const parsed = new Date(year, month, day);
            return Number.isNaN(parsed.getTime()) ? null : parsed;
          }

          // Replace underscores or slashes with hyphen for consistency
          const normalised = trimmed.replace(/_/g, '-');
          const parsed = new Date(normalised);
          return Number.isNaN(parsed.getTime()) ? null : parsed;
        }

        return null;
      };

      const dateValue = normaliseDateInput(dateInput);

      if (!dateValue) {
        return typeof dateInput === 'string' ? dateInput : String(dateInput);
      }

      if (!isMounted) {
        const isoDate = dateValue.toISOString().split('T')[0];
        const match = isoDate.match(/^\d{4}-(\d{2})-(\d{2})$/);
        if (match) {
          return `${match[1]}/${match[2]}`;
        }
        return isoDate;
      }

      return dateValue.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    },
    [isMounted]
  );

  const getPaddedMaxValue = useCallback((data: Array<{ value: number }>) => {
    if (!data || data.length === 0) {
      return 10;
    }

    const maxValue = Math.max(...data.map(item => item.value));
    if (maxValue === 0) {
      return 10;
    }

    const padded = Math.ceil(maxValue * 1.2);
    return padded < 10 ? 10 : padded;
  }, []);

  /**
   * Normalize date string to YYYY-MM-DD format
   * Handles both YYYY-MM-DD and YYYYMMDD formats
   */
  const normalizeDateToYYYYMMDD = useCallback((dateInput: string | null | undefined): string | null => {
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
    // Try to parse and reformat
    try {
      // Replace underscores or slashes with hyphens for consistency
      const normalized = trimmed.replace(/[_\s]/g, '-');
      const date = new Date(normalized);
      
      if (isNaN(date.getTime())) {
        return null;
      }

      // Format to YYYY-MM-DD
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
      if (!dateStr || !startDate || !endDate) return true; // Include if no range selected

      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return true;

        // Set time to start/end of day for proper comparison
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

        return date >= start && date <= end;
      } catch {
        return true;
      }
    },
    []
  );

  /**
   * Sample dates from date range to show approximately 14 days
   * Picks 3-6 dates from each month in the range
   */
  const sampleDatesFromRange = useCallback((startDate: Date, endDate: Date): string[] => {
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
      
      // Determine how many dates to sample (3-6, or all if less than 3)
      let sampleCount = Math.min(6, Math.max(3, Math.floor(totalDays / 3)));
      if (totalDays < 3) {
        sampleCount = totalDays;
      }

      // Calculate step to evenly distribute samples
      const step = totalDays > sampleCount ? Math.floor(totalDays / sampleCount) : 1;
      
      // Sample dates evenly across the month
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
  }, []);

  /**
   * Process and filter daily visits data with:
   * - Date normalization to YYYY-MM-DD
   * - Date range filtering
   * - MUST show all dates that have records (visits > 0 OR revenue > 0)
   * - Show all records from start date up to last record date
   * - Fill remaining slots (up to ~14 days) with sampled dates
   * - Including zero-value records for sampled dates
   * - Sorting by date
   * 
   * Returns processed data with normalized dates and numeric values
   */
  const processGlobalTrafficData = useCallback(() => {
    if (!dailyVisits || dailyVisits.length === 0) {
      return [];
    }

    // Process all data with normalized dates
    const allProcessedData = dailyVisits
      .map(visit => {
        // Normalize date to YYYY-MM-DD format
        const normalizedDate = normalizeDateToYYYYMMDD(visit.date);
        
        if (!normalizedDate) {
          return null; // Skip invalid dates
        }

        // Get numeric values
        const visits = normalizeNumber(visit.visits);
        const revenue = normalizeNumber(visit.revenue);

        return {
          originalDate: visit.date,
          normalizedDate,
          visits,
          revenue,
        };
      })
      .filter((item): item is NonNullable<typeof item> => {
        if (!item) return false;

        // Apply date range filter if dates are selected
        if (globalTrafficStartDate && globalTrafficEndDate) {
          return isDateInRange(item.normalizedDate, globalTrafficStartDate, globalTrafficEndDate);
        }

        return true;
      });

    // If date range is selected
    if (globalTrafficStartDate && globalTrafficEndDate) {
      // Separate records with data (visits > 0 OR revenue > 0) from zero records
      const recordsWithData = allProcessedData.filter(item => item.visits > 0 || item.revenue > 0);
      const zeroRecords = allProcessedData.filter(item => item.visits === 0 && item.revenue === 0);

      // Find the last record date (from records with data)
      let lastRecordDate: Date | null = null;
      if (recordsWithData.length > 0) {
        const sortedRecords = [...recordsWithData].sort((a, b) => {
          const dateA = new Date(a.normalizedDate);
          const dateB = new Date(b.normalizedDate);
          return dateB.getTime() - dateA.getTime(); // Descending to get last
        });
        lastRecordDate = new Date(sortedRecords[0].normalizedDate);
      }

      // Create a map of all existing data by date
      const dataByDate = new Map<string, typeof allProcessedData[0]>();
      allProcessedData.forEach(item => {
        dataByDate.set(item.normalizedDate, item);
      });

      // MUST include all records with data (visits > 0 OR revenue > 0)
      const datesWithRecords = new Set<string>();
      recordsWithData.forEach(item => {
        datesWithRecords.add(item.normalizedDate);
      });

      // Build all dates from start date up to last record date
      const allDatesInRange: string[] = [];
      if (lastRecordDate) {
        const start = new Date(globalTrafficStartDate);
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
        // If no records with data, use all available dates
        allProcessedData.forEach(item => {
          allDatesInRange.push(item.normalizedDate);
        });
      }

      // If we have more than ~14 days, sample while ensuring all records with data are included
      let resultDates: string[];
      if (allDatesInRange.length > 14) {
        // Sort dates
        allDatesInRange.sort((a, b) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateA.getTime() - dateB.getTime();
        });

        // Always include first and last date
        const sampledDates = new Set<string>();
        sampledDates.add(allDatesInRange[0]);
        sampledDates.add(allDatesInRange[allDatesInRange.length - 1]);

        // MUST include all dates that have records
        datesWithRecords.forEach(date => sampledDates.add(date));

        // If still less than 14, sample evenly from remaining dates
        if (sampledDates.size < 14) {
          const step = Math.floor(allDatesInRange.length / (14 - sampledDates.size));
          for (let i = step; i < allDatesInRange.length - 1; i += step) {
            if (sampledDates.size >= 14) break;
            sampledDates.add(allDatesInRange[i]);
          }
        }

        // If still more than 14, reduce by removing dates without records (but keep first/last)
        if (sampledDates.size > 14) {
          const sortedSampled = Array.from(sampledDates).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA.getTime() - dateB.getTime();
          });
          
          const finalDates = new Set<string>();
          finalDates.add(sortedSampled[0]); // First
          finalDates.add(sortedSampled[sortedSampled.length - 1]); // Last
          
          // Add all dates with records
          datesWithRecords.forEach(date => finalDates.add(date));
          
          // Add remaining dates evenly to reach ~14
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

      const result = resultDates.map(dateStr => {
        const existing = dataByDate.get(dateStr);
        if (existing) {
          return existing;
        }
        // Create zero-value record for date if no data exists
        return {
          originalDate: dateStr,
          normalizedDate: dateStr,
          visits: 0,
          revenue: 0,
        };
      });

      // Sort by date (ascending)
      return result.sort((a, b) => {
        const dateA = new Date(a.normalizedDate);
        const dateB = new Date(b.normalizedDate);
        return dateA.getTime() - dateB.getTime();
      });
    }

    // If no date range selected, return all processed data sorted
    return allProcessedData.sort((a, b) => {
      const dateA = new Date(a.normalizedDate);
      const dateB = new Date(b.normalizedDate);
      return dateA.getTime() - dateB.getTime();
    });
  }, [dailyVisits, normalizeDateToYYYYMMDD, normalizeNumber, isDateInRange, globalTrafficStartDate, globalTrafficEndDate, sampleDatesFromRange]);

  /**
   * Prepare Global Traffic chart data from processed data
   */
  const globalTrafficChartData = useMemo(() => {
    const processedData = processGlobalTrafficData();
    
    return processedData.map(item => ({
      date: formatChartLabel(item.normalizedDate),
      value: item.visits,
    }));
  }, [processGlobalTrafficData, formatChartLabel]);

  const revenueChartData = useMemo(
    () =>
      topCreators.length > 0
        ? topCreators.map(creator => ({
            date: creator.name || creator.id,
            value: creator.earnings || 0,
          }))
        : [],
    [topCreators]
  );

  const profileVisitsChartData = useMemo(
    () =>
      profileVisits.length > 0
        ? profileVisits.slice(0, 50).map(visit => ({
            date: visit.pageName || visit.username || '',
            value: visit.profileVisits || 0,
          }))
        : [],
    [profileVisits]
  );

  // Calculate dynamic bar width based on data length
  const calculateGlobalBarWidth = useCallback(() => {
    const dataLength = globalTrafficChartData.length;
    if (dataLength === 0) return MIN_BAR_WIDTH;
    
    // For large datasets (3 months = ~90 days), use minimum 2px width
    if (dataLength > 60) {
      return Math.max(2, Math.min(7, chartWidth / dataLength * 0.8));
    }
    // For medium datasets, use 5-7px
    if (dataLength > DENSE_DATA_THRESHOLD) {
      return MIN_BAR_WIDTH_DENSE;
    }
    // For small datasets, use normal width
    return MIN_BAR_WIDTH;
  }, [globalTrafficChartData.length, chartWidth]);
  
  const globalBarWidth = calculateGlobalBarWidth();
  const globalTrafficChartWidth = getScrollableChartWidth(
    globalTrafficChartData.length || 1,
    globalBarWidth
  );
  // Only enable scroll on mobile/tablet, disable on large screens
  const globalTrafficShouldScroll = !isLargeScreen && globalTrafficChartWidth > chartWidth;

  const profileBarWidth =
    profileVisitsChartData.length > DENSE_DATA_THRESHOLD
      ? PROFILE_BAR_WIDTH_DENSE
      : PROFILE_BAR_WIDTH;
  const profileVisitsChartWidth = getScrollableChartWidth(
    profileVisitsChartData.length || 1,
    profileBarWidth
  );
  const profileVisitsShouldScroll = profileVisitsChartWidth > chartWidth;

  const revenueBarWidth =
    revenueChartData.length > DENSE_DATA_THRESHOLD ? MIN_BAR_WIDTH_DENSE : MIN_BAR_WIDTH;
  const revenueChartWidth = getScrollableChartWidth(
    revenueChartData.length || 1,
    revenueBarWidth
  );
  const revenueShouldScroll = revenueChartWidth > chartWidth;
  const hasGlobalTrafficData = dailyVisits.length > 0;
  const hasProfileVisitsData = profileVisits.length > 0;
  const hasRevenueData = topCreators.length > 0;

  const handleDownloadGlobalTraffic = useCallback(() => {
    // Use the same processed data as the chart for consistency
    const processedData = processGlobalTrafficData();
    
    const rows = processedData.map(item => ({
      date: item.normalizedDate, // Use normalized YYYY-MM-DD format
      visitors: item.visits,
      revenue: item.revenue,
    }));

    const filename = buildCsvFilename('global-traffic', globalTrafficStartDate, globalTrafficEndDate);

    exportToCsv(
      filename,
      [
        { label: 'Date', value: row => row.date },
        { label: 'Visitors', value: row => row.visitors },
        { label: 'Revenue', value: row => row.revenue },
      ],
      rows
    );
  }, [processGlobalTrafficData, buildCsvFilename, globalTrafficStartDate, globalTrafficEndDate]);

  const handleDownloadProfileVisits = useCallback(() => {
    const rows = profileVisits.map(visit => ({
      name: visit.pageName || visit.username || '',
      profileVisits: normalizeNumber(visit.profileVisits),
      username: visit.username || '',
      pageName: visit.pageName || '',
    }));

    const filename = buildCsvFilename(
      'profile-visits',
      creatorVisitsStartDate,
      creatorVisitsEndDate
    );

    exportToCsv(
      filename,
      [
        { label: 'Creator', value: row => row.name || row.pageName || row.username },
        { label: 'Profile Visits', value: row => row.profileVisits },
      ],
      rows
    );
  }, [profileVisits, buildCsvFilename, creatorVisitsStartDate, creatorVisitsEndDate, normalizeNumber]);

  const handleDownloadTopRevenue = useCallback(() => {
    const rows = topCreators.map(creator => ({
      name: creator.name || creator.id || '',
      earnings: normalizeNumber(creator.earnings),
      visits: normalizeNumber((creator as any)?.visits),
      id: creator.id,
    }));

    const filename = buildCsvFilename(
      'top-creators-revenue',
      revenueStartDate,
      revenueEndDate
    );

    exportToCsv(
      filename,
      [
        { label: 'Creator', value: row => row.name },
        { label: 'Earnings', value: row => row.earnings },
        { label: 'Visits', value: row => row.visits },
        { label: 'Creator ID', value: row => row.id },
      ],
      rows
    );
  }, [topCreators, buildCsvFilename, revenueStartDate, revenueEndDate, normalizeNumber]);

  useEffect(() => {
    if (!isMounted) return;

    const element = chartWrapperRef.current;
    if (!element) return;

    const assignWidth = (width: number) => {
      if (!width || width <= 0) return;
      setChartWidth(prev => (Math.abs(prev - width) < 1 ? prev : width));
    };

    const measure = () => {
      assignWidth(element.clientWidth);
    };

    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(entries => {
        const entry = entries[0];
        if (!entry) return;
        assignWidth(entry.contentRect.width);
      });

      observer.observe(element);
      return () => {
        observer.disconnect();
      };
    }

    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
    };
  }, [isMounted]);
  useEffect(() => {
    if (!isMounted || !agencyId || defaultDateRangeAppliedRef.current) {
      return;
    }

    const { start, end } = getDefaultDateRange();

    defaultDateRangeAppliedRef.current = true;

    updateDailyVisitRange(start, end);
    handleCreatorVisitsDateRangeChange(start, end);
  }, [
    agencyId,
    getDefaultDateRange,
    handleCreatorVisitsDateRangeChange,
    isMounted,
    updateDailyVisitRange,
  ]);


  // Calculate derived values from context data
  useEffect(() => {
    if (!isMounted) return;
    
    // Calculate total visitors from filtered/processed data (same as chart)
    const processedData = processGlobalTrafficData();
    if (processedData && processedData.length > 0) {
      const totalVisits = processedData.reduce((sum, item) => sum + item.visits, 0);
      setTotalVisitors(totalVisits);
    } else {
      setTotalVisitors(0);
    }
  }, [processGlobalTrafficData, isMounted]);
  
  // Debug logging - verify data is coming
  useEffect(() => {
    if (!isMounted) return;
    
    console.log('Dashboard: Data from context', {
      dailyVisits: dailyVisits.length,
      profileVisits: profileVisits.length,
      recentActivities: recentActivities.length,
      analytics: analytics ? 'Yes' : 'No',
      totalEarnings,
      creators: creators.length,
      creatorsCount,
      teams: teams.length,
      teamsCount,
      totalCreators,
      totalTeams,
      totalVisitors,
    });
  }, [dailyVisits, profileVisits, recentActivities, analytics, totalEarnings, creators, creatorsCount, teams, teamsCount, totalCreators, totalTeams, totalVisitors, isMounted]);

  useEffect(() => {
    if (!agencyId || !revenueStartDate || !revenueEndDate) {
      return;
    }

    const startDate = formatDate(revenueStartDate);
    const endDate = formatDate(revenueEndDate);

    if (!startDate || !endDate) {
      return;
    }

    let isSubscribed = true;

    const fetchData = async () => {
      setTopCreatorsLoading(true);
      setTopCreatorsError(null);

      try {
        const result = await fetchTopCreatorsExecute({
          agencyId,
          limit: TOP_CREATORS_LIMIT,
          startDate,
          endDate,
        });

        if (isSubscribed && result) {
          setTopCreators(result);
        }
      } catch (error: any) {
        if (isSubscribed) {
          const apiError = error instanceof ApiError ? error : createApiError(error);
          setTopCreatorsError(apiError);
          setTopCreators([]);
        }
      } finally {
        if (isSubscribed) {
          setTopCreatorsLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      isSubscribed = false;
    };
  }, [agencyId, revenueStartDate, revenueEndDate, fetchTopCreatorsExecute, formatDate]);

  // Style objects for complex styling
  const mainContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    padding: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)', lg: 'var(--padding-2xl)' },
    gap: { xs: 'var(--padding-lg)', sm: 'var(--padding-xl)', md: 'var(--padding-2xl)' },
    backgroundColor: 'var(--color-white-sidebar)',
    position: 'relative',
    width: '100%',
    overflowX: 'hidden',
  };

  const activityImageStyles = {
    marginLeft: 'var(--padding-avatar-sm)',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  };

  const activityDescriptionStyles = {
    color: 'var(--color-black-secondary)',
    fontWeight: 'var(--font-weight-semibold)',
    wordBreak: 'break-word',
  };

  const activityTimestampStyles = {
    color: 'var(--color-grey-light)',
    fontSize: 'var(--font-size-sm)',
  };

  const noActivitiesStyles = {
    color: 'var(--color-grey-main)',
    padding: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)' },
    textAlign: 'center',
  };

  const paginationInfoStyles = {
    color: 'var(--color-grey-light)',
    fontSize: { xs: 'var(--font-size-xs)', sm: 'var(--font-size-sm)' },
    display: { xs: 'none', sm: 'block' },
  };

  const paginationTypographyStyles = {
    fontSize: 'var(--font-size-pagination)',
    fontWeight: 'var(--font-weight-pagination)',
  };

  const chartTitleStyles = {
    color: 'var(--color-black-secondary)',
    fontWeight: 'bold',
  };

  const datePickerStyles = {
    padding: 'var(--padding-sm)',
    width: { xs: '100%', sm: 'auto' },
  };

  const totalVisitorsLabelStyles = {
    color: 'var(--color-grey-light)',
    fontWeight: 'var(--font-weight-bold)',
  };

  const downloadIconStyles = (isEnabled: boolean) => ({
    fontSize: 'var(--font-size-icon-sm)',
    color: 'var(--color-black)',
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    opacity: isEnabled ? 1 : 0.4,
  });

  const chartWrapperStyles = {
    width: '100%',
    minWidth: '100%',
    minHeight: { xs: '320px', sm: '360px' },
    height: 'auto',
    overflow: isLargeScreen ? 'visible' : 'auto',
  };

  const profileVisitsChartWrapperStyles = {
    width: '100%',
    minWidth: '100%',
    minHeight: { xs: '360px', sm: '420px' },
    height: 'auto',
  };

  const revenueChartWrapperStyles = {
    width: '100%',
    minWidth: '100%',
    minHeight: { xs: '340px', sm: '400px' },
    height: 'auto',
  };

  const loadingContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--padding-md)',
    marginBottom: 'var(--padding-md)',
  };

  const errorMessageStyles = {
    color: 'var(--color-error-main)',
    marginBottom: 'var(--padding-md)',
  };

  const noDataMessageStyles = {
    color: 'var(--color-grey-light)',
    marginBottom: 'var(--padding-md)',
  };

  const topSectionStyles = {
    display: 'flex',
    gap: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)' },
    alignItems: 'flex-start',
    flexDirection: { xs: 'column', md: 'row' },
    width: '100%',
  };

  const revenueCardsContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)' },
    width: { xs: '100%', lg: 'var(--width-card-lg)' },
    minWidth: { xs: '100%', md: 'var(--width-sm)' },
    flex: { xs: '1 1 100%', lg: '0 0 auto' },
  };

  const revenueCardStyles = {
    width: '100%',
    height: { xs: 'auto', lg: 'var(--height-card-sm)' },
    padding: 'var(--padding-xl)',
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: { xs: 'flex-start', lg: 'center' },
    gap: { xs: 'var(--padding-md)', lg: 0 },
  };

  const revenueCardCenteredStyles = {
    width: '100%',
    height: { xs: 'auto', lg: 'var(--height-card-sm)' },
    padding: 'var(--padding-xl)',
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: { xs: 'flex-start', lg: 'center' },
    gap: { xs: 'var(--padding-md)', lg: 0 },
  };

  const recentActivityCardStyles = {
    width: { xs: '100%', lg: 'var(--width-card)' },
    height: { xs: 'auto', md: 'var(--height-card-lg)' },
    minHeight: { xs: '400px', md: 'var(--height-card-lg)' },
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    flex: { xs: '1 1 100%', lg: '1 1 auto' },
  };

  const activityHeaderStyles = {
    color: 'var(--color-black-secondary)',
    padding: 'var(--padding-xl)',
    borderBottom: '1px solid var(--color-border-light)',
  };

  const activityListStyles = {
    display: 'flex',
    flexDirection: 'column',
    padding: { xs: '0 var(--padding-md)', sm: '0 var(--padding-lg)', md: '0 var(--padding-xl)' },
    gap: { xs: 'var(--padding-sm)', sm: 'var(--padding-md)' },
    flex: 1,
    overflowY: 'auto',
    maxHeight: { xs: '300px', sm: '400px', md: '500px' },
    minHeight: { xs: '200px', sm: '300px' },
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'var(--color-white-dull)',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'var(--color-grey-light)',
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: 'var(--color-grey-main)',
      },
    },
  };

  const activityItemStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-avatar-sm)',
  };

  const activityContentStyles = {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 'var(--padding-xl)',
    paddingBottom: 'var(--padding-xl)',
  };

  const paginationContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: { xs: 'center', sm: 'flex-end' },
    padding: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)',  },
    borderTop: '1px solid var(--color-border-light)',
    gap: { xs: 'var(--padding-sm)', sm: 'var(--padding-md)' },
    flexWrap: { xs: 'wrap', sm: 'nowrap' },
  };

  const paginationBoxStyles = {
    display: 'flex',
    alignItems: 'baseline',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-pagination-border)',
    borderRadius: 'var(--border-radius-pagination)',
    height: 'var(--height-pagination-sm)',
    overflow: 'hidden',
  };

  const paginationButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--width-pagination-sm)',
    height: 'var(--height-pagination-sm)',
    cursor: 'pointer',
    color: 'var(--color-pagination-text)',
    borderRight: '1px solid var(--color-pagination-border)',
    transition: 'background-color 0.2s ease',
    border: 'none',
    background: 'transparent',
    padding: 0,
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--color-pagination-hover)',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
      pointerEvents: 'none',
    },
  };

  const currentPageStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--width-pagination-sm)',
    height: 'var(--height-pagination-sm)',
    color: 'var(--color-pagination-current)',
    borderRight: '1px solid var(--color-pagination-border)',
    fontSize: 'var(--font-size-pagination)',
    fontWeight: 'var(--font-weight-pagination)',
    backgroundColor: 'var(--color-pagination-hover)',
  };

  // Pagination handlers
  const handleFirstPage = () => {
    if (currentActivityPage > 1) {
      setCurrentActivityPage(1);
    }
  };

  const handlePrevPage = () => {
    if (currentActivityPage > 1) {
      setCurrentActivityPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentActivityPage < totalActivityPages) {
      setCurrentActivityPage(prev => prev + 1);
    }
  };

  const handleLastPage = () => {
    if (currentActivityPage < totalActivityPages) {
      setCurrentActivityPage(totalActivityPages);
    }
  };

  const chartCardStyles = {
    width: '100%',
    padding: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)' },
    height: 'auto',
  minHeight: { xs: '420px', sm: '480px', md: '520px' },
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
    marginBottom: { xs: 'var(--padding-lg)', sm: 'var(--padding-xl)' },
  };

  const chartHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)' },
    marginBottom: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)' },
  };

  const chartTitleContainerStyles = {
    marginBottom: { xs: 'var(--padding-md)', sm: 'var(--margin-chart-xl)' },
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 'var(--padding-sm)', sm: 'var(--padding-lg)' },
    flex: 1,
  };

  const dateContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: { xs: 'flex-start', sm: 'center' },
    padding: { xs: 'var(--padding-sm)', sm: 'var(--padding-md)' },
    backgroundColor: 'var(--color-white-dull)',
    borderRadius: 'var(--border-radius-pagination)',
    width: { xs: '100%', sm: 'auto' },
    border: '1px solid #e4e4e4',
  };

  const dateInnerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
  };

  const statsContainerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)' },
    marginBottom: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)' },
  };

  const statsLeftStyles = {
    display: 'flex',
    gap: { xs: 'var(--padding-sm)', sm: 'var(--padding-md)' },
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'flex-start', sm: 'center' },
    width: { xs: '100%', sm: 'auto' },
  };

  const statsRightStyles = {
    display: 'flex',
    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
    alignItems: 'center',
    gap: 'var(--padding-sm)',
    width: { xs: '100%', sm: 'auto' },
  };

  const chartContainerStyles = {
    width: '100%',
    overflowX: isLargeScreen ? 'visible' : 'auto',
    overflowY: 'hidden',
    maxWidth: '100%',
    padding: { xs: 'var(--padding-sm) 0', sm: 'var(--padding-md) 0' },
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    scrollbarColor: 'var(--color-grey-light) var(--color-white-dull)',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      height: isLargeScreen ? '0px' : '10px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'var(--color-white-dull)',
      borderRadius: 'var(--border-radius-md)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'var(--color-grey-light)',
      borderRadius: 'var(--border-radius-md)',
      border: '2px solid var(--color-white-dull)',
      minWidth: '80px',
    },
  };

  // Show loader while initial data is loading
  if (authLoading || (dashboardLoading && !analytics && !dailyVisits)) {
    return (
      <Box sx={mainContainerStyles}>
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
            Loading dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={mainContainerStyles}>
      {/* Top Section - Revenue Cards and Recent Activity */}
      <Box sx={topSectionStyles}>
        {/* Revenue Cards - Left Side (Column Layout) */}
        <Box sx={revenueCardsContainerStyles}>
          {/* Revenue Card */}
          <Card onClick={() => {}} sx={revenueCardStyles}>
            <Typography
              variant="text-md"
              sx={{
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--padding-xl)',
                fontWeight: 'var(--font-weight-medium) !important',
              }}
            >
              Revenue
            </Typography>
            <Typography
              variant="heading-lg"
              sx={{
                color: 'var(--color-black-secondary)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              ${formatNumber(safeTotalEarnings)}
            </Typography>
          </Card>

          {/* Total Creators Card */}
          <Card onClick={() => {}} sx={revenueCardCenteredStyles}>
            <Typography
              variant="text-md"
              sx={{
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--padding-xl)',
                fontWeight: 'var(--font-weight-medium) !important',
              }}
            >
              Total Creators
            </Typography>
            <Typography
              variant="heading-lg"
              sx={{
                color: 'var(--color-black-secondary)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              {totalCreators}
            </Typography>
          </Card>

          {/* Total Teams Card */}
          <Card onClick={() => {}} sx={revenueCardCenteredStyles}>
            <Typography
              variant="text-md"
              sx={{
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--padding-xl)',
                fontWeight: 'var(--font-weight-medium) !important',
              }}
            >
              Total Teams
            </Typography>
            <Typography
              variant="heading-lg"
              sx={{
                color: 'var(--color-black-secondary)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              {totalTeams}
            </Typography>
          </Card>
        </Box>

        {/* Recent Activity Card - Right Side */}
        <Card onClick={() => {}} sx={recentActivityCardStyles}>
          <Typography variant="heading-sm" sx={activityHeaderStyles}>
            Recent activity
          </Typography>

          {/* Activity List */}
          <Box sx={activityListStyles}>
            {paginatedActivities.length > 0 ? paginatedActivities.map((activity, index) => {
              const activityKey = activity.id || `activity-${startIndex + index}`;
              const backendImage = activity.profileImage || activity.imageURL;
              const useFallback = activityImageErrors.has(activityKey) || !backendImage || (typeof backendImage === 'string' && backendImage.trim() === '');
              const imageSrc = useFallback ? DEFAULT_ACTIVITY_ICON : (backendImage as string);
              return (
              <Box key={activityKey} sx={activityItemStyles}>
                <Image
                  src={imageSrc}
                  alt="Profile"
                  variant="rounded-full"
                  width="var(--width-avatar-md)"
                  height="var(--height-avatar-md)"
                  sx={activityImageStyles}
                  className=""
                  onClick={() => {}}
                  onError={() => {
                    setActivityImageErrors((prev) => new Set(prev).add(activityKey));
                  }}
                />
                <Box sx={activityContentStyles}>
                  <Typography
                    variant="text-sm"
                    sx={activityDescriptionStyles}
                  >
                    {activity.description || activity.message || activity.type || 'Activity'}
                  </Typography>
                  <Typography
                    variant="text-sm"
                    sx={activityTimestampStyles}
                  >
                    {formatDisplayDate(activity.timestamp)}
                  </Typography>
                </Box>
              </Box>
            ); }) : (
              <Typography 
                variant="text-sm" 
                sx={noActivitiesStyles}
              >
                No recent activities
              </Typography>
            )}
          </Box>

          {/* Pagination - Bottom */}
          {recentActivities.length > itemsPerPage && (
            <Box sx={paginationContainerStyles}>
              {/* Pagination Info */}
              <Typography
                variant="text-sm"
                sx={paginationInfoStyles}
              >
                Showing {startIndex + 1}-{Math.min(endIndex, recentActivities.length)} of {recentActivities.length}
              </Typography>

              {/* Pagination Container */}
              <Box sx={paginationBoxStyles}>
                {/* First Page Button */}
                <Box
                  sx={paginationButtonStyles}
                  onClick={handleFirstPage}
                  component="button"
                  disabled={currentActivityPage === 1}
                  aria-label="First page"
                >
                  <Typography sx={paginationTypographyStyles}>
                    «
                  </Typography>
                </Box>

                {/* Previous Page Button */}
                <Box
                  sx={paginationButtonStyles}
                  onClick={handlePrevPage}
                  component="button"
                  disabled={currentActivityPage === 1}
                  aria-label="Previous page"
                >
                  <Typography sx={paginationTypographyStyles}>
                    ‹
                  </Typography>
                </Box>

                {/* Current Page */}
                <Box sx={currentPageStyles}>{currentActivityPage}</Box>

                {/* Next Page Button */}
                <Box
                  sx={paginationButtonStyles}
                  onClick={handleNextPage}
                  component="button"
                  disabled={currentActivityPage >= totalActivityPages}
                  aria-label="Next page"
                >
                  <Typography sx={paginationTypographyStyles}>
                    ›
                  </Typography>
                </Box>

                {/* Last Page Button */}
                <Box
                  sx={paginationButtonStyles}
                  onClick={handleLastPage}
                  component="button"
                  disabled={currentActivityPage >= totalActivityPages}
                  aria-label="Last page"
                >
                  <Typography sx={paginationTypographyStyles}>
                    »
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Card>
      </Box>

      {/* Chart Section */}
      <Card onClick={() => {}} sx={chartCardStyles}>
        {/* Chart Header */}
        <Box sx={chartHeaderStyles}>
          <Box sx={chartTitleContainerStyles}>
            <Typography
              variant="heading-sm"
              sx={chartTitleStyles}
            >
              Global Traffic
            </Typography>
            <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
              {getDateRangeLabel(globalTrafficStartDate, globalTrafficEndDate)}
            </Typography>
          </Box>

          <Box sx={dateContainerStyles}>
            <DateRangePicker
              startDate={globalTrafficStartDate}
              endDate={globalTrafficEndDate}
              onDateRangeSelect={handleGlobalTrafficDateRangeChange}
              placeholder={getDateRangeLabel(globalTrafficStartDate, globalTrafficEndDate)}
              dateFormat="MM-DD-YYYY"
              inputWidth="100%"
              inputHeight="30px"
              calendarWidth="600px"
              showFormatPlaceholder={false}
              sx={datePickerStyles}
            />
          </Box>
        </Box>

        <Box sx={statsContainerStyles}>
          <Box sx={statsLeftStyles}>
            {/* Total Visitors */}
            <Typography
              variant="heading-sm"
              sx={chartTitleStyles}
            >
              {formatNumber(totalVisitors)}
            </Typography>
            <Typography
              variant="text-sm"
              sx={totalVisitorsLabelStyles}
            >
              Total Visitors
            </Typography>
          </Box>

          <Box sx={statsRightStyles}>
            <DownloadIcon
              sx={downloadIconStyles(hasGlobalTrafficData)}
              onClick={hasGlobalTrafficData ? handleDownloadGlobalTraffic : undefined}
              aria-label="Download global traffic data as CSV"
            />
          </Box>
        </Box>

        {/* Chart */}
        <Box sx={chartContainerStyles} ref={chartWrapperRef}>
          <Box sx={chartWrapperStyles}>
            <BarChart
              data={globalTrafficChartData}
              width={isLargeScreen ? chartWidth : (globalTrafficShouldScroll ? globalTrafficChartWidth : chartWidth)}
              height={380}
              maxValue={getPaddedMaxValue(globalTrafficChartData)}
              textOrientation="angled"
              textAngle={-45}
              textSpacing={15}
              enableHorizontalScroll={globalTrafficShouldScroll}
              minBarWidth={Math.max(2, globalBarWidth)}
              maxBarWidth={Math.max(2, globalBarWidth)}
              fixedBarSpacing={globalTrafficChartData.length > 60 ? 1 : (isLargeScreen ? 2 : 1)}
              barColor="#F3F3F4F4"
              className=""
              onDataPointClick={(dataPoint: any) => console.log('Bar clicked:', dataPoint)}
            />
          </Box>
        </Box>
      </Card>

      <Card onClick={() => {}} sx={chartCardStyles}>
        {/* Chart Header */}
        <Box sx={chartHeaderStyles}>
          <Box sx={chartTitleContainerStyles}>
            <Typography
              variant="heading-sm"
              sx={chartTitleStyles}
            >
              Top 50 Creator Profile Visits
            </Typography>
            <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
              {getDateRangeLabel(creatorVisitsStartDate, creatorVisitsEndDate)}
            </Typography>
          </Box>

          <Box sx={dateContainerStyles}>
            <DateRangePicker
              startDate={creatorVisitsStartDate}
              endDate={creatorVisitsEndDate}
              onDateRangeSelect={handleCreatorVisitsDateRangeChange}
              placeholder={getDateRangeLabel(creatorVisitsStartDate, creatorVisitsEndDate)}
              dateFormat="MM-DD-YYYY"
              inputWidth="100%"
              inputHeight="30px"
              calendarWidth="600px"
              showFormatPlaceholder={false}
              sx={datePickerStyles}
            />
          </Box>
        </Box>

        <Box sx={statsRightStyles}>
          <DownloadIcon
            sx={downloadIconStyles(hasProfileVisitsData)}
            onClick={hasProfileVisitsData ? handleDownloadProfileVisits : undefined}
            aria-label="Download profile visits data as CSV"
          />
        </Box>

        {/* Chart */}
        {topCreatorsLoading && (
          <Box sx={loadingContainerStyles}>
            <Loader size={32} color="black" />
            <Typography
              variant="text-sm"
              sx={{
                color: 'var(--color-grey-light)',
              }}
            >
              Loading top creator revenue…
            </Typography>
          </Box>
        )}
        {!topCreatorsLoading && topCreatorsError && (
          <Typography
            variant="text-sm"
            sx={errorMessageStyles}
          >
            Unable to load top creator revenue. Please try a different range.
          </Typography>
        )}
        {!topCreatorsLoading && !topCreatorsError && profileVisitsChartData.length === 0 && (
          <Typography
            variant="text-sm"
            sx={noDataMessageStyles}
          >
            No revenue data available for this date range.
          </Typography>
        )}
        <Box sx={chartContainerStyles}>
          <Box sx={profileVisitsChartWrapperStyles}>
            <BarChart
              data={profileVisitsChartData}
              width={profileVisitsShouldScroll ? profileVisitsChartWidth : chartWidth}
              height={520}
              maxValue={getPaddedMaxValue(profileVisitsChartData)}
              textOrientation="horizontal"
              textSpacing={15}
              enableHorizontalScroll={profileVisitsShouldScroll}
              minBarWidth={profileBarWidth}
              maxBarWidth={PROFILE_BAR_MAX_WIDTH}
              fixedBarSpacing={profileVisitsShouldScroll ? 26 : 32}
              barColor="#F3F3F4F4"
              className=""
              onDataPointClick={(dataPoint: any) => console.log('Bar clicked:', dataPoint)}
            />
          </Box>
        </Box>
      </Card>

      <Card onClick={() => {}} sx={chartCardStyles}>
        {/* Chart Header */}
        <Box sx={chartHeaderStyles}>
          <Box sx={chartTitleContainerStyles}>
            <Typography
              variant="heading-sm"
              sx={chartTitleStyles}
            >
              Top 50 SL Revenue by User
            </Typography>
            <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
              {getDateRangeLabel(revenueStartDate, revenueEndDate)}
            </Typography>
          </Box>

          <Box sx={dateContainerStyles}>
            <DateRangePicker
              startDate={revenueStartDate}
              endDate={revenueEndDate}
              onDateRangeSelect={handleRevenueDateRangeChange}
              placeholder={getDateRangeLabel(revenueStartDate, revenueEndDate)}
              dateFormat="MM-DD-YYYY"
              inputWidth="100%"
              inputHeight="30px"
              calendarWidth="600px"
              showFormatPlaceholder={false}
              sx={datePickerStyles}
            />
          </Box>
        </Box>

        <Box sx={statsRightStyles}>
          <DownloadIcon
            sx={downloadIconStyles(hasRevenueData)}
            onClick={hasRevenueData ? handleDownloadTopRevenue : undefined}
            aria-label="Download top creators revenue data as CSV"
          />
        </Box>

        {/* Chart */}
        <Box sx={chartContainerStyles}>
          <Box sx={revenueChartWrapperStyles}>
            <BarChart
              data={revenueChartData}
              width={revenueShouldScroll ? revenueChartWidth : chartWidth}
              height={460}
              maxValue={getPaddedMaxValue(revenueChartData)}
              textOrientation="horizontal"
              textSpacing={15}
              enableHorizontalScroll={revenueShouldScroll}
              minBarWidth={revenueBarWidth}
              maxBarWidth={MIN_BAR_WIDTH}
              fixedBarSpacing={22}
              barColor="#F3F3F4F4"
              className=""
              onDataPointClick={(dataPoint: any) => console.log('Bar clicked:', dataPoint)}
            />
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
