'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Box, IconButton } from '@mui/material';
import { Typography, TextField, Button, Toggle, CalendarTodayIcon, CloseIcon } from '@superline/design-system';
import { styled } from '@mui/material/styles';
import { Popover } from '@mui/material';
import { CalendarOnly } from './CalendarOnly';
import { useMyAccount } from '../../../contexts/MyAccountContext';
import { useUpdateBio } from '../../../hooks/useProfileApi';
import type { UpdateBioInput } from '../../../api/types';
import Loader from '../../../components/Loader';

const Container = styled(Box)({
  maxWidth: 'var(--width-settings-container)',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
  padding: '0',
});

const Title = styled(Typography)({
  fontSize: 'var(--font-size-h3)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-gray-900)',
  marginBottom: 'var(--padding-3xl)',
  lineHeight: 'var(--line-height-snug)',
  letterSpacing: '-0.01em',
});

const FormField = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
  marginBottom: 'var(--padding-2xl)',
});

const Label = styled(Typography)({
  fontSize: 'var(--font-size-md)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-gray-700)',
  marginBottom: 'var(--padding-md)',
  lineHeight: 'var(--line-height-normal)',
  letterSpacing: '0.01em',
});

const DateInputContainer = styled(Box)({
  position: 'relative',
  width: '100%',
});

const StandardTextFieldStyle = {
  '& .MuiInput-underline:before': {
    borderBottomColor: 'var(--color-gray-200)',
    borderBottomWidth: '1px',
  },
  '& .MuiInput-underline:hover:before': {
    borderBottomColor: 'var(--color-gray-400)',
    borderBottomWidth: '1.5px',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'var(--color-gray-900)',
    borderBottomWidth: '2px',
  },
  '& .MuiInput-input': {
    paddingBottom: 'var(--padding-md)',
    fontSize: 'var(--font-size-settings-lg)',
    color: 'var(--color-gray-900)',
    fontWeight: 'var(--font-weight-normal)',
    letterSpacing: '0.01em',
  },
  '& .MuiInput-root': {
    '&::before': {
      borderBottom: `1px solid var(--color-gray-200)`,
    },
  },
};

const DateActionButtons = styled(Box)({
  position: 'absolute',
  right: '0',
  bottom: 'var(--spacing-settings-gap-md)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-settings-gap-lg)',
  paddingRight: 'var(--spacing-settings-gap-xs)',
});

const DateActionButton = styled(IconButton)({
  padding: '0',
  width: '18px',
  height: '18px',
  minWidth: '18px',
  '& svg': {
    fontSize: 'var(--icon-size-sm)',
    color: 'var(--color-gray-600)',
  },
  '&:hover': {
    backgroundColor: 'transparent',
    '& svg': {
      color: 'var(--color-gray-900)',
    },
  },
});

const SMSAlertsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '0',
  padding: 'var(--padding-2xl) 0',
  marginBottom: 'var(--padding-3xl)',
  borderBottom: `1px solid var(--color-gray-200)`,
});

const SMSAlertsText = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-xs)',
});

const SMSAlertsTitle = styled(Typography)({
  fontSize: 'var(--font-size-md)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-gray-900)',
  lineHeight: 'var(--line-height-normal)',
  letterSpacing: '0.01em',
  marginBottom: 'var(--padding-xs)',
});

const SMSAlertsDescription = styled(Typography)({
  fontSize: 'var(--font-size-settings-md)',
  color: 'var(--color-gray-500)',
  lineHeight: 'var(--line-height-normal)',
  letterSpacing: '0.01em',
});

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginTop: '0',
});

const SaveButton = styled(Button)({
  width: '100%',
  height: 'var(--height-button-primary)',
  borderRadius: 'var(--border-radius-button-pill)',
  fontSize: 'var(--font-size-base)',
  fontWeight: 'var(--font-weight-semibold)',
  letterSpacing: '0.02em',
  textTransform: 'none',
  boxShadow: 'var(--shadow-sm)',
  '&:hover': {
    boxShadow: 'var(--shadow-md)',
  },
});

// Style variables
const containerBoxStyles = {
  width: '100%',
  maxWidth: 'var(--width-settings-container)',
};

const dateInputTextFieldStyles = {
  width: '100%',
  '& .MuiInput-underline:before': {
    borderBottomColor: 'var(--color-gray-200)',
    borderBottomWidth: '1px',
  },
  '& .MuiInput-underline:hover:before': {
    borderBottomColor: 'var(--color-gray-400)',
    borderBottomWidth: '1.5px',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'var(--color-gray-900)',
    borderBottomWidth: '2px',
  },
  '& .MuiInput-input': {
    paddingBottom: 'var(--padding-md)',
    paddingRight: 'var(--spacing-settings-gap-2xl)',
    fontSize: 'var(--font-size-settings-lg)',
    color: 'var(--color-gray-500)',
    fontWeight: 'var(--font-weight-normal)',
    letterSpacing: '0.01em',
  },
};

export default function MyAccount() {
  // Context for account data
  const {
    user,
    decryptedData,
    loading: accountLoading,
    updating: accountUpdating,
    decrypting,
    updateUser: updateUserApi,
    refreshUser,
  } = useMyAccount();

  // Hook for updating bio (SMS alerts)
  const {
    execute: updateBioApi,
    loading: bioUpdating,
  } = useUpdateBio();

  // Initialize form data from user context
  const initialFormData = useMemo(() => {
    if (!user) {
      return {
        name: '',
        email: '',
        phone: '',
    dateOfBirth: {
          month: '',
          day: '',
          year: '',
    },
        smsAlerts: false,
      };
    }

    // Parse date of birth if available
    let dobParts = { month: '', day: '', year: '' };
    if (user.dateOfBirth) {
      const dob = new Date(user.dateOfBirth);
      if (!isNaN(dob.getTime())) {
        dobParts = {
          month: String(dob.getMonth() + 1).padStart(2, '0'),
          day: String(dob.getDate()).padStart(2, '0'),
          year: String(dob.getFullYear()),
        };
      }
    }

    // Use decrypted data if available, otherwise use encrypted values
    const email = decryptedData?.email || user.email || '';
    const phone = decryptedData?.phoneNumber || user.phoneNumber || '';

    return {
      name: user.name || '',
      email,
      phone,
      dateOfBirth: dobParts,
      smsAlerts: user.bio?.allowSMS ?? false,
    };
  }, [user, decryptedData]);

  const [formData, setFormData] = useState(initialFormData);
  const [calendarAnchor, setCalendarAnchor] = useState<HTMLDivElement | null>(null);
  const dateInputRef = React.useRef<HTMLDivElement>(null);

  // Update form data when user data changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  // Combined loading state
  const isSaving = accountUpdating || bioUpdating;
  const isLoading = accountLoading || decrypting;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDateForDisplay = (): string => {
    const { month, day, year } = formData.dateOfBirth;
    if (!month && !day && !year) return '';
    
    const parts: string[] = [];
    if (month) parts.push(month);
    if (day) parts.push(day);
    if (year) parts.push(year);
    
    return parts.join(' - ');
  };

  const handleDateInputChange = (value: string) => {
    // Remove all non-numeric characters except spaces and dashes
    const cleaned = value.replace(/[^\d\s-]/g, '');
    
    // Extract numbers only
    const numbers = cleaned.replace(/\D/g, '');
    
    let month = '';
    let day = '';
    let year = '';
    
    if (numbers.length > 0) {
      month = numbers.substring(0, 2);
    }
    if (numbers.length > 2) {
      day = numbers.substring(2, 4);
    }
    if (numbers.length > 4) {
      year = numbers.substring(4, 8);
    }
    
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: {
        month,
        day,
        year,
      },
    }));
  };

  const handleClearDate = () => {
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: {
        month: '',
        day: '',
        year: '',
      },
    }));
  };

  const handleCalendarOpen = () => {
    setCalendarAnchor(dateInputRef.current);
  };

  const handleCalendarClose = () => {
    setCalendarAnchor(null);
  };

  const handleCalendarDateSelect = (date: Date | null) => {
    if (date) {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = String(date.getFullYear());
      
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: {
          month,
          day,
          year,
        },
      }));
    }
    handleCalendarClose();
  };

  const getDateFromFields = (): Date | null => {
    const { month, day, year } = formData.dateOfBirth;
    if (month && day && year && year.length === 4) {
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);
      const yearNum = parseInt(year, 10);
      
      if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31 && yearNum >= 1900) {
        return new Date(yearNum, monthNum - 1, dayNum);
      }
    }
    return null;
  };

  const handleSMSAlertsToggle = async (checked: boolean) => {
    // Optimistically update UI
    setFormData((prev) => ({
      ...prev,
      smsAlerts: checked,
    }));

    // Update bio if user has bio
    if (user?.bio?.id) {
      try {
        const updateBioInput: UpdateBioInput = {
          allowSMS: checked,
        };
        await updateBioApi(user.bio.id, updateBioInput);
        // Refresh user data to get latest state
        await refreshUser();
      } catch (error) {
        // Revert on error
        setFormData((prev) => ({
          ...prev,
          smsAlerts: !checked,
        }));
        // You can add toast notification here
      }
    }
  };

  const handleSave = async () => {
    if (!user) {
      return;
    }

    try {
      // Prepare update payload
      const updatePayload: {
        name?: string;
        dateOfBirth?: string;
      } = {};

      // Update name if changed
      if (formData.name.trim() !== (user.name || '').trim()) {
        updatePayload.name = formData.name.trim();
      }

      // Update date of birth if changed and valid
      const { month, day, year } = formData.dateOfBirth;
      if (month && day && year && year.length === 4) {
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        const yearNum = parseInt(year, 10);

        if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31 && yearNum >= 1900) {
          const newDob = new Date(yearNum, monthNum - 1, dayNum);
          const currentDob = user.dateOfBirth ? new Date(user.dateOfBirth) : null;

          // Only update if date has changed
          if (!currentDob || currentDob.getTime() !== newDob.getTime()) {
            // Only update if user doesn't already have a date of birth
            if (!user.dateOfBirth) {
              updatePayload.dateOfBirth = newDob.toISOString();
            }
          }
        }
      }

      // Only call API if there are changes
      if (Object.keys(updatePayload).length > 0) {
        await updateUserApi(updatePayload);
        // Refresh user data to get latest state
        await refreshUser();
      }

      // Note: Email and phone are read-only, so we don't update them
      // SMS alerts are handled separately via handleSMSAlertsToggle
    } catch (error) {
      // You can add toast notification here
      throw error; // Re-throw to let caller handle it
    }
  };

  // Show loading state while fetching user data
  if (isLoading && !user) {
    return (
      <Box sx={containerBoxStyles}>
        <Title>My Account</Title>
        <Loader fullScreen={false} />
      </Box>
    );
    }

  return (
    <Box sx={containerBoxStyles}>
      <Title>My Account</Title>

      <FormField>
        <TextField
          variant="standard"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Full Name"
          disabled={isSaving}
          sx={{
            ...StandardTextFieldStyle,
            width: '100%',
          }}
        />
      </FormField>

      <FormField>
        <TextField
          variant="standard"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Email Address"
          disabled={true} // Email is read-only (encrypted)
          sx={{
            ...StandardTextFieldStyle,
            width: '100%',
            opacity: 0.6,
          }}
        />
      </FormField>

      <FormField>
        <TextField
          variant="standard"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="Phone Number"
          disabled={true} // Phone is read-only (encrypted)
          sx={{
            ...StandardTextFieldStyle,
            width: '100%',
            opacity: 0.6,
          }}
        />
      </FormField>

      <FormField>
        <Label>Date of Birth</Label>
        <DateInputContainer ref={dateInputRef}>
          <TextField
            variant="standard"
            value={formatDateForDisplay()}
            onChange={(e) => handleDateInputChange(e.target.value)}
            placeholder="MM - DD - YYYY"
            disabled={isSaving || !!user?.dateOfBirth} // Disable if already set
            sx={{
              ...dateInputTextFieldStyles,
              opacity: user?.dateOfBirth ? 0.6 : 1,
            }}
          />
          <DateActionButtons>
            {(formData.dateOfBirth.month || formData.dateOfBirth.day || formData.dateOfBirth.year) && !user?.dateOfBirth && (
              <DateActionButton onClick={handleClearDate} size="small" disabled={isSaving}>
                <CloseIcon size={16} />
              </DateActionButton>
            )}
            {!user?.dateOfBirth && (
              <DateActionButton onClick={handleCalendarOpen} size="small" disabled={isSaving}>
              <CalendarTodayIcon size={16} />
            </DateActionButton>
            )}
          </DateActionButtons>
        </DateInputContainer>
        <Popover
          open={Boolean(calendarAnchor)}
          anchorEl={calendarAnchor}
          onClose={handleCalendarClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <CalendarOnly
            value={getDateFromFields()}
            onChange={handleCalendarDateSelect}
            maxDate={new Date()}
          />
        </Popover>
      </FormField>

      <SMSAlertsContainer>
        <SMSAlertsText>
          <SMSAlertsTitle>SMS Alerts</SMSAlertsTitle>
          <SMSAlertsDescription>Receive SMS alerts for new messages.</SMSAlertsDescription>
        </SMSAlertsText>
        <Toggle
          checked={formData.smsAlerts}
          onChange={handleSMSAlertsToggle}
          size="md"
          activeColor="#22C55E"
          disabled={isSaving || !user?.bio?.id}
        />
      </SMSAlertsContainer>

      <ButtonContainer>
        <SaveButton
          variant="primary-dark"
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving || isLoading}
        >
          Save
        </SaveButton>
      </ButtonContainer>
    </Box>
  );
}

