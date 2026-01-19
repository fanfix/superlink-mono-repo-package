"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Card, Table } from '@superline/design-system';
import { agencySummaryData, mockAgencyData, formatCurrency, AgencyData } from './mockData';

const StyledTableWrapper = styled('div')({
  '& thead th': {
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--font-size-md-1)',
    color: 'var(--color-gray-900)',
    padding: 'var(--padding-lg-2) var(--padding-lg-1)',
    borderBottom: '1px solid var(--color-gray-200)',
    backgroundColor: 'var(--color-white)',
  },
  '& tbody td': {
    fontWeight: 'var(--font-weight-medium)',
    fontSize: 'var(--font-size-md)',
    color: 'var(--color-gray-500)',
    padding: 'var(--padding-lg-2) var(--padding-lg-1)',
    borderBottom: '1px solid var(--color-gray-100)',
  },
  // specifically override the name cell's internal span (UserName)
  '& tbody td:first-of-type span': {
    fontWeight: 'var(--font-weight-normal)',
  },
  '& tbody tr:hover': { backgroundColor: 'var(--color-gray-50)' },
});

const Agencies: React.FC = () => {
  const itemsPerPage = 6;

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
    gap: 'var(--padding-xl)',
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

  const contentWrapperStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--margin-2xl)',
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

  const totalAgenciesCardStyles = {
    ...summaryCardStyles,
    height: '100%',
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

  // Table columns configuration (uses `name` to enable avatar+text rendering)
  const columns = [
    {
      id: 'name',
      label: 'Agency name',
      minWidth: 200,
    },
    {
      id: 'creators',
      label: 'Creators',
      minWidth: 100,
    },
    {
      id: 'creatorsWithSuperLocked',
      label: 'Creator w/ SuperLocked',
      minWidth: 150,
    },
    {
      id: 'revenue',
      label: 'Revenue',
      minWidth: 120,
    },
  ];

  // Table rows data
  const tableData = mockAgencyData.map((agency) => ({
    id: agency.id,
    // `name` key enables avatar+label cell in design-system Table
    name: agency.agencyName,
    avatar: agency.avatar,
    creators: formatNumber(agency.creators),
    creatorsWithSuperLocked: formatNumber(agency.creatorsWithSuperLocked),
    revenue: formatCurrency(agency.revenue),
  }));

  return (
    <Card sx={mainCardStyles}>
      {/* Title Section */}
      <Typography sx={titleStyles}>
        Agencies
      </Typography>

      <Box sx={contentWrapperStyles}> 

      {/* Summary Cards Section */}
      <Box sx={summaryCardsContainerStyles}>
        {/* Total Agencies Card */}
        <Card sx={totalAgenciesCardStyles}>
          <Box sx={summaryCardContentStyles}>
            <Typography sx={summaryCardLabelStyles}>
              Total Agencies
            </Typography>
            <Typography sx={summaryCardValueStyles}>
              {formatNumber(agencySummaryData.totalAgencies)}
            </Typography>
          </Box>
        </Card>

        {/* Agencies w/ SuperLocked Card */}
        <Card sx={summaryCardStyles}>
          <Box sx={summaryCardContentStyles}>
            <Typography sx={summaryCardLabelStylesAlt}>
              Agencies w/ SuperLocked
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
              Agencies w/ SuperLocked & Instagram
            </Typography>
            <Typography sx={summaryCardValueStyles}>
              {formatNumber(agencySummaryData.agenciesWithSuperLockedAndInstagram)}
            </Typography>
          </Box>
        </Card>
      </Box>

      {/* Table Section */}
      <StyledTableWrapper>
        <Table
          columns={columns}
          rows={tableData}
          showPagination={true}
          itemsPerPage={itemsPerPage}
          paginationPosition="right"
          variant="bordered"
        />
      </StyledTableWrapper>

</Box>
     
    </Card>
  );
};

export default Agencies;
