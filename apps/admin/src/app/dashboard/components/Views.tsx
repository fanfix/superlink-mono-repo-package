"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Card, AgencyCount, Chart } from '@superline/design-system';
import { viewsSummaryData, mockViewsData } from './mockData';
import { agencySummaryData, mockAgencyData, formatCurrency, AgencyData } from './mockData';
const Views: React.FC = () => {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Prepare chart data for combined chart
  const chartData = mockViewsData.map((item, index) => ({
    date: item.date,
    value: item.barValue, // Required by ChartDataPoint
    barValue: Math.min(item.barValue, 600), // Cap bar values at 600 to prevent overflow
    lineValue: item.lineValue,
    label: item.label,
    color: 'var(--color-gray-200)',
  }));

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

  const summaryCardsContainerStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 'var(--padding-lg-1)', sm: 'var(--padding-xl)', md: 'var(--padding-xl)' },
    height: 'auto',
  };

  const summaryCardStyles = {
    padding: { xs: 'var(--padding-lg-1)', sm: 'var(--padding-xl)', md: 'var(--padding-xl)' },
    backgroundColor: 'var(--color-white-sidebar)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'none',
    flex: 1,
  };

  const summaryCardContentStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  const summaryCardLabelStyles = {
    fontSize: { xs: 'var(--font-size-md)', sm: 'var(--font-size-md)' },
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-gray-500)',
    marginBottom: 'var(--margin-sm)',
  };

  const summaryCardLabelStylesAlt = {
    fontSize: { xs: 'var(--font-size-md)', sm: 'var(--font-size-md-1)' },
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-gray-500)',
    marginBottom: 'var(--margin-sm)',
  };

  const summaryCardValueStyles = {
    fontSize: { xs: 'var(--font-size-xl)', sm: 'calc(var(--font-size-xl) + 4px)', md: 'calc(var(--font-size-xl) + 8px)' },
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-gray-800)',
    lineHeight: 'var(--line-height-tight)',
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
        Views
      </Typography>

      {/* Summary Cards Section */}
      {/* <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: '16px', sm: '20px', md: '24px' },
        }}
      >
      
        <AgencyCount
          label="Total Views"
          count={formatNumber(viewsSummaryData.totalViews)}
          sx={{
            flex: 1,
            minWidth: { xs: '100%', sm: '200px' },
            padding: { xs: '16px', sm: '20px', md: '24px' },
            backgroundColor: 'var(--color-white-sidebar)',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#f1f3f4',
            },
          }}
        />

       
        <AgencyCount
          label="Total Views w/ SuperLocked content"
          count={formatNumber(viewsSummaryData.totalViewsWithSuperLocked)}
          sx={{
            flex: 1,
            minWidth: { xs: '100%', sm: '200px' },
            padding: { xs: '16px', sm: '20px', md: '24px' },
            backgroundColor: 'var(--color-white-sidebar)',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#f1f3f4',
            },
          }}
        />
      </Box> */}
      <Box sx={summaryCardsContainerStyles}>
        {/* Agencies w/ SuperLocked Card */}
        <Card sx={summaryCardStyles}>
          <Box sx={summaryCardContentStyles}>
            <Typography sx={summaryCardLabelStylesAlt}>
              Total Views
            </Typography>
            <Typography sx={summaryCardValueStyles}>
              {formatNumber(agencySummaryData.agenciesWithSuperLocked)}
            </Typography>
          </Box>
        </Card>

        {/* Agencies w/ SuperLocked & Instagram Card */}
        <Card sx={summaryCardStyles}>
          <Box sx={summaryCardContentStyles}>
            <Typography sx={summaryCardLabelStyles}>
              Total Views w/ SuperLocked & Instagram
            </Typography>
            <Typography sx={summaryCardValueStyles}>
              {formatNumber(agencySummaryData.agenciesWithSuperLockedAndInstagram)}
            </Typography>
          </Box>
        </Card>
      </Box>

      <Box sx={chartContainerStyles}>
        <Chart
          data={chartData}
          variant="combined"
          enableHorizontalScroll={true}
          height={400}
          maxValue={600}
          showTooltip={true}
          tooltipBackgroundColor="var(--color-success-main)"
          tooltipTextColor="var(--color-white)"
          textOrientation="horizontal"
          textSpacing={50}
          strokeWidth={3}
          barColor="var(--color-gray-200)"
          lineColor="var(--color-success-main)"
          hoverBarColor="var(--color-success-main)"  // per-screen override
          hoverLineColor="var(--color-success)"
          onDataPointClick={(dataPoint) => {
            console.log('Data point clicked:', dataPoint);
          }}
        />
      </Box>
    </Card>
  );
};

export default Views;
