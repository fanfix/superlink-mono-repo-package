"use client";

import React from 'react';
import { Box } from '@mui/material';
import { Card, Typography } from '@superline/design-system';
import { AgencyCount } from '../../../../../../packages/design-system/src/ui/AgencyCount';
import { agencySummaryData, mockAgencyData, formatCurrency, AgencyData } from './mockData';
const Sales: React.FC = () => {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
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
    boxShadow: 'var(--shadow-sm)',
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
    boxShadow: 'var(--shadow-sm)',
    flex: 1,
  };

  const summaryCardContentStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  const summaryCardLabelStyles = {
    fontSize: { xs: 'var(--font-size-md)', sm: 'var(--font-size-md-1)' },
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-gray-500)',
    marginBottom: 'var(--margin-sm)',
  };

  const summaryCardLabelStylesAlt = {
    fontSize: { xs: 'var(--font-size-md)', sm: 'var(--font-size-md)' },
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

  return (
    <Card sx={mainCardStyles}>
      {/* Title Section */}
      <Typography sx={titleStyles}>
        Sales
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
            <Typography sx={summaryCardLabelStyles}>
              Average Views/Sale
            </Typography>
            <Typography sx={summaryCardValueStyles}>
              {formatNumber(agencySummaryData.agenciesWithSuperLocked)}
            </Typography>
          </Box>
        </Card>

        {/* Agencies w/ SuperLocked & Instagram Card */}
        <Card sx={summaryCardStyles}>
          <Box sx={summaryCardContentStyles}>
            <Typography sx={summaryCardLabelStylesAlt}>
              Average Sale Amount
            </Typography>
            <Typography sx={summaryCardValueStyles}>
              {formatNumber(agencySummaryData.agenciesWithSuperLockedAndInstagram)}
            </Typography>
          </Box>
        </Card>
      </Box>
    
  </Card>
  );
};

export default Sales;
