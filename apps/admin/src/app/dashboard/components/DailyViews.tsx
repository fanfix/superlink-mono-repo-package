"use client";

import React, { useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Card, DateRangePicker, Chart } from '@superline/design-system';

interface DailyViewsData {
  date: string;
  value: number;
  tooltipValue: string;
}

const mockDailyViewsData: DailyViewsData[] = [
  { date: "Oct 1", value: 450, tooltipValue: "450 Visits" },
  { date: "Oct 2", value: 420, tooltipValue: "420 Visits" },
  { date: "Oct 3", value: 480, tooltipValue: "480 Visits" },
  { date: "Oct 4", value: 520, tooltipValue: "520 Visits" },
  { date: "Oct 5", value: 380, tooltipValue: "380 Visits" },
  { date: "Oct 6", value: 350, tooltipValue: "350 Visits" },
  { date: "Oct 7", value: 400, tooltipValue: "400 Visits" },
  { date: "Oct 8", value: 420, tooltipValue: "420 Visits" },

 
  { date: "Oct 31", value: 100, tooltipValue: "100 Visits" }
];

const DailyViews: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2024-09-29'),
    endDate: new Date('2024-10-28')
  });

  const [totalViews] = useState(12719);
  const [filteredViews] = useState(1719);

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setDateRange({ startDate, endDate });
      console.log('Date range changed:', { startDate, endDate });
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }).format(num);
  };

  // Style variables
  const mainCardStyles = {
    width: '100%',
    fontFamily: 'var(--font-family-primary)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-2xl)',
    backgroundColor: 'var(--color-white)',
    padding: 'var(--padding-2xl)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'none',
  };

  const titleStyles = {
    fontSize: { xs: 'var(--font-size-lg)', sm: 'var(--font-size-xl)', md: 'calc(var(--font-size-xl) + 4px)' },
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-gray-800)',
    lineHeight: 'var(--line-height-tight)',
  };

  const summaryCardStyles = {
    padding: { xs: 'var(--padding-lg-1)', sm: 'var(--padding-xl)', md: 'var(--padding-2xl)' },
    backgroundColor: 'var(--color-white-sidebar)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'none',
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'flex-start', sm: 'center' },
    justifyContent: 'space-between',
    gap: { xs: 'var(--padding-lg-1)', sm: 'var(--padding-2xl)', md: 'var(--padding-3xl)' },
  };

  const summaryBoxStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: { xs: 'center', sm: 'flex-start' },
    flex: { xs: '1', sm: '0 0 auto' },
    minWidth: { xs: '100%', sm: '120px' },
  };

  const summaryLabelStyles = {
    fontSize: { xs: 'var(--font-size-md)', sm: 'var(--font-size-md-1)' },
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-gray-500)',
    marginBottom: 'var(--margin-xs)',
    textAlign: { xs: 'center', sm: 'left' },
  };

  const summaryValueStyles = {
    fontSize: { xs: 'var(--font-size-xl)', sm: 'calc(var(--font-size-xl) + 4px)', md: 'calc(var(--font-size-xl) + 8px)' },
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-gray-800)',
    lineHeight: 'var(--line-height-tight)',
    textAlign: { xs: 'center', sm: 'left' },
  };

  const datePickerBoxStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: { xs: 'center', sm: 'flex-end' },
    flex: { xs: '1', sm: '0 0 auto' },
    minWidth: { xs: '100%', sm: '200px' },
    maxWidth: { xs: '100%', sm: '250px' },
  };

  const datePickerStyles = {
    '& .MuiBox-root': {
      fontSize: { xs: 'var(--font-size-sm)', sm: 'var(--font-size-md)' },
    },
  };

  const chartCardStyles = {
    padding: { xs: 'var(--padding-lg-1)', sm: 'var(--padding-xl)', md: 'var(--padding-2xl)' },
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'none',
  };

  const chartContainerStyles = {
    width: '100%',
    height: '400px',
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
      backgroundColor: 'var(--color-gray-700) !important',
      color: 'var(--color-white) !important',
    },
  };

  return (
    <Card sx={mainCardStyles}>
      {/* Title Section */}
      <Typography sx={titleStyles}>
        Total View Daily
      </Typography>

      {/* Single Summary Card */}
      <Card sx={summaryCardStyles}>
        {/* Total Views */}
        <Box sx={summaryBoxStyles}>
          <Typography sx={summaryLabelStyles}>
            Total
          </Typography>
          <Typography sx={summaryValueStyles}>
            {formatNumber(totalViews)}
          </Typography>
        </Box>

        {/* Filtered Views */}
        <Box sx={summaryBoxStyles}>
          <Typography sx={summaryLabelStyles}>
            Filtered
          </Typography>
          <Typography sx={summaryValueStyles}>
            {formatNumber(filteredViews)}
          </Typography>
        </Box>

        {/* Date Range Picker */}
        <Box sx={datePickerBoxStyles}>
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateRangeSelect={handleDateRangeChange}
            placeholder="Select date range"
            showFormatPlaceholder={false}
            inputWidth="100%"
            inputHeight={isMobile ? "40px" : "48px"}
            calendarWidth={isMobile ? "100%" : "680px"}
            sx={datePickerStyles}
          />
        </Box>
      </Card>

      {/* Chart Section */}
      <Card sx={chartCardStyles}>
        <Box sx={chartContainerStyles}>
          <Chart
            data={mockDailyViewsData.map((item) => ({
              date: item.date,
              value: item.value,
              color: 'var(--color-success-main)',
              label: item.tooltipValue,
            }))}
            variant="line"
            enableHorizontalScroll={true}
            height={400}
            maxValue={600}
            showArea={true}
            showTooltip={true}
            tooltipBackgroundColor="var(--color-gray-700)"
            tooltipTextColor="var(--color-white)"
            textOrientation="horizontal"
            textSpacing={50}
            strokeWidth={3}
            onDataPointClick={(dataPoint) => {
              console.log('Data point clicked:', dataPoint);
            }}
          />
        </Box>
      </Card>
    </Card>
  );
};

export default DailyViews;
