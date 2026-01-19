'use client';

import React from 'react';
import { Card, Typography } from '@superline/design-system';
import { Chart } from '@superline/design-system';
import { Box, styled, Typography as MuiTypography } from '@mui/material';
import RevenueCard from './RevenueCard';
import ReferralTable, { ReferralTableRow } from './ReferralTable';

// MUI Styled Components
const StyledCard = styled(Card)(() => ({
  backgroundColor: 'var(--color-white)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--padding-2xl)',
  boxShadow: 'var(--shadow-sm)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-xl)',
}));

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-xl)',
  flex: '1 1 auto',
}));

const ChartScrollContainer = styled(Box)(() => ({
  width: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
  paddingBottom: 'var(--padding-sm)',
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#CBD5E0',
    borderRadius: '9999px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#F7FAFC',
  },
  '& .chart-container': {
    border: 'none !important',
    boxShadow: 'none !important',
  },
}));

const TableSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-lg)',
}));

const EmptyState = styled(MuiTypography)(() => ({
  fontSize: 'var(--font-size-md)',
  color: 'var(--color-grey-light)',
  textAlign: 'center',
  padding: 'var(--padding-lg)',
}));

interface ReferralStatsProps {
  totalRevenue?: string;
  earnings?: string;
  earningsPercentage?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  chartData?: Array<{ date: string; value: number; label?: string }>;
  tableRows?: ReferralTableRow[];
  onViewDetails?: () => void;
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
  onDownload?: () => void;
}

export const ReferralStats: React.FC<ReferralStatsProps> = ({
  totalRevenue,
  earnings,
  earningsPercentage,
  startDate,
  endDate,
  chartData = [],
  tableRows = [],
  onViewDetails,
  onDateRangeChange,
  onDownload,
}) => {
  const handleViewDetails = () => {
    onViewDetails?.();
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    onDateRangeChange?.(startDate, endDate);
  };

  const resolvedChartData = Array.isArray(chartData) ? chartData : [];
  const sanitizedChartData = resolvedChartData
    .map((point) => ({
      date: point?.date ?? '',
      value: Number.isFinite(point?.value) ? point.value : Number(point?.value ?? 0),
      label: point?.label,
    }))
    .filter((point) => Number.isFinite(point.value));

  const resolvedTableRows = Array.isArray(tableRows) ? tableRows : [];
  const chartWidth = Math.max(900, sanitizedChartData.length * 80 || 900);

  return (
    <StyledCard variant="default">
      <Container>
        <RevenueCard
          totalRevenue={totalRevenue ?? '$0.00'}
          earnings={earnings}
          earningsPercentage={earningsPercentage ?? '—'}
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          onDateRangeChange={handleDateRangeChange}
          onDownload={onDownload}
        />

        <TableSection>
          <ChartScrollContainer>
            {sanitizedChartData.length > 0 ? (
              <Chart
                data={sanitizedChartData}
                variant="wave"
                width={chartWidth}
                height={378}
                enableHorizontalScroll
                maxValue={Math.max(
                  100,
                  ...resolvedChartData.map((point) => point.value || 0)
                )}
                showArea
                strokeWidth={3}
                showDataPoints={false}
                showHoverAreas
                showTooltip
                tooltipBackgroundColor="#374151"
                tooltipTextColor="#ffffff"
                tooltipBorderColor="#6b7280"
                waveColor="#10B981"
                areaOpacity={0.3}
              />
            ) : (
              <EmptyState>No revenue data available for this range.</EmptyState>
            )}
          </ChartScrollContainer>

          {resolvedTableRows.length > 0 ? (
            <ReferralTable rows={resolvedTableRows} />
          ) : (
            <EmptyState>No referrals found for the selected range.</EmptyState>
          )}
        </TableSection>
      </Container>
    </StyledCard>
  );
};

export default ReferralStats;
