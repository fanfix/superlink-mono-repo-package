"use client";

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart,Card } from '@superline/design-system';
import { financialSummaryData, mockDailyRevenueData, DailyRevenueData, calculateFilteredRevenue } from './mockData';
import FinancialSummary from './FinancialSummary';

const DailyRevenue: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2024-09-29'),
    endDate: new Date('2024-10-28')
  });

  const [filteredRevenue, setFilteredRevenue] = useState(financialSummaryData.filteredRevenue);

  // Style variables
  const mainCardStyles = {
    width: '100%',
    fontFamily: 'var(--font-family-primary)',
    boxSizing: 'border-box',
    padding: { xs: 'var(--padding-lg-1)', sm: 'var(--padding-xl)', md: 'var(--padding-2xl)' },
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-2xl)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'none',
  };

  const titleStyles = {
    fontSize: { xs: 'var(--font-size-lg)', sm: 'var(--font-size-xl)', md: 'calc(var(--font-size-xl) + 4px)' },
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-gray-800)',
    lineHeight: 'var(--line-height-tight)',
  };

  const chartContainerStyles = {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#CBD5E0',
      borderRadius: '9999px',
    },
    '& svg text': {
      transform: 'rotate(0deg) !important',
      transformOrigin: 'center !important',
    },
    '& .tooltip': {
      backgroundColor: 'var(--color-success-main) !important',
      color: 'var(--color-white) !important',
    },
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleDataPointClick = (dataPoint: any) => {
    console.log('Data point clicked:', dataPoint);
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setDateRange({ startDate, endDate });
      
      // Calculate new filtered revenue based on date range
      const newFilteredRevenue = calculateFilteredRevenue(mockDailyRevenueData, startDate, endDate);
      setFilteredRevenue(newFilteredRevenue);
      
      console.log('Date range changed:', { startDate, endDate, newFilteredRevenue });
    }
  };

  return (
    <Card sx={mainCardStyles}>
      <Typography sx={titleStyles}>
        Daily Revenue
      </Typography>
      {/* Financial Summary Component */}
      <FinancialSummary
        totalRevenue={financialSummaryData.totalRevenue}
        filteredRevenue={filteredRevenue}
        onDateRangeChange={handleDateRangeChange}
      />

      {/* Bar Chart Component */}
      <Box sx={chartContainerStyles}>
          <BarChart
            data={mockDailyRevenueData.map((item) => ({
              date: item.date,
              value: item.value,
              color: item.highlighted ? 'var(--color-success-main)' : 'var(--color-gray-100)',
              label: item.tooltipValue,
            }))}
            enableHorizontalScroll={true}
            height={400}
            maxValue={600}
            showTooltip={true}
            tooltipBackgroundColor="var(--color-success-main)"
            tooltipTextColor="var(--color-white)"
            textOrientation="horizontal"
            textSpacing={20}
            onDataPointClick={handleDataPointClick}
          />
        </Box>
    </Card>
  );
};

export default DailyRevenue;
