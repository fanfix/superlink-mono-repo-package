/**
 * API Types and Interfaces
 * Centralized type definitions for all API responses
 */

// ==================== Auth Types ====================
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  accessToken: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface SignupResponse {
  id: string;
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
  token?: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface AgencyAddress {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  zipCode?: string | null;
  country?: string | null;
  landmark?: string | null;
}

export interface AgencyInfo {
  id: string;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  imageURL?: string | null;
  website?: string | null;
  displayAgencyBranding?: boolean | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  postalCode?: string | null;
  country?: string | null;
  landmark?: string | null;
  address?: AgencyAddress | null;
}

export interface UserState {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  avatar?: string | null;
  imageURL?: string | null;
  agencyId?: string | null;
  agency?: AgencyInfo | null;
}

export interface AgencyProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  imageURL?: string | null;
  agencyId?: string | null;
  agencyName?: string | null;
  brandingEmail?: string | null;
  brandingPhoneNumber?: string | null;
  brandImageURL?: string | null;
  website?: string | null;
  introMessage?: string | null;
  displayAgencyBranding?: boolean | null;
  companyStreet?: string | null;
  companyCity?: string | null;
  companyState?: string | null;
  companyPostalCode?: string | null;
  companyCountry?: string | null;
  companyLandmark?: string | null;
}

export interface UpdateAgencyInput {
  agencyId: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  imageURL?: string;
  website?: string;
  introMessage?: string;
  displayAgencyBranding?: boolean;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  postalCode?: string;
  country?: string;
  landmark?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    postalCode?: string;
    country?: string;
    landmark?: string;
  };
}

export interface UpdateAgencyResponse {
  id: string;
  __typename?: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  id: string;
  __typename?: string;
}

// ==================== GraphQL Types ====================
export interface DailyAgencyVisit {
  date: string;
  revenue: number;
  visits: number;
  __typename: string;
}

export interface ProfileVisit {
  id: string;
  pageName: string;
  profileVisits: number;
  username: string;
  __typename: string;
}

export interface AgencyUser {
  id: string;
  name?: string | null;
  email?: string | null;
  imageURL?: string | null;
  __typename?: string;
}

export interface AgencyTeamAccess {
  id?: string;
  agencyTeam: {
    user: AgencyUser;
    __typename?: string;
  };
  __typename?: string;
}

export interface Creator {
  id: string;
  accepted: boolean;
  payoutMethod?: string | null;
  bio: {
    id: string;
    followerCount?: number;
    pageName: string;
    imageURL: string | null;
    username?: string | null;
    allowAgencyBranding?: boolean | null;
    socialLinks?: Array<{
      name: string;
      url: string;
      __typename: string;
    }>;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      isClaimed?: boolean | null;
      __typename?: string;
    };
    agencyTeamAccess: AgencyTeamAccess[];
    __typename?: string;
  };
  __typename?: string;
}

export interface RecentActivity {
  id: string;
  type?: string;
  description?: string;
  message?: string; // API returns 'message' field
  timestamp?: string;
  profileImage?: string;
  imageURL?: string;
  __typename?: string;
  [key: string]: any;
}

export interface Team {
  id: string;
  name?: string;
  user: AgencyUser;
  access: Array<{
    id?: string;
    bio: {
      id: string;
      pageName: string;
      imageURL: string | null;
      username?: string | null;
      allowAgencyBranding?: boolean | null;
      __typename?: string;
    };
    __typename?: string;
  }>;
  __typename?: string;
}

export interface Analytics {
  creators: number;
  teams: number;
  revenue: number;
  __typename: string;
}

export interface TopCreator {
  id: string;
  name: string;
  earnings: number;
  visits: number;
  [key: string]: any;
}

// ==================== Creator Earnings Types ====================
export interface CreatorEarningsPoint {
  date: string;
  earnings: number;
}

export interface CreatorTotalEarningsResponse {
  totalEarnings: number;
}

export interface CreatorTotalEarningsRangeResponse {
  totalEarnings: number;
}

export interface ToggleResponse {
  status: number;
  message: string;
}

// ==================== Settings Types ====================
export interface PayoutMethod {
  payoutMethod: 'individual_payout' | 'agency_payout';
}

export interface EmailRecipient {
  emailList: string[];
}

export interface StripeAccount {
  id?: string;
  transferAllowed?: boolean;
  url?: string;
}

export interface StripeDashboardLink {
  url: string;
}

// ==================== API Response Types ====================
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface GraphQLDataResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, any>;
  }>;
}

// ==================== Pagination Types ====================
export interface PaginationParams {
  limit?: number;
  offset?: number;
  query?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

// ==================== Error Types ====================
export * from './errors';

export interface CreatorListResponse {
  creators: Creator[];
  creatorsAggregate: number;
}

export interface CreatorsWithUnlockContentResponse {
  getCreatorsWithUnlockContent: Creator[];
  creatorsAggregate: number;
}

