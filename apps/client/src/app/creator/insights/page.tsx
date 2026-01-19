'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import AllTimeSection from './components/AllTimeSection';
import DateRangeSelector from './components/DateRangeSelector';
import PageActivitySection from './components/PageActivitySection';
import AdditionalStatsSection from './components/AdditionalStatsSection';
import { useGetAllInsights, useGetGraphCalendar, useGetClicksInsights } from '../../../hooks/useInsightsApi';

// DotGraphPoint type definition
interface DotGraphPoint {
  label: string;
  value: number;
  color: string;
}

/**
 * Format date to YYYY-MM-DD
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Subtract days from current date
 */
const subtractDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
};

/**
 * Format date for display (MMM d)
 */
const formatDateDisplay = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

// Style variables
const pageContainerStyles = {
  minHeight: '100vh',
  backgroundColor: 'var(--color-white)',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const contentContainerStyles = {
  width: '100%',
  maxWidth: 'var(--width-insights-container)',
  margin: '0 auto',
  padding: { xs: 'var(--padding-3xl) 15px 72px', md: 'var(--padding-4xl) var(--padding-3xl) 96px' },
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-insights-gap-xl)',
};

type DateRangePreset = '1d' | '7d' | '30d' | '60d' | '90d' | '180d';
type MetricKey = 'visits' | 'clicks' | 'ctr';

const RANGE_DAYS: Record<DateRangePreset, number> = {
  '1d': 1,
  '7d': 7,
  '30d': 30,
  '60d': 60,
  '90d': 90,
  '180d': 180,
};

const METRIC_COLORS: Record<MetricKey, string> = {
  visits: 'var(--color-metric-visits)',
  clicks: 'var(--color-metric-clicks)',
  ctr: 'var(--color-metric-ctr)',
};

/**
 * Calculate start date based on days
 */
const getStartDate = (days: number): string => {
  return subtractDays(days);
};

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export default function InsightsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangePreset>('7d');
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('visits');

  // API Hooks
  const { execute: getAllTimeInsights, loading: allTimeLoading, data: allTimeData } = useGetAllInsights();
  const { execute: getGraphInsights, loading: graphLoading, data: graphData } = useGetGraphCalendar();
  const { execute: getClicksInsights, loading: clicksLoading, data: clicksData } = useGetClicksInsights();

  const rangeDays = RANGE_DAYS[selectedDateRange];
  const startDate = getStartDate(rangeDays);

  // Fetch all-time insights on mount
  useEffect(() => {
    getAllTimeInsights();
  }, [getAllTimeInsights]);

  // Fetch graph insights when date range changes
  useEffect(() => {
    getGraphInsights(startDate);
  }, [startDate, getGraphInsights]);

  // Fetch clicks insights when date range changes
  useEffect(() => {
    getClicksInsights(startDate);
  }, [startDate, getClicksInsights]);

  // Calculate all-time totals from API
  const allTimeTotals = useMemo(() => {
    if (!allTimeData) {
      return { visits: 0, clicks: 0, ctr: 0 };
    }

    const visits = allTimeData.eventAnalytics?.page_visit || 0;
    const clicks = allTimeData.eventAnalytics?.profile_clicks || 0;
    const ctr = visits > 0 ? Number(((clicks / visits) * 100).toFixed(1)) : 0;

    return { visits, clicks, ctr };
  }, [allTimeData]);

  // Calculate range totals from graph data
  const rangeTotals = useMemo(() => {
    if (!graphData?.graphAnalytics) {
      return { visits: 0, clicks: 0, ctr: 0 };
    }

    const totals = graphData.total || { visits: 0, clicks: 0, ctr: 0 };
    return {
      visits: totals.visits || 0,
      clicks: totals.clicks || 0,
      ctr: totals.ctr || 0,
    };
  }, [graphData]);

  // Prepare chart data from graph analytics
  const chartData: DotGraphPoint[] = useMemo(() => {
    if (!graphData?.graphAnalytics) {
      return [];
    }

    return graphData.graphAnalytics.map((item) => {
      const date = new Date(item.date);
      const label = formatDateDisplay(date);

      let value: number;
      switch (selectedMetric) {
        case 'visits':
          value = item.visits;
          break;
        case 'clicks':
          value = item.clicks;
          break;
        case 'ctr':
          value = item.ctr;
          break;
        default:
          value = item.visits;
      }

      return {
        label,
        value,
      color: METRIC_COLORS[selectedMetric],
      };
    });
  }, [graphData, selectedMetric]);

  // Calculate clicks insights
  const clicksStats = useMemo(() => {
    if (!clicksData) {
      return {
        socialMediaClicks: 0,
        sectionClicks: 0,
        popularLinks: 0,
      };
    }

    // Calculate social media clicks
    const socialClicksCount = clicksData
      .filter((item) => item.isSocial)
      .reduce((sum, item) => sum + item.count, 0);

    // Calculate section clicks (excluding social)
    const sectionClicksCount = clicksData
      .filter((item) => !item.isSocial && (item.section || item.isButton))
      .reduce((sum, item) => sum + item.count, 0);

    // Calculate popular links (buttons and sections)
    const popularLinksCount = clicksData
      .filter((item) => item.isButton || item.section)
      .reduce((sum, item) => sum + item.count, 0);

    return {
      socialMediaClicks: socialClicksCount,
      sectionClicks: sectionClicksCount,
      popularLinks: popularLinksCount,
    };
  }, [clicksData]);

  return (
    <Box sx={pageContainerStyles}>
      <AllTimeSection
        visits={allTimeTotals.visits}
        clicks={allTimeTotals.clicks}
        ctr={formatPercent(allTimeTotals.ctr)}
        loading={allTimeLoading}
      />
      
      <Box sx={contentContainerStyles}>
        <DateRangeSelector
          selectedRange={selectedDateRange}
          onRangeChange={(range) => {
            setSelectedDateRange(range as DateRangePreset);
          }}
        />

        <PageActivitySection
          metrics={rangeTotals}
          selectedMetric={selectedMetric}
          onMetricSelect={setSelectedMetric}
          chartData={chartData}
          loading={graphLoading}
        />

        <AdditionalStatsSection
          socialMediaClicks={clicksStats.socialMediaClicks}
          sectionClicks={clicksStats.sectionClicks}
          popularLinks={clicksStats.popularLinks}
          loading={clicksLoading}
        />
      </Box>
    </Box>
  );
}
