'use client';

import React, { useState, useEffect } from 'react';
import { IconButton, Box, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface CalendarOnlyProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

// Style variables
const calendarContainerStyles = {
  width: 'var(--width-calendar)',
  padding: 'var(--padding-lg-1)',
  backgroundColor: 'var(--color-white-pure)',
  borderRadius: 'var(--border-radius-md)',
  boxShadow: 'var(--shadow-lg)',
  border: '1px solid var(--color-gray-200)',
};

const headerStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--spacing-settings-gap-lg) var(--padding-lg-1)',
  borderBottom: '1px solid var(--color-gray-200)',
  marginBottom: 'var(--spacing-settings-gap-md)',
};

const monthTitleStyles = {
  fontSize: 'var(--font-size-settings-base)',
  fontWeight: 600,
  color: 'var(--color-gray-900)',
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': {
    color: 'var(--color-primary-main)',
  },
};

const dayHeadersGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  marginBottom: 'var(--spacing-settings-gap-md)',
};

const dayHeaderStyles = {
  height: 'var(--height-day-header)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'var(--font-size-settings-sm)',
  fontWeight: 600,
  color: 'var(--color-gray-600)',
};

const calendarGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 'var(--spacing-settings-gap-xs)',
};

const yearGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 'var(--spacing-settings-gap-md)',
  maxHeight: 'var(--height-calendar-year-max)',
  overflowY: 'auto',
  padding: 'var(--spacing-settings-gap-md)',
};

const getDayCellStyles = (day: { isSelected: boolean; isCurrentMonth: boolean; isToday: boolean; isDisabled: boolean }) => ({
  height: 'var(--height-day-cell)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'var(--font-size-settings-base)',
  cursor: day.isDisabled ? 'not-allowed' : 'pointer',
  color: day.isSelected
    ? 'var(--color-white)'
    : day.isCurrentMonth
    ? 'var(--color-gray-900)'
    : 'var(--color-gray-400)',
  backgroundColor: day.isSelected
    ? 'var(--color-primary-main)'
    : day.isToday
    ? 'var(--color-gray-100)'
    : 'transparent',
  borderRadius: 'var(--border-radius-sm)',
  '&:hover': {
    backgroundColor: day.isDisabled
      ? 'transparent'
      : day.isSelected
      ? 'var(--color-primary-dark)'
      : 'var(--color-gray-100)',
  },
  opacity: day.isDisabled ? 0.5 : 1,
  fontWeight: day.isToday ? 600 : 400,
});

const getYearCellStyles = (isSelected: boolean, isDisabled: boolean) => ({
  height: 'var(--height-year-cell)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'var(--font-size-settings-base)',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  color: isSelected ? 'var(--color-white)' : 'var(--color-gray-900)',
  backgroundColor: isSelected ? 'var(--color-primary-main)' : 'transparent',
  borderRadius: 'var(--border-radius-sm)',
  border: '1px solid var(--color-gray-200)',
  '&:hover': {
    backgroundColor: isDisabled
      ? 'transparent'
      : isSelected
      ? 'var(--color-primary-dark)'
      : 'var(--color-gray-100)',
  },
  opacity: isDisabled ? 0.5 : 1,
  fontWeight: isSelected ? 600 : 400,
});

export const CalendarOnly: React.FC<CalendarOnlyProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    return value ? new Date(value) : new Date();
  });
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  useEffect(() => {
    if (value) {
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  const generateCalendarDays = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === monthIndex;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = Boolean(value && date.toDateString() === value.toDateString() && isCurrentMonth);
      const isDisabled = Boolean((minDate && date < minDate) || (maxDate && date > maxDate));
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled
      });
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    const isDateDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);
    if (isDateDisabled) return;
    
    onChange?.(date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setFullYear(prev.getFullYear() - 1);
      } else {
        newDate.setFullYear(prev.getFullYear() + 1);
      }
      return newDate;
    });
  };

  const handleYearClick = (year: number) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setViewMode('month');
  };

  const generateYearList = () => {
    const currentYear = currentMonth.getFullYear();
    const startYear = minDate ? minDate.getFullYear() : currentYear - 50;
    const endYear = maxDate ? maxDate.getFullYear() : currentYear + 10;
    const years = [];
    
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    
    return years;
  };

  return (
    <Box sx={calendarContainerStyles}>
      {/* Header */}
      <Box sx={headerStyles}>
        <IconButton
          size="small"
          onClick={() => viewMode === 'month' ? navigateMonth('prev') : navigateYear('prev')}
          sx={{ color: 'var(--color-gray-700)' }}
        >
          <ChevronLeft />
        </IconButton>
        
        <Typography onClick={() => setViewMode(viewMode === 'month' ? 'year' : 'month')} sx={monthTitleStyles}>
          {viewMode === 'month' 
            ? currentMonth.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })
            : currentMonth.getFullYear().toString()}
        </Typography>
        
        <IconButton
          size="small"
          onClick={() => viewMode === 'month' ? navigateMonth('next') : navigateYear('next')}
          sx={{ color: 'var(--color-gray-700)' }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {viewMode === 'month' ? (
        <>
          {/* Day headers */}
          <Box sx={dayHeadersGridStyles}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <Box key={day} sx={dayHeaderStyles}>
                {day}
              </Box>
            ))}
          </Box>

          {/* Calendar grid */}
          <Box sx={calendarGridStyles}>
            {generateCalendarDays(currentMonth).map((day, index) => (
              <Box
                key={index}
                onClick={() => handleDateClick(day.date)}
                sx={getDayCellStyles(day)}
              >
                {day.date.getDate()}
              </Box>
            ))}
          </Box>
        </>
      ) : (
        /* Year selection grid */
        <Box sx={yearGridStyles}>
          {generateYearList().map((year) => {
            const isSelected = year === currentMonth.getFullYear();
            const isDisabled = Boolean(
              (minDate && year < minDate.getFullYear()) ||
              (maxDate && year > maxDate.getFullYear())
            );
            
            return (
              <Box
                key={year}
                onClick={() => !isDisabled && handleYearClick(year)}
                sx={getYearCellStyles(isSelected, isDisabled)}
              >
                {year}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

