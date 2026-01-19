"use client";

import React, { useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { DateRangePicker } from '../../../../../../packages/design-system/src/ui/DateRangePicker';
import { financialSummaryData, calculateFilteredRevenue, mockDailyRevenueData } from './mockData';

interface FinancialSummaryProps {
  totalRevenue?: number;
  filteredRevenue?: number;
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  totalRevenue = financialSummaryData.totalRevenue,
  filteredRevenue = financialSummaryData.filteredRevenue,
  onDateRangeChange
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2024-09-29'),
    endDate: new Date('2024-10-28')
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setDateRange({ startDate, endDate });
      
      // Calculate filtered revenue based on new date range
      const newFilteredRevenue = calculateFilteredRevenue(mockDailyRevenueData, startDate, endDate);
      
      // Call parent callback if provided
      onDateRangeChange?.(startDate, endDate);
      
      console.log('Date range changed:', { startDate, endDate, newFilteredRevenue });
    }
  };

  // Style variables
  const summaryBoxStyles = {
    backgroundColor: 'var(--color-white-sidebar)',
    borderRadius: '12px',
    padding: { xs: '16px', sm: '20px', md: '24px' },
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'flex-start', sm: 'center' },
    justifyContent: 'space-between',
    gap: { xs: '16px', sm: '24px', md: '32px' },
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const sectionBoxStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: { xs: 'center', sm: 'flex-start' },
    flex: { xs: '1', sm: '0 0 auto' },
    minWidth: { xs: '100%', sm: '120px' },
  };

  const sectionLabelStyles = {
    fontSize: { xs: '14px', sm: '16px' },
    fontWeight: 500,
    color: '#6b7280',
    marginBottom: '4px',
    textAlign: { xs: 'center', sm: 'left' },
  };

  const sectionValueStyles = {
    fontSize: { xs: '24px', sm: '28px', md: '32px' },
    fontWeight: 700,
    color: '#1f2937',
    lineHeight: 1.2,
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
      fontSize: { xs: '12px', sm: '14px' },
    },
  };

  return (
    <Box sx={summaryBoxStyles}>
      {/* Total Section */}
      <Box sx={sectionBoxStyles}>
        <Typography sx={sectionLabelStyles}>
          Total
        </Typography>
        <Typography sx={sectionValueStyles}>
          {formatCurrency(totalRevenue)}
        </Typography>
      </Box>

      {/* Filtered Section */}
      <Box sx={sectionBoxStyles}>
        <Typography sx={sectionLabelStyles}>
          Filtered
        </Typography>
        <Typography sx={sectionValueStyles}>
          {formatCurrency(filteredRevenue)}
        </Typography>
      </Box>

      {/* Date Range Picker Section */}
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
    </Box>
   
  );
};

export default FinancialSummary;
