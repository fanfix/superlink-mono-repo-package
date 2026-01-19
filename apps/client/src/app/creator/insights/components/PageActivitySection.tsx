'use client';

import React from 'react';
import { Box } from '@mui/material';
import { DotGraph, DotGraphPoint, Typography } from '@superline/design-system';
import ClickableMetricCard from './ClickableMetricCard';

export type MetricKey = 'visits' | 'clicks' | 'ctr';

interface PageActivitySectionProps {
  metrics: Record<MetricKey, number>;
  selectedMetric: MetricKey;
  onMetricSelect: (metric: MetricKey) => void;
  chartData: DotGraphPoint[];
  loading?: boolean;
}

const METRIC_LABELS: Record<MetricKey, string> = {
  visits: 'Visits',
  clicks: 'Clicks',
  ctr: 'CTR',
};

export default function PageActivitySection({
  metrics,
  selectedMetric,
  onMetricSelect,
  chartData,
  loading,
}: PageActivitySectionProps) {
  const metricValue = (key: MetricKey) => {
    if (loading) return '...';
    return key === 'ctr'
      ? `${metrics[key].toFixed(1)}%`
      : metrics[key].toLocaleString('en-US');
  };

  const metricKeys: MetricKey[] = ['visits', 'clicks', 'ctr'];

  const values = chartData.map((point) => point.value);
  const minVal = values.length ? Math.min(...values) : 0;
  const maxVal = values.length ? Math.max(...values) : 1;
  const padding = (maxVal - minVal || 1) * 0.25;
  const computedMinRaw = selectedMetric === 'ctr' ? Math.max(0, minVal - padding) : Math.max(0, minVal - padding);
  const computedMaxRaw = maxVal + padding;
  const computedMin = Number.isFinite(computedMinRaw) ? computedMinRaw : 0;
  const computedMax =
    Number.isFinite(computedMaxRaw) && computedMaxRaw > computedMin ? computedMaxRaw : computedMin + 1;

  const yAxisFormatter = (value: number) =>
    selectedMetric === 'ctr' ? `${Math.round(value)}%` : Math.round(value).toString();

// Style variables
const scrollContainerStyles = {
  width: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
  '&::-webkit-scrollbar': {
    height: 'var(--spacing-gap-sm)',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'var(--color-gray-scroll-track)',
    borderRadius: 'var(--border-radius-scrollbar)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'var(--color-gray-scroll-thumb)',
    borderRadius: 'var(--border-radius-scrollbar)',
    '&:hover': {
      backgroundColor: 'var(--color-gray-scroll-thumb-hover)',
    },
  },
};

const mainContainerStyles = {
  width: '100%',
  backgroundColor: 'var(--color-white)',
  padding: { xs: 'var(--padding-insights-2xl) var(--padding-md)', md: 'var(--padding-insights-3xl) var(--padding-insights-4xl)' },
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-insights-gap-xl)',
};

const sectionContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-insights-gap-lg)',
};

const titleStyles = {
  fontSize: 'var(--font-size-insights-md)',
  letterSpacing: '0.28em',
  fontWeight: 700,
  color: 'var(--color-dark-text)',
};

const metricsContainerStyles = {
  display: 'flex',
  gap: { xs: 'var(--spacing-insights-gap-lg)', md: 'var(--spacing-insights-gap-xl)' },
  flexWrap: 'wrap',
};

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={mainContainerStyles}>
        <Box sx={sectionContainerStyles}>
          <Typography sx={titleStyles}>PAGE ACTIVITY</Typography>

          <Box sx={metricsContainerStyles}>
            {metricKeys.map((metricKey) => (
              <ClickableMetricCard
                key={metricKey}
                value={metricValue(metricKey)}
                label={METRIC_LABELS[metricKey]}
                isSelected={selectedMetric === metricKey}
                onClick={() => onMetricSelect(metricKey)}
              />
            ))}
          </Box>
        </Box>

        <Box sx={scrollContainerStyles}>
          <Box sx={{ minWidth: 'var(--width-chart-min)' }}>
            <DotGraph
              data={chartData}
              minValue={computedMin}
              maxValue={computedMax}
              height={260}
              yTickCount={5}
              dotSize={16}
              borderRadius={0}
              borderColor="transparent"
              yLabelFormatter={yAxisFormatter}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

