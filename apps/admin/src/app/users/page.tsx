'use client';

import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Download as DownloadIcon } from '@mui/icons-material';
import { DashboardLayout } from '../../components/Layout';
import { defaultAdminSidebarItems } from '../../components/Sidebar';

import UsersTable from './components/UsersTable';
import { DateRangePicker, TextField } from '@superline/design-system';
import { AddFilterDropdown } from '../../../../../packages/design-system/src/ui/AddFilterDropdown';
import { useUsersApi } from '../../hooks';

const ContentArea = styled(Box)(() => ({
  backgroundColor: 'var(--color-white)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--padding-2xl)',
  minHeight: 'calc(100vh - 200px)',
  boxShadow: 'var(--shadow-sm)',
  width: 'var(--width-full)',
  maxWidth: 'var(--width-full)',
}));

const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'var(--gap-medium)',
  flexWrap: 'wrap',
  marginBottom: 'var(--margin-lg)',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 'var(--gap-medium)',
  },
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'var(--gap-medium)',
  flexWrap: 'wrap',
  marginBottom: 'var(--margin-lg)',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    flexDirection: 'column',
    gap: 'var(--gap-small)',
  },
}));

const LeftControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 'var(--gap-medium)',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const RightControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 'var(--gap-medium)',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    flexDirection: 'column',
    gap: 'var(--gap-small)',
  },
}));

const PageTitle = styled('h2')(() => ({
  margin: 0,
}));

const SearchFieldWrapper = styled(Box)(({ theme }) => ({
  width: '250px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const DatePickerWrapper = styled(Box)(({ theme }) => ({
  width: '290px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const DownloadButton = styled(IconButton)(() => ({
  color: 'var(--color-black)',
  padding: '8px',
  '&:hover': {
    backgroundColor: 'var(--color-gray-100)',
  },
}));

export default function UsersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { exportCSV } = useUsersApi();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSidebarItemClick = (item: any) => {
    console.log('Clicked sidebar item:', item.id);
    // Handle navigation logic here
  };

  const handleDownloadCSV = async () => {
    try {
      const blob = await exportCSV.execute();
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  return (
    <DashboardLayout
      sidebarItems={defaultAdminSidebarItems}
      onSidebarItemClick={handleSidebarItemClick}
    >
      <ControlsContainer>
        <LeftControls>
          <SearchFieldWrapper>
            <TextField 
              variant="outlined" 
              label="Search" 
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchFieldWrapper>
        </LeftControls>
        <RightControls>
          <DatePickerWrapper>
            <DateRangePicker 
              label="Date range" 
              inputWidth="100%"
              calendarWidth={isMobile ? '100%' : '680px'}
              sx={{
                width: '100%',
                '& .MuiTextField-root': {
                  width: '100%',
                },
              }}
            />
          </DatePickerWrapper>
          <AddFilterDropdown />
          <DownloadButton onClick={handleDownloadCSV}>
            <DownloadIcon />
          </DownloadButton>
        </RightControls>
      </ControlsContainer>
      <ContentArea>
        <HeaderRow>
          <PageTitle>User List</PageTitle>
        </HeaderRow>
        <UsersTable />
      </ContentArea>
    </DashboardLayout>
  );
}