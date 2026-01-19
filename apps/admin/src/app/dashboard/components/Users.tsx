"use client";

import React, { useEffect, useState } from 'react';
import { Box} from '@mui/material';
import { AgencyCount } from '../../../../../../packages/design-system/src/ui/AgencyCount';
import { Card, Typography } from '@superline/design-system';
import { useDashboardApi } from '../../../hooks';
import { agencySummaryData, mockAgencyData, formatCurrency, AgencyData } from './mockData';

const Users: React.FC = () => {
  const { fetchInsights, loading } = useDashboardApi();
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const result = await fetchInsights.execute();
        if (result) {
          setInsights(result);
        }
      } catch (err) {
        console.error('Error loading insights:', err);
      }
    };
    loadInsights();
  }, [fetchInsights]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  return (
    // <Box
    //   sx={{
    //     backgroundColor: 'white',
    //     borderRadius: '12px',
    //     padding: { xs: '16px', sm: '20px', md: '24px' },
    //     boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     gap: '16px',
    //   }}
    // >
    //   {/* Users Title */}
    //   <Typography
    //     sx={{
    //       fontSize: { xs: '20px', sm: '24px', md: '28px' },
    //       fontWeight: 700,
    //       color: '#1f2937', // Dark blue/black
    //       marginBottom: '8px',
    //     }}
    //   >
    //     Users
    //   </Typography>

    //   {/* Users Metrics */}
    //   <Box
    //     sx={{
    //       display: 'flex',
    //       flexDirection: { xs: 'column', sm: 'row' },
    //       gap: '16px',
    //       alignItems: 'stretch',
    //     }}
    //   >
    //     {/* Total Users */}
    //     <Box sx={{ flex: 1 }}>
    //       <AgencyCount
    //         label="Total Users"
    //         count="594"
    //         onClick={() => console.log('Total Users clicked')}
    //         sx={{
    //           width: '100%',
    //           height: '120px',
    //           backgroundColor: 'var(--color-white-sidebar)',
    //           borderRadius: '8px',
    //           boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    //           padding: '20px',
    //           '&:hover': {
    //             backgroundColor: '#f9fafb',
    //           },
    //         }}
    //       />
    //     </Box>

    //     {/* Total Creators w/ SuperLocked content */}
    //     <Box sx={{ flex: 1 }}>
    //       <AgencyCount
    //         label="Total Creators w/ SuperLocked content"
    //         count="1200"
    //         onClick={() => console.log('Total Creators w/ SuperLocked content clicked')}
    //         sx={{
    //           width: '100%',
    //           height: '120px',
    //           backgroundColor: 'var(--color-white-sidebar)',
    //           borderRadius: '8px',
    //           boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    //           padding: '20px',
    //           '&:hover': {
    //             backgroundColor: '#f9fafb',
    //           },
    //         }}
    //       />
    //     </Box>

    //     {/* Sign Ups / Week */}
    //     <Box sx={{ flex: 1 }}>
    //       <AgencyCount
    //         label="Sign Ups / Week"
    //         count="+920"
    //         onClick={() => console.log('Sign Ups / Week clicked')}
    //         sx={{
    //           width: '100%',
    //           height: '120px',
    //           backgroundColor: 'var(--color-white-sidebar)',
    //           borderRadius: '8px',
    //           boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    //           padding: '20px',
    //           '&:hover': {
    //             backgroundColor: '#f9fafb',
    //           },
    //         }}
    //       />
    //     </Box>
    //   </Box>
    // </Box>
    <Card
    sx={{
      width: '100%',
      fontFamily: 'var(--font-family-primary)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--padding-2xl)',
      backgroundColor: 'var(--color-white)',
      padding: 'var(--padding-2xl)',
      borderRadius: 'var(--border-radius-lg)',
      boxShadow: 'var(--shadow-sm)',
    }}
  >
    {/* Title Section */}
    <Typography
      sx={{
        fontSize: { xs: 'var(--font-size-lg)', sm: 'var(--font-size-xl)', md: 'calc(var(--font-size-xl) + 4px)' },
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--color-gray-800)',
        lineHeight: 'var(--line-height-tight)',
      }}
    >
      Users
    </Typography>

    {/* Summary Cards Section */}
    {/* <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: '16px', sm: '20px', md: '24px' },
      }}
    >
    
      <AgencyCount
        label="Total Views"
        count={formatNumber(viewsSummaryData.totalViews)}
        sx={{
          flex: 1,
          minWidth: { xs: '100%', sm: '200px' },
          padding: { xs: '16px', sm: '20px', md: '24px' },
          backgroundColor: 'var(--color-white-sidebar)',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: '#f1f3f4',
          },
        }}
      />

     
      <AgencyCount
        label="Total Views w/ SuperLocked content"
        count={formatNumber(viewsSummaryData.totalViewsWithSuperLocked)}
        sx={{
          flex: 1,
          minWidth: { xs: '100%', sm: '200px' },
          padding: { xs: '16px', sm: '20px', md: '24px' },
          backgroundColor: 'var(--color-white-sidebar)',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: '#f1f3f4',
          },
        }}
      />
    </Box> */}
<Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 'var(--padding-lg-1)', sm: 'var(--padding-xl)', md: 'var(--padding-xl)' },
        height:"auto",
      }}
    >
      {/* Total Agencies Card */}
      <Card
        sx={{
          padding: { xs: 'var(--padding-lg-1)', sm: 'var(--padding-xl)', md: 'var(--padding-xl)' },
          backgroundColor: 'var(--color-white-sidebar)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          flex: 1,
          height:"100%",
          // minWidth: { xs: '100%', sm: '200px' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 'var(--font-size-md)', sm: 'var(--font-size-md)' },
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-gray-500)',
              marginBottom: 'var(--margin-sm)',
            }}
          >
            Total Users
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 'var(--font-size-xl)', sm: 'calc(var(--font-size-xl) + 4px)', md: 'calc(var(--font-size-xl) + 8px)' },
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-gray-800)',
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            {loading ? 'Loading...' : formatNumber(insights?.users || agencySummaryData.totalAgencies)}
          </Typography>
        </Box>
      </Card>

      {/* Agencies w/ SuperLocked Card */}
      <Card
        sx={{
          padding: { xs: 'var(--padding-lg-1)', sm: 'var(--padding-xl)', md: 'var(--padding-xl)' },
          backgroundColor: 'var(--color-white-sidebar)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          flex: 1,
          // minWidth: { xs: '100%', sm: '200px' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 'var(--font-size-md)', sm: 'var(--font-size-md-1)' },
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-gray-500)',
              marginBottom: 'var(--margin-sm)',
            }}
          >
            Total Creators w/ SuperLocked
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 'var(--font-size-xl)', sm: 'calc(var(--font-size-xl) + 4px)', md: 'calc(var(--font-size-xl) + 8px)' },
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-gray-800)',
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            {loading ? 'Loading...' : formatNumber(insights?.creatorsWithStripe || agencySummaryData.agenciesWithSuperLocked)}
          </Typography>
        </Box>
      </Card>

      {/* Agencies w/ SuperLocked & Instagram Card */}
      <Card
        sx={{
          padding: { xs: 'var(--padding-lg-1)', sm: 'var(--padding-xl)', md: 'var(--padding-xl)' },
          backgroundColor: 'var(--color-white-sidebar)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          flex: 1,
          // minWidth: { xs: '100%', sm: '200px' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 'var(--font-size-md)', sm: 'var(--font-size-md)' },
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-gray-500)',
              marginBottom: 'var(--margin-sm)',
            }}
          >
            Sign Ups / Week
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 'var(--font-size-xl)', sm: 'calc(var(--font-size-xl) + 4px)', md: 'calc(var(--font-size-xl) + 8px)' },
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-gray-800)',
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            {loading ? 'Loading...' : formatNumber(insights?.creators || agencySummaryData.agenciesWithSuperLockedAndInstagram)}
          </Typography>
        </Box>
      </Card>
</Box>
    
  </Card>
  );
};

export default Users;
