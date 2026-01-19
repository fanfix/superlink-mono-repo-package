'use client';

import React, { useEffect, useState } from 'react';
import { Card, Typography } from '@superline/design-system';
import { DateRangePicker } from '@superline/design-system';
import { Icon } from '@superline/design-system';
import { DownloadIcon, CalendarTodayIcon } from '@superline/design-system';
import { Box, styled, useTheme, useMediaQuery } from '@mui/material';

// MUI Styled Components
const StyledCard = styled(Card)(() => ({
  backgroundColor: 'var(--revenue-card-bg)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--padding-1xl)',
  boxShadow: 'var(--shadow-sm)',
}));

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  // gap: 'var(--padding-lg)',
}));

const HeaderSection = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  width: '100%',
  gap: '40px',
  padding: 'var(--padding-md)',
}));

const RevenueSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: 'var(--padding-md)',
  padding: 'var(--padding-md)',
}));

const RevenueLabel = styled(Typography)(() => ({
  fontSize: 'var(--font-size-md)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-grey-main)',
  margin: 0,
  lineHeight: 1.2,
  marginBottom: 'var(--padding-lg)',
}));

const RevenueValue = styled(Typography)(() => ({
  fontSize: 'var(--font-size-2xl)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text-primary)',
  margin: 0,
  lineHeight: 1,
}));

const EarningsSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: 'var(--padding-md)',
  padding: 'var(--padding-md)',
}));

const EarningsLabel = styled(Typography)(() => ({
  fontSize: 'var(--font-size-md)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-grey-main)',
  margin: 0,
  lineHeight: 1.2,
  marginBottom: 'var(--padding-lg)',
}));

const EarningsValue = styled(Typography)(() => ({
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text-primary)',
  margin: 0,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-xs)',
  padding: 'var(--padding-md)',
}));

const DotsPlaceholder = styled(Box)(() => ({
  display: 'flex',
  gap: 'var(--padding-xs)',
  alignItems: 'center',
}));

const Dot = styled(Box)(() => ({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-text-primary)',
}));

const DateSection = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const DateRangeContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
}));

const StyledDateRangePicker = styled(DateRangePicker)(() => ({
  '& .MuiOutlinedInput-root': {
    border: 'none',
    backgroundColor: 'transparent',
    minHeight: 'auto',
    padding: 0,
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: 0,
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--color-grey-main)',
    cursor: 'pointer',
  },
}));

const DownloadButton = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'var(--height-sm)',
  height: 'var(--height-sm)',
  cursor: 'pointer',
  borderRadius: 'var(--border-radius-sm)',
  transition: 'var(--transition-normal)',
  '&:hover': {
    backgroundColor: 'var(--color-background-secondary)',
  },
}));

interface RevenueCardProps {
  totalRevenue?: string;
  earnings?: string;
  earningsPercentage?: string;
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
  onDownload?: () => void;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({
  totalRevenue = '$ 12.719,87',
  earnings,
  earningsPercentage = '2,5%',
  startDate,
  endDate,
  onDateRangeChange,
  onDownload,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(startDate ?? null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(endDate ?? null);

  useEffect(() => {
    if (startDate !== undefined) {
      setSelectedStartDate(startDate ?? null);
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate !== undefined) {
      setSelectedEndDate(endDate ?? null);
    }
  }, [endDate]);

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setSelectedStartDate(start);
    setSelectedEndDate(end);
    onDateRangeChange?.(start, end);
  };

  const handleDownload = () => {
    onDownload?.();
  };

  const formatDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        });
      };
      return `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`;
    }
    return 'mm-dd-yyyy - mm-dd-yyyy';
  };

  return (
    <StyledCard variant="default">
      <Container>
        {/* Header Section with Revenue and Earnings */}
        <HeaderSection
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 'var(--padding-lg)', sm: '40px' },
          }}
        >
          {/* Total Revenue Section */}
          <RevenueSection
            sx={{
              minWidth: { xs: '100%', sm: 'auto' },
            }}
          >
            <RevenueLabel variant="body2">Total Revenue</RevenueLabel>
            <RevenueValue variant="h4">{totalRevenue}</RevenueValue>
          </RevenueSection>

          {/* Your Earnings Section */}
          <EarningsSection
            sx={{
              minWidth: { xs: '100%', sm: 'auto' },
            }}
          >
            <RevenueLabel variant="body2">Your earnings ({earningsPercentage})</RevenueLabel>
            <EarningsValue variant="h4">
              {earnings ? (
                earnings
              ) : (
                <DotsPlaceholder>
                  <Dot />
                  <Dot />
                  <Dot />
                </DotsPlaceholder>
              )}
            </EarningsValue>
          </EarningsSection>

          {/* Date Range and Download Section */}
          <DateRangeContainer
            sx={{
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {/* Date Range Picker */}
            <DateSection
              sx={{
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <StyledDateRangePicker
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                onDateRangeSelect={handleDateRangeChange}
                placeholder={formatDateRange()}
                inputWidth="100%"
                inputHeight={isMobile ? "40px" : "30px"}
                calendarWidth={isMobile ? "100%" : "600px"}
                showFormatPlaceholder={false}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  '& .MuiBox-root': {
                    fontSize: { xs: 'var(--font-size-xs)', sm: 'var(--font-size-sm)' },
                  },
                }}
              />
            </DateSection>

            {/* Download Button */}
            <DownloadButton onClick={handleDownload}>
              <Icon
                icon={<DownloadIcon />}
                size="sm"
                color="secondary"
                customColor="var(--color-black-secondary)"
              />
            </DownloadButton>
          </DateRangeContainer>
        </HeaderSection>
      </Container>
    </StyledCard>
  );
};

export default RevenueCard;
