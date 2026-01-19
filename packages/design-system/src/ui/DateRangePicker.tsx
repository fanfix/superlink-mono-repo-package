import React, { useState, useRef, FC, useEffect } from 'react';
import { 
  TextField, 
  IconButton, 
  Popover, 
  Box, 
  Typography,
  Button
} from '@mui/material';
import { 
  CalendarToday as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Today as TodayIcon
} from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material/styles';

export interface DateRangePickerProps {
  /**
   * Selected start date
   */
  startDate?: Date | null;
  /**
   * Selected end date
   */
  endDate?: Date | null;
  /**
   * Callback when date range is selected
   */
  onDateRangeSelect?: (startDate: Date | null, endDate: Date | null) => void;
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  /**
   * Input field label
   */
  label?: string;
  /**
   * Placeholder text for input field
   */
  placeholder?: string;
  /**
   * Show format placeholder when empty
   * @default true
   */
  showFormatPlaceholder?: boolean;
  /**
   * Whether the picker is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Custom className
   */
  className?: string;
  /**
   * System props for styling
   */
  sx?: SxProps<Theme>;
  /**
   * Date format for display
   * @default 'MM-DD-YYYY'
   */
  dateFormat?: string;
  /**
   * Custom color for selected area (range)
   * @default 'var(--color-primary-light)'
   */
  rangeColor?: string;
  /**
   * Custom color for selected start/end dates
   * @default 'var(--color-primary-main)'
   */
  selectedColor?: string;
  /**
   * Width of the input field
   * @default '100%'
   */
  inputWidth?: string | number;
  /**
   * Height of the input field
   * @default '56px'
   */
  inputHeight?: string | number;
  /**
   * Width of the calendar popup
   * @default '680px'
   */
  calendarWidth?: string | number;
  /**
   * Auto-close calendar when date range is selected
   * @default true
   */
  autoClose?: boolean;
  /**
   * Close calendar when clicking outside
   * @default true
   */
  closeOnOutsideClick?: boolean;
}

export const DateRangePicker: FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateRangeSelect,
  minDate,
  maxDate,
  label = 'Select Date Range',
  placeholder = 'Choose date range',
  showFormatPlaceholder = true,
  disabled = false,
  className,
  sx,
  dateFormat = 'MM-DD-YYYY',
  rangeColor = 'var(--color-primary-light)',
  selectedColor = 'var(--color-primary-main)',
  inputWidth = '100%',
  inputHeight = '56px',
  calendarWidth = '680px',
  autoClose = true,
  closeOnOutsideClick = true,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    return startDate ? new Date(startDate) : new Date();
  });
  const [secondMonth, setSecondMonth] = useState(() => {
    const nextMonth = startDate ? new Date(startDate) : new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  });
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate || null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate || null);
  const [isSelecting, setIsSelecting] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    setTempStartDate(startDate || null);

    if (startDate) {
      setCurrentMonth(new Date(startDate));
      const nextMonth = new Date(startDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setSecondMonth(nextMonth);
    }
  }, [startDate]);

  useEffect(() => {
    setTempEndDate(endDate || null);
  }, [endDate]);

  // Format date for display - always use MM-DD-YYYY format with dashes
  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // Generate calendar days for a specific month
  const generateCalendarDaysForMonth = (month: Date) => {
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
      const isSelected = tempStartDate && date.toDateString() === tempStartDate.toDateString() && isCurrentMonth;
      const isInRange = tempStartDate && tempEndDate &&
        date >= tempStartDate && date <= tempEndDate && isCurrentMonth;
      const isRangeStart = tempStartDate && 
        date.toDateString() === tempStartDate.toDateString() && isCurrentMonth;
      const isRangeEnd = tempEndDate && 
        date.toDateString() === tempEndDate.toDateString() && isCurrentMonth;
      const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        isInRange,
        isRangeStart,
        isRangeEnd,
        isDisabled
      });
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    if (disabled) return;
    
    // Check if date is disabled
    const isDateDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);
    if (isDateDisabled) return;
    
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(date);
      setTempEndDate(null);
      setIsSelecting(true);
    } else {
      const newStartDate = date < tempStartDate ? date : tempStartDate;
      const newEndDate = date < tempStartDate ? tempStartDate : date;

      setTempStartDate(newStartDate);
      setTempEndDate(newEndDate);
      setIsSelecting(false);
      onDateRangeSelect?.(newStartDate, newEndDate);
      
      // Auto-close calendar if enabled
      if (autoClose) {
        setAnchorEl(null);
      }
    }
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
    setSecondMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    setSecondMonth(nextMonth);
  };

  const formatDateRange = () => {
    if (tempStartDate && tempEndDate) {
      return `${formatDate(tempStartDate)} - ${formatDate(tempEndDate)}`;
    } else if (tempStartDate) {
      return formatDate(tempStartDate);
    }
    return '';
  };

  const getPlaceholderText = () => {
    if (showFormatPlaceholder) {
      return 'MM-DD-YYYY - MM-DD-YYYY';
    }
    return placeholder;
  };

  const renderSingleMonth = (month: Date, isSecondMonth = false) => (
    <Box
      sx={{
        width: '50%',
        height: 280,
        border: 'none',
        borderRadius: '0',
        backgroundColor: 'white',
        boxShadow: 'none',
        marginRight: !isSecondMonth ? '0' : 0,
        marginLeft: isSecondMonth ? '0' : 0,
        borderRight: isSecondMonth ? 'none' : '1px solid var(--color-border-primary)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--color-border-primary)',
          backgroundColor: 'white'
        }}
      >
        {!isSecondMonth && (
          <IconButton
            size="small"
            onClick={() => navigateMonth('prev')}
            disabled={disabled}
            sx={{ color: 'var(--color-text-primary)' }}
          >
            <ChevronLeft />
          </IconButton>
        )}
        
        {!isSecondMonth && <Box sx={{ width: 24 }} />}
        
        <Typography
          variant="h6"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)'
          }}
        >
          {month.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })}
        </Typography>
        
        {isSecondMonth && (
          <IconButton
            size="small"
            onClick={() => navigateMonth('next')}
            disabled={disabled}
            sx={{ color: 'var(--color-text-primary)' }}
          >
            <ChevronRight />
          </IconButton>
        )}
        
        {isSecondMonth && <Box sx={{ width: 24 }} />}
      </Box>

      {/* Day headers */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderBottom: '1px solid var(--color-border-primary)' 
      }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <Box
            key={day}
            sx={{
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              backgroundColor: 'white'
            }}
          >
            {day}
          </Box>
        ))}
      </Box>

      {/* Calendar grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 0 
      }}>
        {generateCalendarDaysForMonth(month).map((day, index) => (
          <Box
            key={index}
            onClick={() => handleDateClick(day.date)}
            sx={{
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              cursor: day.isDisabled ? 'not-allowed' : 'pointer',
              color: day.isRangeEnd || day.isRangeStart || day.isSelected
                ? 'white'
                : day.isCurrentMonth 
                ? 'var(--color-text-primary)' 
                : 'var(--color-text-secondary)',
              backgroundColor: day.isRangeEnd
                ? selectedColor
                : day.isRangeStart
                ? selectedColor
                : day.isSelected
                ? selectedColor
                : day.isInRange && day.isCurrentMonth
                ? rangeColor
                : day.isToday
                ? 'var(--color-background-secondary)'
                : 'transparent',
              '&:hover': {
                backgroundColor: day.isDisabled
                  ? 'transparent'
                  : day.isSelected
                  ? 'var(--color-primary-dark)'
                  : 'var(--color-background-secondary)'
              },
              opacity: day.isDisabled ? 0.5 : 1,
              borderRadius: day.isRangeStart 
                ? '4px 0 0 4px' 
                : day.isRangeEnd 
                ? '0 4px 4px 0' 
                : day.isSelected 
                ? '4px' 
                : '0',
              fontWeight: day.isToday ? 600 : 400
            }}
          >
            {day.date.getDate()}
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderDualMonthCalendar = () => (
    <Box
      sx={{
        display: 'flex',
        width: calendarWidth,
        height: 320,
        padding: '0',
        backgroundColor: 'white',
        borderRadius: 'var(--border-radius-md)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border-primary)',
        position: 'relative',
        ...sx
      }}
    >
      {renderSingleMonth(currentMonth, false)}
      {renderSingleMonth(secondMonth, true)}
      
    </Box>
  );

  return (
    <>
      <Box
        ref={inputRef}
        onClick={() => setAnchorEl(inputRef.current)}
        sx={{
          width: inputWidth,
          minHeight: inputHeight,
          border: '1px solid var(--color-border-primary)',
          borderRadius: 'var(--border-radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: disabled ? 'var(--color-background-secondary)' : 'var(--color-background-paper)',
          '&:hover': {
            borderColor: disabled ? 'var(--color-border-primary)' : 'var(--color-primary-main)',
          },
          '&:focus-within': {
            borderColor: 'var(--color-primary-main)',
            boxShadow: '0 0 0 2px var(--color-primary-light)',
          },
          ...sx
        }}
        className={className}
      >
        <Box sx={{ flex: 1, marginRight: '8px' }}>
          {formatDateRange() ? (
            <Typography
              sx={{
                color: 'var(--color-text-primary)',
                fontSize: '0.875rem',
                fontWeight: 400
              }}
            >
              {formatDateRange()}
            </Typography>
          ) : (
            <Typography
              sx={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem',
                fontWeight: 400
              }}
            >
              {getPlaceholderText()}
            </Typography>
          )}
        </Box>
        <CalendarIcon 
          sx={{ 
            color: 'var(--color-text-secondary)',
            fontSize: '1.25rem'
          }} 
        />
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => closeOnOutsideClick && setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
            marginTop: '4px'
          }
        }}
      >
        {renderDualMonthCalendar()}
      </Popover>
    </>
  );
};
