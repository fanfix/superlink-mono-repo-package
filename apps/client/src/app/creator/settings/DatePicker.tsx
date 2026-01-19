'use client';

import React, { useState, useRef, FC } from 'react';
import { 
  IconButton, 
  Popover, 
  Box, 
  Typography
} from '@mui/material';
import { 
  CalendarToday as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material/styles';

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
  dateFormat?: string;
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

const calendarHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--spacing-settings-gap-lg) var(--padding-lg-1)',
  borderBottom: '1px solid var(--color-gray-200)',
  marginBottom: 'var(--spacing-settings-gap-md)',
};

const calendarMonthTitleStyles = {
  fontSize: 'var(--font-size-settings-base)',
  fontWeight: 600,
  color: 'var(--color-gray-900)',
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

const inputContainerStyles = {
  width: '100%',
  minHeight: 'var(--height-button-primary)',
  border: '1px solid var(--color-gray-300)',
  borderRadius: 'var(--border-radius-md)',
  padding: 'var(--spacing-settings-gap-lg) var(--padding-lg-1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  backgroundColor: 'var(--color-white-pure)',
  '&:hover': {
    borderColor: 'var(--color-primary-main)',
  },
  '&:focus-within': {
    borderColor: 'var(--color-primary-main)',
    boxShadow: 'var(--shadow-focus-ring)',
  },
};

const getInputContainerStyles = (disabled: boolean) => ({
  ...inputContainerStyles,
  cursor: disabled ? 'not-allowed' : 'pointer',
  backgroundColor: disabled ? 'var(--color-gray-50)' : 'var(--color-white-pure)',
  '&:hover': {
    borderColor: disabled ? 'var(--color-gray-300)' : 'var(--color-primary-main)',
  },
});

const dateTextStyles = {
  color: 'var(--color-gray-900)',
  fontSize: 'var(--font-size-settings-base)',
  fontWeight: 400,
};

const placeholderTextStyles = {
  color: 'var(--color-gray-400)',
  fontSize: 'var(--font-size-settings-base)',
  fontWeight: 400,
};

const popoverPaperStyles = {
  backgroundColor: 'transparent',
  boxShadow: 'none',
  overflow: 'visible',
  marginTop: 'var(--spacing-settings-gap-xs)',
};

export const DatePicker: FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  label,
  placeholder = 'MM-DD-YYYY',
  disabled = false,
  className,
  sx,
  dateFormat = 'MM-DD-YYYY',
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    return value ? new Date(value) : new Date();
  });
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const open = Boolean(anchorEl);

  React.useEffect(() => {
    if (value) {
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

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
      const isSelected = value && date.toDateString() === value.toDateString() && isCurrentMonth;
      const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);
      
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
    if (disabled) return;
    
    const isDateDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);
    if (isDateDisabled) return;
    
    onChange?.(date);
    setAnchorEl(null);
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

  const renderCalendar = () => (
    <Box sx={calendarContainerStyles}>
      {/* Header */}
      <Box sx={calendarHeaderStyles}>
        <IconButton
          size="small"
          onClick={() => navigateMonth('prev')}
          disabled={disabled}
          sx={{ color: 'var(--color-gray-700)' }}
        >
          <ChevronLeft />
        </IconButton>
        
        <Typography sx={calendarMonthTitleStyles}>
          {currentMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })}
        </Typography>
        
        <IconButton
          size="small"
          onClick={() => navigateMonth('next')}
          disabled={disabled}
          sx={{ color: 'var(--color-gray-700)' }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

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
    </Box>
  );

  return (
    <>
      <Box
        ref={inputRef}
        onClick={() => !disabled && setAnchorEl(inputRef.current)}
        sx={{ ...getInputContainerStyles(disabled), ...sx }}
        className={className}
      >
        <Box sx={{ flex: 1, marginRight: 'var(--spacing-settings-gap-md)' }}>
          {value ? (
            <Typography sx={dateTextStyles}>
              {formatDate(value)}
            </Typography>
          ) : (
            <Typography sx={placeholderTextStyles}>
              {placeholder}
            </Typography>
          )}
        </Box>
        <CalendarIcon sx={{ color: 'var(--color-gray-400)', fontSize: 'var(--size-icon-lg)' }} />
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{ sx: popoverPaperStyles }}
      >
        {renderCalendar()}
      </Popover>
    </>
  );
};

