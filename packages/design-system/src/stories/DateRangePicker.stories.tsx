import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from '../ui/DateRangePicker';
import { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Components/Forms/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A date range picker component with dual-month calendar view and input field, similar to Material-UI date range pickers.',
      },
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Input field label',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for input field',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the date range picker',
    },
    dateFormat: {
      control: { type: 'text' },
      description: 'Date format for display (default: MM-DD-YYYY)',
    },
    showFormatPlaceholder: {
      control: { type: 'boolean' },
      description: 'Show format placeholder when empty',
    },
    inputWidth: {
      control: { type: 'text' },
      description: 'Width of the input field',
    },
    inputHeight: {
      control: { type: 'text' },
      description: 'Height of the input field',
    },
    calendarWidth: {
      control: { type: 'text' },
      description: 'Width of the calendar popup',
    },
    autoClose: {
      control: { type: 'boolean' },
      description: 'Auto-close calendar when date range is selected',
    },
    closeOnOutsideClick: {
      control: { type: 'boolean' },
      description: 'Close calendar when clicking outside',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

// Input Field - Exactly like the image
export const InputFieldLikeImage: Story = {
  args: {
    placeholder: 'Choose date range',
    rangeColor: '#e0e0e0', // Light gray
    selectedColor: '#1976d2', // Blue
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(new Date(2024, 8, 29)); // Sep 29, 2024
    const [endDate, setEndDate] = useState<Date | null>(new Date(2024, 9, 28)); // Oct 28, 2024
    
    return (
      <Box sx={{ width: 300 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      </Box>
    );
  },
};

// Basic Date Range Picker
export const Basic: Story = {
  args: {
    placeholder: 'Choose date range',
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ width: 300 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      </Box>
    );
  },
};

// Custom Colors
export const CustomColors: Story = {
  args: {
    placeholder: 'Choose date range',
    rangeColor: '#ffeb3b', // Yellow range
    selectedColor: '#f44336', // Red selected
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(new Date(2024, 8, 15));
    const [endDate, setEndDate] = useState<Date | null>(new Date(2024, 8, 25));
    
    return (
      <Box sx={{ width: 300 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      </Box>
    );
  },
};

// With Pre-selected Dates
export const WithPreselectedDates: Story = {
  args: {
    label: 'Date Range',
    placeholder: 'Choose date range',
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(new Date(2024, 8, 29)); // Sep 29, 2024
    const [endDate, setEndDate] = useState<Date | null>(new Date(2024, 9, 28)); // Oct 28, 2024
    
    return (
      <Box sx={{ width: 300 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        {(startDate || endDate) && (
          <Typography sx={{ mt: 2 }}>
            Selected: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
          </Typography>
        )}
      </Box>
    );
  },
};

// Different Date Format
export const WithCustomDateFormat: Story = {
  args: {
    label: 'Select Date Range',
    placeholder: 'Choose date range',
    dateFormat: 'MM-DD-YYYY',
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ width: 300 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        {(startDate || endDate) && (
          <Typography sx={{ mt: 2 }}>
            Selected: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
          </Typography>
        )}
      </Box>
    );
  },
};

// Disabled State
export const Disabled: Story = {
  args: {
    label: 'Select Date Range',
    placeholder: 'Choose date range',
    disabled: true,
  },
};

// With Date Restrictions
export const WithDateRestrictions: Story = {
  args: {
    label: 'Select Date Range',
    placeholder: 'Choose date range',
    minDate: new Date(),
    maxDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ width: 300 }}>
        <Typography sx={{ mb: 2, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Only dates from today to 90 days ahead are selectable
        </Typography>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        {(startDate || endDate) && (
          <Typography sx={{ mt: 2 }}>
            Selected: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
          </Typography>
        )}
      </Box>
    );
  },
};

// Multiple Date Range Pickers
export const MultiplePickers: Story = {
  render: () => {
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Hotel Booking
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: 200 }}>
              <DateRangePicker
                label="Check-in"
                placeholder="Select check-in date"
                startDate={checkIn}
                endDate={checkOut}
                onDateRangeSelect={(start, end) => {
                  setCheckIn(start);
                  setCheckOut(end);
                }}
              />
            </Box>
            <Box sx={{ width: 200 }}>
              <DateRangePicker
                label="Check-out"
                placeholder="Select check-out date"
                startDate={checkIn}
                endDate={checkOut}
                onDateRangeSelect={(start, end) => {
                  setCheckIn(start);
                  setCheckOut(end);
                }}
              />
            </Box>
          </Box>
          {(checkIn || checkOut) && (
            <Typography sx={{ mt: 2 }}>
              Booking: {checkIn?.toLocaleDateString()} - {checkOut?.toLocaleDateString()}
            </Typography>
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Project Timeline
          </Typography>
          <Box sx={{ width: 300 }}>
            <DateRangePicker
              label="Project Duration"
              placeholder="Select project timeline"
              startDate={startDate}
              endDate={endDate}
              onDateRangeSelect={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
            />
            {(startDate || endDate) && (
              <Typography sx={{ mt: 2 }}>
                Timeline: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    );
  },
};

// Form Integration Example
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      eventName: '',
      startDate: null as Date | null,
      endDate: null as Date | null,
    });
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Form submitted:', formData);
    };
    
    return (
      <Paper sx={{ p: 3, maxWidth: 400 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Event Registration
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <DateRangePicker
            label="Event Date Range"
            placeholder="Select event dates"
            startDate={formData.startDate}
            endDate={formData.endDate}
            onDateRangeSelect={(start, end) => {
              setFormData(prev => ({
                ...prev,
                startDate: start,
                endDate: end
              }));
            }}
          />
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
            {formData.startDate && formData.endDate 
              ? `Event runs from ${formData.startDate.toLocaleDateString()} to ${formData.endDate.toLocaleDateString()}`
              : 'Please select event dates'
            }
          </Typography>
        </Box>
      </Paper>
    );
  },
};

// Format Placeholder Examples
export const WithFormatPlaceholder: Story = {
  args: {
    label: 'Select Date Range',
    showFormatPlaceholder: true,
    dateFormat: 'MM-DD-YYYY',
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ width: 300 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <Typography sx={{ mt: 2, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Shows "MM-DD-YYYY - MM-DD-YYYY" when empty
        </Typography>
      </Box>
    );
  },
};

export const WithCustomFormatPlaceholder: Story = {
  args: {
    label: 'Select Date Range',
    showFormatPlaceholder: true,
    dateFormat: 'MM-DD-YYYY',
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ width: 300 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <Typography sx={{ mt: 2, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Shows "MM-DD-YYYY - MM-DD-YYYY" when empty
        </Typography>
      </Box>
    );
  },
};

export const WithoutFormatPlaceholder: Story = {
  args: {
    label: 'Select Date Range',
    showFormatPlaceholder: false,
    placeholder: 'Choose your date range',
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ width: 300 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <Typography sx={{ mt: 2, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Shows custom placeholder text when empty
        </Typography>
      </Box>
    );
  },
};

// Size Control Stories
export const CustomInputSize: Story = {
  args: {
    label: 'Custom Size Input',
    placeholder: 'Choose date range',
    inputWidth: '400px',
    inputHeight: '64px',
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ width: 450 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <Typography sx={{ mt: 2, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Custom input size: 400px width, 64px height
        </Typography>
      </Box>
    );
  },
};

export const SmallInput: Story = {
  args: {
    label: 'Small Input',
    placeholder: 'Choose date range',
    inputWidth: '200px',
    inputHeight: '40px',
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ width: 250 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <Typography sx={{ mt: 2, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Small input: 200px width, 40px height
        </Typography>
      </Box>
    );
  },
};

export const CustomCalendarSize: Story = {
  args: {
    label: 'Custom Calendar Size',
    placeholder: 'Choose date range',
    calendarWidth: '800px',
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ width: 300 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <Typography sx={{ mt: 2, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Calendar width: 800px (wider than default)
        </Typography>
      </Box>
    );
  },
};

// Auto-close Stories
export const AutoCloseDisabled: Story = {
  args: {
    label: 'No Auto-Close',
    placeholder: 'Choose date range',
    autoClose: false,
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ width: 300 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <Typography sx={{ mt: 2, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Calendar stays open after selecting date range
        </Typography>
      </Box>
    );
  },
};

export const NoOutsideClickClose: Story = {
  args: {
    label: 'No Outside Click Close',
    placeholder: 'Choose date range',
    closeOnOutsideClick: false,
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ width: 300 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <Typography sx={{ mt: 2, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Calendar doesn't close when clicking outside
        </Typography>
      </Box>
    );
  },
};

export const FullCustomization: Story = {
  args: {
    label: 'Fully Customized',
    placeholder: 'Choose date range',
    inputWidth: '350px',
    inputHeight: '60px',
    calendarWidth: '750px',
    autoClose: true,
    closeOnOutsideClick: true,
    rangeColor: '#e3f2fd',
    selectedColor: '#1976d2',
  },
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    return (
      <Box sx={{ width: 400 }}>
        <DateRangePicker
          {...args}
          startDate={startDate}
          endDate={endDate}
          onDateRangeSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
        <Typography sx={{ mt: 2, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Custom size, colors, and behavior
        </Typography>
      </Box>
    );
  },
};
