'use client';

import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardLayout } from '../../components/Layout';
import { defaultAdminSidebarItems } from '../../components/Sidebar';

import AgenciesTable from './components/AgenciesTable';

const ContentArea = styled(Box)(() => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  minHeight: 'calc(100vh - 200px)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '100%',
}));

export default function AgenciesPage() {
  const handleSidebarItemClick = (item: any) => {
    console.log('Clicked sidebar item:', item.id);
    // Handle navigation logic here
  };

  return (
    <DashboardLayout
      sidebarItems={defaultAdminSidebarItems}
      onSidebarItemClick={handleSidebarItemClick}
    >
      <ContentArea>

        <Box>
          <h2>Agencies List</h2>
          {/* Agencies Table comes here */}
          <AgenciesTable />
        </Box>
      </ContentArea>
    </DashboardLayout>
  );
}