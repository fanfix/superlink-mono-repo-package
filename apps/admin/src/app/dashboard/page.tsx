'use client';

import React from 'react';
import { Box } from '@mui/material';
import { DashboardLayout } from '../../components/Layout';
import { defaultAdminSidebarItems } from '../../components/Sidebar';
import DailyRevenue from './components/DailyRevenue';
import DailyViews from './components/DailyViews';
import Agencies from './components/Agencies';
import Views from './components/Views';
import Sales from './components/Sales';
import Users from './components/Users';

export default function AdminDashboard() {
  // Style variables
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: { xs: '0px', sm: '20px', md: '16px' },
  };

  return (
    <DashboardLayout sidebarItems={defaultAdminSidebarItems}>
      <Box sx={containerStyles}>
        <DailyRevenue />
        <DailyViews />
        <Agencies />
        <Views />
        <Sales />
        <Users />
      </Box>
    </DashboardLayout>
  );
}
  