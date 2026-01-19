"use client";

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Typography, Checkbox } from '@superline/design-system';
import { styled } from '@mui/material/styles';

const AgencySettingsContainer = styled(Box)({
  marginBottom: 'var(--padding-xl)'
});

const SettingItem = styled(Box)({
  marginBottom: 'var(--padding-xl)',
  '&:last-child': {
    marginBottom: 0
  }
});

const SettingRow = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'var(--padding-md)'
});

const SettingContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column'
});

const SettingTitle = styled(Typography)({
  color: 'var(--color-black-secondary)',
  fontWeight: 600,
  marginBottom: 'var(--padding-sm)',
  fontSize: 'var(--font-size-lg)'
});

const SettingDescription = styled(Typography)({
  color: 'var(--color-grey-light)',
  fontSize: 'var(--font-size-md)'
});

interface AgencySettingsProps {
  agencyBranding?: boolean;
  monetization?: boolean;
  onAgencyBrandingChange?: (checked: boolean) => void;
  onMonetizationChange?: (checked: boolean) => void;
}

export default function AgencySettings({
  agencyBranding = true,
  monetization = true,
  onAgencyBrandingChange,
  onMonetizationChange
}: AgencySettingsProps) {
  const [agencyBrandingChecked, setAgencyBrandingChecked] = useState(agencyBranding);
  const [monetizationChecked, setMonetizationChecked] = useState(monetization);

  const handleAgencyBrandingChange = (checked: boolean) => {
    setAgencyBrandingChecked(checked);
    onAgencyBrandingChange?.(checked);
  };

  const handleMonetizationChange = (checked: boolean) => {
    setMonetizationChecked(checked);
    onMonetizationChange?.(checked);
  };

  return (
    <AgencySettingsContainer>
      {/* Agency Branding */}
      <SettingItem>
        <SettingRow>
          <Checkbox
            checked={agencyBrandingChecked}
            onChange={handleAgencyBrandingChange}
            sx={{ mt: 0.5 }}
          />
          <SettingContent>
            <SettingTitle>Agency Branding</SettingTitle>
            <SettingDescription>Show agency logo on profile.</SettingDescription>
          </SettingContent>
        </SettingRow>
      </SettingItem>

      {/* Monetization */}
      <SettingItem>
        <SettingRow>
          <Checkbox
            checked={monetizationChecked}
            onChange={handleMonetizationChange}
            sx={{ mt: 0.5 }}
          />
          <SettingContent>
            <SettingTitle>Monetization</SettingTitle>
            <SettingDescription>Allow agency to handle monetization.</SettingDescription>
          </SettingContent>
        </SettingRow>
      </SettingItem>
    </AgencySettingsContainer>
  );
}
