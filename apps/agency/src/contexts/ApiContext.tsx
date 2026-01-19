'use client';

/**
 * API Context
 * Centralized context for all GraphQL API data management
 * Fetches all dashboard data when agencyId is available
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import {
  getDailyAgencyVisits,
  getProfileVisits,
  getRecentActivities,
  getAnalytics,
  DailyAgencyVisitsParams,
  ProfileVisitsParams,
  RecentActivitiesParams,
  AnalyticsParams,
} from '../api/services/dashboardService';
import { getTotalEarnings, getCreators, GetCreatorsParams, GetCreatorsResponse } from '../api/services/creatorsService';
import { getTeams, GetTeamsParams, GetTeamsResponse } from '../api/services/teamsService';
import {
  DailyAgencyVisit,
  ProfileVisit,
  RecentActivity,
  Analytics,
  Creator,
  Team,
  ReferralRevenue,
  ReferralStatsSummary,
  ReferralRecord,
  ReferralLink,
  ReferralEarnings,
  AgencyProfile,
  UpdateAgencyInput,
  UpdateAgencyResponse,
  UpdateAgencyUserInput,
  UploadImageResponse,
  ApiError,
  createApiError,
  AgencyInfo,
} from '../api/types';
import {
  getReferralLink,
  getReferralRevenue,
  getReferralEarnings,
  ReferralRevenueParams,
  ReferralEarningsParams,
} from '../api/services/referralService';
import {
  uploadProfileImage as uploadProfileImageService,
  updateAgency as updateAgencyService,
  updateAgencyUser as updateAgencyUserService,
} from '../api/services/profileService';

interface DashboardData {
  dailyVisits: DailyAgencyVisit[];
  profileVisits: ProfileVisit[];
  recentActivities: RecentActivity[];
  analytics: Analytics | null;
  totalEarnings: number;
  creators: Creator[];
  creatorsCount: number;
  teams: Team[];
  teamsCount: number;
}

interface ReferralDataState {
  link: string | null;
  code: string | null;
  revenue: ReferralRevenue | null;
  stats: ReferralStatsSummary | null;
  referrals: ReferralRecord[];
}

interface ReferralDashboardParams {
  code?: string;
  startDate: string;
  endDate: string;
}

interface ProfileState extends AgencyProfile {}

type UploadProfileImageTarget = 'profile' | 'brand' | 'both';

interface UploadProfileImageOptions {
  target?: UploadProfileImageTarget;
}

const extractAgencyAddress = (agency?: AgencyInfo | null) => ({
  street: agency?.address?.street ?? agency?.street ?? null,
  city: agency?.address?.city ?? agency?.city ?? null,
  state: agency?.address?.state ?? agency?.state ?? null,
  postalCode:
    agency?.address?.postalCode ??
    agency?.address?.zipCode ??
    agency?.postalCode ??
    agency?.zip ??
    null,
  country: agency?.address?.country ?? agency?.country ?? null,
  landmark: agency?.address?.landmark ?? agency?.landmark ?? null,
});

interface ApiContextType {
  // Dashboard Data
  dashboardData: DashboardData;
  referralData: ReferralDataState;
  profile: ProfileState;
  
  // Loading States
  isLoading: boolean;
  loadingStates: {
    dailyVisits: boolean;
    profileVisits: boolean;
    recentActivities: boolean;
    analytics: boolean;
    totalEarnings: boolean;
    creators: boolean;
    teams: boolean;
    referralLink: boolean;
    referralRevenue: boolean;
    referralEarnings: boolean;
    profile: boolean;
    profileUpdate: boolean;
    profileImageUpload: boolean;
    agencyUpdate: boolean;
  };
  
  // Error States
  errors: {
    dailyVisits: ApiError | null;
    profileVisits: ApiError | null;
    recentActivities: ApiError | null;
    analytics: ApiError | null;
    totalEarnings: ApiError | null;
    creators: ApiError | null;
    teams: ApiError | null;
    referralLink: ApiError | null;
    referralRevenue: ApiError | null;
    referralEarnings: ApiError | null;
    profile: ApiError | null;
    profileUpdate: ApiError | null;
    profileImageUpload: ApiError | null;
    agencyUpdate: ApiError | null;
  };
  
  // Refresh Functions
  refreshDashboard: () => Promise<void>;
  refreshDailyVisits: (params: DailyAgencyVisitsParams) => Promise<void>;
  refreshProfileVisits: (params: ProfileVisitsParams) => Promise<void>;
  refreshRecentActivities: (params: RecentActivitiesParams) => Promise<void>;
  refreshAnalytics: (params: AnalyticsParams) => Promise<void>;
  refreshTotalEarnings: (agencyId: string) => Promise<void>;
  refreshCreators: (params: GetCreatorsParams) => Promise<void>;
  refreshTeams: (params: GetTeamsParams) => Promise<void>;
  refreshReferralLink: () => Promise<ReferralLink | null>;
  refreshReferralRevenue: (params: ReferralRevenueParams) => Promise<ReferralRevenue | null>;
  refreshReferralEarnings: (params: ReferralEarningsParams) => Promise<ReferralEarnings | null>;
  refreshReferralDashboard: (params: ReferralDashboardParams) => Promise<void>;
  uploadProfileImage: (file: File, options?: UploadProfileImageOptions) => Promise<UploadImageResponse | null>;
  updateProfile: (input: UpdateAgencyUserInput) => Promise<AgencyProfile | null>;
  updateAgencyBranding: (input: UpdateAgencyInput) => Promise<UpdateAgencyResponse | null>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { agencyId, isLoading: authLoading, user, fetchUserState } = useAuth();
  const pathname = usePathname();
  
  // Fix hydration error - only initialize after mount
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    console.log('ApiContext: Component mounted');
  }, []);
  
  // Log when agencyId changes
  useEffect(() => {
    console.log('ApiContext: agencyId changed', {
      agencyId,
      hasAgencyId: !!agencyId,
      authLoading,
      isMounted,
    });
  }, [agencyId, authLoading, isMounted]);
  
  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    dailyVisits: [],
    profileVisits: [],
    recentActivities: [],
    analytics: null,
    totalEarnings: 0,
    creators: [],
    creatorsCount: 0,
    teams: [],
    teamsCount: 0,
  });

  const initialAgencyAddress = extractAgencyAddress(user?.agency);

  const [profile, setProfile] = useState<ProfileState>({
    id: user?.id ?? '',
    name: user?.name ?? user?.email ?? '',
    email: user?.email ?? '',
    phoneNumber: user?.phone ?? undefined,
    imageURL: user?.avatar ?? user?.imageURL ?? undefined,
    agencyId: user?.agency?.id ?? null,
    agencyName: user?.agency?.name ?? null,
    brandingEmail: user?.agency?.email ?? null,
    brandingPhoneNumber: user?.agency?.phoneNumber ?? null,
    brandImageURL: user?.agency?.imageURL ?? null,
    website: user?.agency?.website ?? null,
    displayAgencyBranding: user?.agency?.displayAgencyBranding ?? null,
    companyStreet: initialAgencyAddress.street,
    companyCity: initialAgencyAddress.city,
    companyState: initialAgencyAddress.state,
    companyPostalCode: initialAgencyAddress.postalCode,
    companyCountry: initialAgencyAddress.country,
    companyLandmark: initialAgencyAddress.landmark,
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfile(prev => {
      const agencyAddress = extractAgencyAddress(user.agency);

      return {
      ...prev,
      id: user.id ?? prev.id ?? '',
      name: user.name ?? prev.name ?? user.email ?? '',
      email: user.email ?? prev.email ?? '',
      phoneNumber: user.phone ?? prev.phoneNumber,
      imageURL: user.avatar ?? user.imageURL ?? prev.imageURL,
      agencyId: user.agency?.id ?? prev.agencyId ?? null,
      agencyName: user.agency?.name ?? prev.agencyName ?? null,
      brandingEmail: user.agency?.email ?? prev.brandingEmail ?? null,
      brandingPhoneNumber: user.agency?.phoneNumber ?? prev.brandingPhoneNumber ?? null,
      brandImageURL: user.agency?.imageURL ?? prev.brandImageURL ?? null,
      website: user.agency?.website ?? prev.website ?? null,
      displayAgencyBranding: user.agency?.displayAgencyBranding ?? prev.displayAgencyBranding ?? null,
        companyStreet: agencyAddress.street ?? prev.companyStreet ?? null,
        companyCity: agencyAddress.city ?? prev.companyCity ?? null,
        companyState: agencyAddress.state ?? prev.companyState ?? null,
        companyPostalCode: agencyAddress.postalCode ?? prev.companyPostalCode ?? null,
        companyCountry: agencyAddress.country ?? prev.companyCountry ?? null,
        companyLandmark: agencyAddress.landmark ?? prev.companyLandmark ?? null,
      };
    });
  }, [
    user?.id,
    user?.name,
    user?.email,
    user?.phone,
    user?.avatar,
    user?.imageURL,
    user?.agency?.id,
    user?.agency?.name,
    user?.agency?.email,
    user?.agency?.phoneNumber,
    user?.agency?.imageURL,
    user?.agency?.website,
    user?.agency?.displayAgencyBranding,
    user?.agency?.street,
    user?.agency?.city,
    user?.agency?.state,
    user?.agency?.postalCode,
    user?.agency?.zip,
    user?.agency?.country,
    user?.agency?.landmark,
    user?.agency?.address?.street,
    user?.agency?.address?.city,
    user?.agency?.address?.state,
    user?.agency?.address?.postalCode,
    user?.agency?.address?.zipCode,
    user?.agency?.address?.country,
    user?.agency?.address?.landmark,
  ]);

  const [referralData, setReferralData] = useState<ReferralDataState>({
    link: null,
    code: null,
    revenue: null,
    stats: null,
    referrals: [],
  });
  
  // Loading States
  const [loadingStates, setLoadingStates] = useState({
    dailyVisits: false,
    profileVisits: false,
    recentActivities: false,
    analytics: false,
    totalEarnings: false,
    creators: false,
    teams: false,
    referralLink: false,
    referralRevenue: false,
    referralEarnings: false,
    profile: false,
    profileUpdate: false,
    profileImageUpload: false,
    agencyUpdate: false,
  });
  
  // Error States
  const [errors, setErrors] = useState<{
    dailyVisits: ApiError | null;
    profileVisits: ApiError | null;
    recentActivities: ApiError | null;
    analytics: ApiError | null;
    totalEarnings: ApiError | null;
    creators: ApiError | null;
    teams: ApiError | null;
    referralLink: ApiError | null;
    referralRevenue: ApiError | null;
    referralEarnings: ApiError | null;
    profile: ApiError | null;
    profileUpdate: ApiError | null;
    profileImageUpload: ApiError | null;
    agencyUpdate: ApiError | null;
  }>({
    dailyVisits: null,
    profileVisits: null,
    recentActivities: null,
    analytics: null,
    totalEarnings: null,
    creators: null,
    teams: null,
    referralLink: null,
    referralRevenue: null,
    referralEarnings: null,
    profile: null,
    profileUpdate: null,
    profileImageUpload: null,
    agencyUpdate: null,
  });
  
  // Helper to update loading state
  const setLoading = useCallback((key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);
  
  // Helper to update error state
  const setError = useCallback((key: keyof typeof errors, error: ApiError | null) => {
    setErrors(prev => ({ ...prev, [key]: error }));
  }, []);
  
  /**
   * Fetch Daily Visits
   */
  const fetchDailyVisits = useCallback(async (params: DailyAgencyVisitsParams) => {
    console.log('ApiContext: fetchDailyVisits called with params:', params);
    setLoading('dailyVisits', true);
    setError('dailyVisits', null);
    
    try {
      console.log('ApiContext: Calling getDailyAgencyVisits API...');
      const data = await getDailyAgencyVisits(params);
      console.log('ApiContext: ✅ Daily visits API response:', data);
      setDashboardData(prev => ({ ...prev, dailyVisits: data }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log('ApiContext: Daily visits fetched:', data);
      }
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('dailyVisits', apiError);
      console.error('ApiContext: ❌ Failed to fetch daily visits:', apiError);
      console.error('ApiContext: Error details:', error);
    } finally {
      setLoading('dailyVisits', false);
    }
  }, [setLoading, setError]);
  
  /**
   * Fetch Profile Visits
   */
  const fetchProfileVisits = useCallback(async (params: ProfileVisitsParams) => {
    console.log('ApiContext: fetchProfileVisits called with params:', params);
    setLoading('profileVisits', true);
    setError('profileVisits', null);
    
    try {
      console.log('ApiContext: Calling getProfileVisits API...');
      const data = await getProfileVisits(params);
      console.log('ApiContext: ✅ Profile visits API response:', data);
      setDashboardData(prev => ({ ...prev, profileVisits: data }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log('ApiContext: Profile visits fetched:', data);
      }
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('profileVisits', apiError);
      console.error('ApiContext: ❌ Failed to fetch profile visits:', apiError);
    } finally {
      setLoading('profileVisits', false);
    }
  }, [setLoading, setError]);
  
  /**
   * Fetch Recent Activities
   */
  const fetchRecentActivities = useCallback(async (params: RecentActivitiesParams) => {
    console.log('ApiContext: fetchRecentActivities called with params:', params);
    setLoading('recentActivities', true);
    setError('recentActivities', null);
    
    try {
      console.log('ApiContext: Calling getRecentActivities API...');
      const data = await getRecentActivities(params);
      console.log('ApiContext: ✅ Recent activities API response:', data);
      setDashboardData(prev => ({ ...prev, recentActivities: data }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log('ApiContext: Recent activities fetched:', data);
      }
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('recentActivities', apiError);
      console.error('ApiContext: ❌ Failed to fetch recent activities:', apiError);
    } finally {
      setLoading('recentActivities', false);
    }
  }, [setLoading, setError]);
  
  /**
   * Fetch Analytics
   */
  const fetchAnalytics = useCallback(async (params: AnalyticsParams) => {
    console.log('ApiContext: fetchAnalytics called with params:', params);
    setLoading('analytics', true);
    setError('analytics', null);
    
    try {
      console.log('ApiContext: Calling getAnalytics API...');
      const data = await getAnalytics(params);
      console.log('ApiContext: ✅ Analytics API response:', data);
      setDashboardData(prev => ({ ...prev, analytics: data }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log('ApiContext: Analytics fetched:', data);
      }
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('analytics', apiError);
      console.error('ApiContext: ❌ Failed to fetch analytics:', apiError);
    } finally {
      setLoading('analytics', false);
    }
  }, [setLoading, setError]);
  
  /**
   * Fetch Total Earnings
   */
  const fetchTotalEarnings = useCallback(async (agencyId: string) => {
    console.log('ApiContext: fetchTotalEarnings called with agencyId:', agencyId);
    setLoading('totalEarnings', true);
    setError('totalEarnings', null);
    
    try {
      console.log('ApiContext: Calling getTotalEarnings API...');
      const data = await getTotalEarnings(agencyId);
      console.log('ApiContext: ✅ Total earnings API response:', data);
      setDashboardData(prev => ({ ...prev, totalEarnings: data }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log('ApiContext: Total earnings fetched:', data);
      }
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('totalEarnings', apiError);
      console.error('ApiContext: ❌ Failed to fetch total earnings:', apiError);
    } finally {
      setLoading('totalEarnings', false);
    }
  }, [setLoading, setError]);
  
  /**
   * Fetch Creators
   */
  const fetchCreators = useCallback(async (params: GetCreatorsParams) => {
    console.log('ApiContext: fetchCreators called with params:', params);
    setLoading('creators', true);
    setError('creators', null);
    
    try {
      console.log('ApiContext: Calling getCreators API...');
      const data = await getCreators(params);
      console.log('ApiContext: ✅ Creators API response:', data);
      setDashboardData(prev => ({ 
        ...prev, 
        creators: data.getCreators,
        creatorsCount: data.creatorsAggregate,
      }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log('ApiContext: Creators fetched:', data);
      }
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('creators', apiError);
      console.error('ApiContext: ❌ Failed to fetch creators:', apiError);
    } finally {
      setLoading('creators', false);
    }
  }, [setLoading, setError]);
  
  /**
   * Fetch Teams
   */
  const fetchTeams = useCallback(async (params: GetTeamsParams) => {
    console.log('ApiContext: fetchTeams called with params:', params);
    setLoading('teams', true);
    setError('teams', null);
    
    try {
      console.log('ApiContext: Calling getTeams API...');
      const data = await getTeams(params);
      console.log('ApiContext: ✅ Teams API response:', data);
      setDashboardData(prev => ({ 
        ...prev, 
        teams: data.getTeams,
        teamsCount: data.teamsAggregate,
      }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log('ApiContext: Teams fetched:', data);
      }
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('teams', apiError);
      console.error('ApiContext: ❌ Failed to fetch teams:', apiError);
    } finally {
      setLoading('teams', false);
    }
  }, [setLoading, setError]);

  /**
   * Fetch Referral Link
   */
  const fetchReferralLink = useCallback(async (): Promise<ReferralLink | null> => {
    console.log('ApiContext: fetchReferralLink called');
    setLoading('referralLink', true);
    setError('referralLink', null);

    try {
      const data = await getReferralLink();
      console.log('ApiContext: ✅ Referral link response:', data);

      setReferralData(prev => ({
        ...prev,
        link: data?.referralLink ?? null,
        code: data?.code ?? null,
      }));

      return data;
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('referralLink', apiError);
      console.error('ApiContext: ❌ Failed to fetch referral link:', apiError);
      return null;
    } finally {
      setLoading('referralLink', false);
    }
  }, [setLoading, setError]);

  /**
   * Fetch Referral Revenue
   */
  const fetchReferralRevenueData = useCallback(async (
    params: ReferralRevenueParams
  ): Promise<ReferralRevenue | null> => {
    console.log('ApiContext: fetchReferralRevenueData called with params:', params);
    setLoading('referralRevenue', true);
    setError('referralRevenue', null);

    try {
      const data = await getReferralRevenue(params);
      console.log('ApiContext: ✅ Referral revenue response:', data);
      setReferralData(prev => ({
        ...prev,
        revenue: data ?? null,
      }));
      return data;
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('referralRevenue', apiError);
      console.error('ApiContext: ❌ Failed to fetch referral revenue:', apiError);
      return null;
    } finally {
      setLoading('referralRevenue', false);
    }
  }, [setLoading, setError]);

  /**
   * Fetch Referral Earnings and referrals list
   */
  const fetchReferralEarningsData = useCallback(async (
    params: ReferralEarningsParams
  ): Promise<ReferralEarnings | null> => {
    console.log('ApiContext: fetchReferralEarningsData called with params:', params);
    setLoading('referralEarnings', true);
    setError('referralEarnings', null);

    try {
      const data = await getReferralEarnings(params);
      console.log('ApiContext: ✅ Referral earnings response:', data);
      setReferralData(prev => ({
        ...prev,
        stats: data?.stats ?? null,
        referrals: Array.isArray(data?.referrals) ? data?.referrals : [],
      }));
      return data;
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('referralEarnings', apiError);
      console.error('ApiContext: ❌ Failed to fetch referral earnings:', apiError);
      return null;
    } finally {
      setLoading('referralEarnings', false);
    }
  }, [setLoading, setError]);

  /**
   * Refresh referral dashboard data
   */
  const refreshReferralDashboard = useCallback(async ({
    code,
    startDate,
    endDate,
  }: ReferralDashboardParams) => {
    const referralCode = code ?? referralData.code;

    if (!referralCode) {
      console.warn('ApiContext: Cannot refresh referral dashboard - referral code missing');
      return;
    }

    console.log('ApiContext: Refreshing referral dashboard data', {
      referralCode,
      startDate,
      endDate,
    });

    try {
      await Promise.all([
        fetchReferralRevenueData({ code: referralCode, startDate, endDate }),
        fetchReferralEarningsData({ code: referralCode, startDate, endDate }),
      ]);
      console.log('ApiContext: ✅ Referral dashboard refreshed successfully');
    } catch (error) {
      console.error('ApiContext: ❌ Error refreshing referral dashboard:', error);
      throw error;
    }
  }, [fetchReferralRevenueData, fetchReferralEarningsData, referralData.code]);

  /**
   * Upload profile image
   */
  const handleUploadProfileImage = useCallback(async (
    file: File,
    options: UploadProfileImageOptions = {}
  ): Promise<UploadImageResponse | null> => {
    const target = options.target ?? 'profile';
    setLoading('profileImageUpload', true);
    setError('profileImageUpload', null);

    try {
      const data = await uploadProfileImageService(file);
      const resolvedImage = data?.imageURL ?? data?.originalImageURL ?? null;

      if (resolvedImage) {
        setProfile(prev => ({
          ...prev,
          imageURL:
            target === 'profile' || target === 'both'
              ? resolvedImage
              : prev.imageURL,
          brandImageURL:
            target === 'brand' || target === 'both'
              ? resolvedImage
              : prev.brandImageURL,
        }));
      }
      return data;
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('profileImageUpload', apiError);
      console.error('ApiContext: ❌ Failed to upload profile image:', apiError);
      throw apiError;
    } finally {
      setLoading('profileImageUpload', false);
    }
  }, [setLoading, setError]);

  /**
   * Update profile details
   */
  const handleUpdateProfile = useCallback(async (
    input: UpdateAgencyUserInput
  ): Promise<AgencyProfile | null> => {
    setLoading('profileUpdate', true);
    setError('profileUpdate', null);

    try {
      const data = await updateAgencyUserService(input);

      setProfile(prev => ({
        ...prev,
        ...input,
        ...data,
      }));

      try {
        await fetchUserState();
      } catch (refreshError) {
        console.warn('ApiContext: ⚠️ Failed to refresh user state after profile update:', refreshError);
      }

      return data;
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('profileUpdate', apiError);
      console.error('ApiContext: ❌ Failed to update profile:', apiError);
      throw apiError;
    } finally {
      setLoading('profileUpdate', false);
    }
  }, [setLoading, setError, fetchUserState]);
  
  /**
   * Update agency branding/details
   */
  const handleUpdateAgency = useCallback(async (
    input: UpdateAgencyInput
  ): Promise<UpdateAgencyResponse | null> => {
    setLoading('agencyUpdate', true);
    setError('agencyUpdate', null);

    try {
      const data = await updateAgencyService(input);

      setProfile(prev => ({
        ...prev,
        agencyId: input.agencyId ?? prev.agencyId,
        agencyName: input.name ?? prev.agencyName,
        brandingEmail: input.email ?? prev.brandingEmail,
        brandingPhoneNumber: input.phoneNumber ?? prev.brandingPhoneNumber,
        brandImageURL: input.imageURL ?? prev.brandImageURL,
        website: input.website ?? prev.website,
        displayAgencyBranding:
          typeof input.displayAgencyBranding === 'boolean'
            ? input.displayAgencyBranding
            : prev.displayAgencyBranding,
        companyStreet: input.street ?? input.address?.street ?? prev.companyStreet ?? null,
        companyCity: input.city ?? input.address?.city ?? prev.companyCity ?? null,
        companyState: input.state ?? input.address?.state ?? prev.companyState ?? null,
        companyPostalCode:
          input.postalCode ??
          input.zip ??
          input.address?.postalCode ??
          input.address?.zipCode ??
          prev.companyPostalCode ??
          null,
        companyCountry: input.country ?? input.address?.country ?? prev.companyCountry ?? null,
        companyLandmark: input.landmark ?? input.address?.landmark ?? prev.companyLandmark ?? null,
      }));

      return data;
    } catch (error: any) {
      const apiError = error instanceof ApiError ? error : createApiError(error);
      setError('agencyUpdate', apiError);
      console.error('ApiContext: ❌ Failed to update agency branding:', apiError);
      throw apiError;
    } finally {
      setLoading('agencyUpdate', false);
    }
  }, [setLoading, setError]);
  
  /**
   * Refresh all dashboard data
   */
  const refreshDashboard = useCallback(async () => {
    if (!agencyId) {
      console.warn('ApiContext: Cannot refresh dashboard - agencyId not available');
      return;
    }
    
    if (!isMounted) {
      console.log('ApiContext: Waiting for component to mount...');
      return;
    }
    
    const skipRoutes = ['/dashboard/teams', '/dashboard/creator', '/dashboard/referred'];
    const shouldSkipForRoute = pathname ? skipRoutes.some(route => pathname.startsWith(route)) : false;
    if (shouldSkipForRoute) {
      console.log('ApiContext: Skipping dashboard refresh for route:', pathname);
      return;
    }

    console.log('ApiContext: Refreshing all dashboard data for agencyId:', agencyId);
    
    // Default date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Fetch all data in parallel (only dashboard APIs, not teams/creators)
    console.log('ApiContext: Starting parallel API calls...');
    try {
      await Promise.all([
        fetchDailyVisits({
          agencyId,
          startDate: startDateStr,
          endDate: endDateStr,
        }),
        fetchProfileVisits({
          startDate: startDateStr,
          endDate: endDateStr,
        }),
        fetchRecentActivities({
          agencyId,
          offset: 0,
          limit: 10,
        }),
        fetchAnalytics({
          agencyId,
          creators: [], // Empty array - API should handle this
        }),
        fetchTotalEarnings(agencyId),
        // Teams and Creators APIs will be called only when user navigates to those routes
        // Removed from here to avoid unnecessary API calls
      ]);
      
      console.log('ApiContext: ✅ All dashboard data refreshed successfully');
    } catch (error) {
      console.error('ApiContext: ❌ Error during parallel API calls:', error);
      throw error;
    }
  }, [
    agencyId,
    isMounted,
    fetchDailyVisits,
    fetchProfileVisits,
    fetchRecentActivities,
    fetchAnalytics,
    fetchTotalEarnings,
    fetchCreators,
    fetchTeams,
    pathname,
  ]);
  
  // Track if we've already fetched data for this agencyId
  const fetchedAgencyIdRef = useRef<string | null>(null);

  /**
   * Auto-fetch dashboard data when agencyId becomes available (after mount to avoid hydration errors)
   */
  useEffect(() => {
    console.log('ApiContext: useEffect triggered', {
      isMounted,
      agencyId,
      hasAgencyId: !!agencyId,
      authLoading,
      fetchedAgencyId: fetchedAgencyIdRef.current,
    });
    
    // Wait for auth to finish loading
    if (authLoading) {
      console.log('ApiContext: Auth still loading, waiting...');
      return;
    }
    
    if (!isMounted) {
      console.log('ApiContext: Component not mounted yet, waiting...');
      return;
    }
    
    const skipRoutes = ['/dashboard/teams', '/dashboard/creator', '/dashboard/referred'];
    const shouldSkipForRoute = pathname ? skipRoutes.some(route => pathname.startsWith(route)) : false;
    if (shouldSkipForRoute) {
      console.log('ApiContext: Route configured to skip dashboard prefetch:', pathname);
      fetchedAgencyIdRef.current = null;
      return;
    }

    if (!agencyId) {
      console.log('ApiContext: No agencyId available yet');
      return;
    }

    // Prevent duplicate calls for the same agencyId
    if (fetchedAgencyIdRef.current === agencyId) {
      console.log('ApiContext: Already fetched data for this agencyId, skipping...');
      return;
    }
    
    console.log('ApiContext: ✅ All conditions met, fetching all dashboard data...');
    console.log('ApiContext: isMounted:', isMounted, 'agencyId:', agencyId, 'authLoading:', authLoading);
    
    // Mark that we're fetching for this agencyId
    fetchedAgencyIdRef.current = agencyId;
    
    // Use a ref to prevent multiple simultaneous calls
    const fetchData = async () => {
      try {
        console.log('ApiContext: Calling refreshDashboard...');
        await refreshDashboard();
        console.log('ApiContext: ✅ Dashboard data fetch completed');
      } catch (error) {
        console.error('ApiContext: ❌ Error refreshing dashboard:', error);
        // Reset on error so we can retry
        if (fetchedAgencyIdRef.current === agencyId) {
          fetchedAgencyIdRef.current = null;
        }
      }
    };
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId, isMounted, authLoading, pathname]);
  
  const isLoading = Object.values(loadingStates).some(Boolean);
  
  const value: ApiContextType = {
    dashboardData,
    referralData,
    profile,
    isLoading,
    loadingStates,
    errors,
    refreshDashboard,
    refreshDailyVisits: fetchDailyVisits,
    refreshProfileVisits: fetchProfileVisits,
    refreshRecentActivities: fetchRecentActivities,
    refreshAnalytics: fetchAnalytics,
    refreshTotalEarnings: fetchTotalEarnings,
    refreshCreators: fetchCreators,
    refreshTeams: fetchTeams,
    refreshReferralLink: fetchReferralLink,
    refreshReferralRevenue: fetchReferralRevenueData,
    refreshReferralEarnings: fetchReferralEarningsData,
    refreshReferralDashboard,
    uploadProfileImage: handleUploadProfileImage,
    updateProfile: handleUpdateProfile,
    updateAgencyBranding: handleUpdateAgency,
  };
  
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApiContext() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}
