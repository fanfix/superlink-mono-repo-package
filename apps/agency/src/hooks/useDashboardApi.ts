/**
 * useDashboardApi Hook
 * Provides access to dashboard data from ApiContext
 * All API calls are handled in ApiContext, hooks just provide the data
 */

import { useApiContext } from '../contexts/ApiContext';

export const useDashboardApi = () => {
  const {
    dashboardData,
    loadingStates,
    errors,
    refreshDashboard,
    refreshDailyVisits,
    refreshProfileVisits,
    refreshRecentActivities,
    refreshAnalytics,
  } = useApiContext();
  
  return {
    // Data from context
    dailyVisits: dashboardData.dailyVisits,
    profileVisits: dashboardData.profileVisits,
    recentActivities: dashboardData.recentActivities,
    analytics: dashboardData.analytics,
    creators: dashboardData.creators,
    creatorsCount: dashboardData.creatorsCount,
    teams: dashboardData.teams,
    teamsCount: dashboardData.teamsCount,
    
    // Loading states
    loading: loadingStates.dailyVisits || 
             loadingStates.profileVisits || 
             loadingStates.recentActivities || 
             loadingStates.analytics ||
             loadingStates.creators ||
             loadingStates.teams,
    loadingStates: {
      dailyVisits: loadingStates.dailyVisits,
      profileVisits: loadingStates.profileVisits,
      recentActivities: loadingStates.recentActivities,
      analytics: loadingStates.analytics,
      creators: loadingStates.creators,
      teams: loadingStates.teams,
    },
    
    // Error states
    error: errors.dailyVisits || 
           errors.profileVisits || 
           errors.recentActivities || 
           errors.analytics ||
           errors.creators ||
           errors.teams,
    errors: {
      dailyVisits: errors.dailyVisits,
      profileVisits: errors.profileVisits,
      recentActivities: errors.recentActivities,
      analytics: errors.analytics,
      creators: errors.creators,
      teams: errors.teams,
    },
    
    // Refresh functions
    refreshDashboard,
    refreshDailyVisits,
    refreshProfileVisits,
    refreshRecentActivities,
    refreshAnalytics,
  };
};
