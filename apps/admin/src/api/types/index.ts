/**
 * API Types and Interfaces for Admin Panel
 * Centralized type definitions for all API responses
 */

// ==================== Auth Types ====================
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  [key: string]: any;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  phoneNumber?: string | null;
  isAdmin?: boolean;
  [key: string]: any;
}

// ==================== User Management Types ====================
export interface User {
  phoneNumber?: string | null;
  name?: string | null;
  email: string;
  id: string;
  isAdmin?: boolean;
  createdAt?: string;
  deletedAt?: string | null;
  profileVisits?: number;
  onboardingOrigin?: string;
  totalRevenue?: number;
}

export interface UsersForAdminResponse {
  usersForAdmin: User[];
  usersAggregateForAdmin: number;
}

export interface UserOneForAdminResponse {
  userOneForAdmin: {
    id: string;
    email: string;
    name?: string | null;
    isAdmin?: boolean;
    phoneNumber?: string | null;
    createdAt?: string;
    deletedAt?: string | null;
    onboardingOrigin?: string;
    isSuperLockedEnabled?: boolean;
    bio?: {
      id: string;
    };
  };
}

export interface UpdateUserInputForAdmin {
  email?: string;
  name?: string;
  phoneNumber?: string;
  isAdmin?: boolean;
  [key: string]: any;
}

export interface UpdateUserForAdminResponse {
  updateUserForAdmin: User;
}

export interface RemoveUserForAdminResponse {
  removeUserForAdmin: User;
}

// ==================== Bio Management Types ====================
export interface Bio {
  id: string;
  pageName?: string;
  introMessage?: string;
  perMessageCost?: number;
  theme?: string;
  username?: string | null;
  deletedAt?: string | null;
  imageURL?: string | null;
  createdAt?: string;
  updatedAt?: string;
  verificationStatus?: string;
  allowAgencyBranding?: boolean;
  messages?: number;
  earnings?: number;
  avgResponseTime?: number;
  followerCount?: number;
  profileVisits?: number;
  agencyAccess?: Array<{
    id: string;
    agency?: {
      name?: string;
    };
  }>;
  customSections?: Array<{
    sectionType?: string;
    id?: string;
    isRow?: boolean;
    name?: string;
    order?: number;
    sectionLinks?: Array<{
      id: string;
      name: string;
      imageURL?: string;
      order: number;
      url: string;
      content?: string;
    }>;
  }>;
  socialLinks?: Array<{
    id: string;
    name: string;
    order: number;
    url: string;
  }>;
  customButtons?: Array<{
    id: string;
    name: string;
    order: number;
    url: string;
  }>;
  user?: {
    id: string;
    email?: string;
    phoneNumber?: string;
    isClaimed?: boolean;
  };
}

export interface FindAllBiosForAdminResponse {
  findAllBiosForAdmin: Bio[];
  biosAdminAggregate: number;
}

export interface FindOneBioForAdminResponse {
  findOneBioForAdmin: Bio;
}

export interface CreateBioInput {
  pageName?: string;
  username?: string;
  introMessage?: string;
  perMessageCost?: number;
  theme?: string;
  imageURL?: string;
  [key: string]: any;
}

export interface CreateBioResponse {
  createBio: Bio;
}

export interface UpdateBioInputForAdmin {
  pageName?: string;
  username?: string;
  introMessage?: string;
  perMessageCost?: number;
  theme?: string;
  [key: string]: any;
}

export interface UpdateBioAdminResponse {
  updateBioAdmin: Bio;
}

export interface RemoveBioResponse {
  removeBio: Bio;
}

// ==================== Superlocked Content Types ====================
export interface UsersWithUnlockContentResponse {
  usersWithUnlockContent: any[];
}

// ==================== Price Change Requests Types ====================
export interface PriceChangeRequest {
  approved?: boolean | null;
  id: string;
  price: number;
  createdAt?: string;
  bio?: {
    id: string;
    username?: string;
    pageName?: string;
    perMessageCost?: number;
  };
}

export interface PriceChangeRequestsResponse {
  priceChangeRequests: PriceChangeRequest[];
  listAggregateChangeRequests: number;
}

export interface PriceChangeRequestResponse {
  priceChangeRequest: PriceChangeRequest;
}

export interface UpdatePriceChangeResponse {
  updatePriceChange: PriceChangeRequest;
}

// ==================== Reports Types ====================
export interface Report {
  id: string;
  isBullying?: boolean;
  isSpam?: boolean;
  isHarassment?: boolean;
  isHateSpeech?: boolean;
  isOther?: boolean;
  createdAt?: string;
}

export interface ReportsResponse {
  reports: Report[];
  reportsAggregate: number;
}

export interface ReportResponse {
  report: Report;
}

// ==================== Agency Management Types ====================
export interface Agency {
  id: string;
  name?: string;
  brandColor?: string;
  displayAgencyBranding?: boolean;
  phoneNumber?: string;
  email?: string;
  createdAt?: string;
  deletedAt?: string | null;
  isSubscriptionFree?: boolean;
  totalRevenue?: number;
  website?: string;
  introMessage?: string;
  street?: string;
  city?: string;
  zip?: string;
  state?: string;
  landmark?: string;
  country?: string;
  owner?: {
    id: string;
  };
  subscriptionPlans?: Array<{
    id: string;
    price: number;
    active?: boolean;
  }>;
  subscriptions?: Array<{
    months?: number;
    price?: number;
    discountedPrice?: number;
    endDate?: string;
    expiresAt?: string;
    createdAt?: string;
    status?: string;
    deletedAt?: string | null;
  }>;
}

export interface GetAllAgenciesResponse {
  getAllAgencies: {
    count: number;
    agencies: Agency[];
  };
}

export interface GetAgencyByIdResponse {
  getAgencyById: Agency;
}

export interface CreateSubscriptionPlanDto {
  price: number;
  agencyId?: string;
  [key: string]: any;
}

export interface CreateSubscriptionPlanResponse {
  createSubscriptionPlan: {
    id: string;
    price: number;
    createdAt?: string;
  };
}

export interface UpdateSubscriptionPlanDto {
  id: string;
  price?: number;
  active?: boolean;
  [key: string]: any;
}

export interface UpdateSubscriptionPlanResponse {
  updateSubscriptionPlan: {
    id: string;
  };
}

// ==================== Subscriptions Types ====================
export interface Subscription {
  id: string;
  status?: string;
  price?: number;
  discountedPrice?: number;
  months?: number;
  expiresAt?: string;
  deletedAt?: string | null;
  createdAt?: string;
  endDate?: string;
  agency?: {
    name?: string;
    phoneNumber?: string;
    email?: string;
  };
  subscriptionPlan?: {
    id: string;
    price?: number;
  };
}

export interface GetAllSubscriptionsResponse {
  getAllSubscriptions: {
    count: number;
    subscriptions: Subscription[];
  };
}

export interface GetAgencySubscriptionByIdResponse {
  getAgencySubscriptionById: Subscription;
}

// ==================== Brand Kit Leads Types ====================
export interface BrandLead {
  id: string;
  enquireEmail?: string;
  createdAt?: string;
  deletedAt?: string | null;
  updatedAt?: string;
  creator?: {
    email?: string;
    name?: string;
    phoneNumber?: string;
  };
}

export interface GetAllBrandLeadsResponse {
  getAllBrandLeads: {
    brandLeads: BrandLead[];
    count: number;
  };
}

export interface GetBrandLeadByIdResponse {
  getBrandLeadById: BrandLead;
}

// ==================== Dashboard Insights Types ====================
export interface Insights {
  users?: number;
  creators?: number;
  fans?: number;
  creatorsWithStripe?: number;
  creatorsWithoutStripe?: number;
  earnings?: number;
  messages?: number;
  responseTimeAvg?: number;
  [key: string]: any;
}

export interface InsightsResponse {
  insights: Insights;
}

// ==================== API Response Types ====================
export interface ApiResponse<T> {
  status?: number;
  message?: string;
  data?: T;
  [key: string]: any;
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

// ==================== Filter Types ====================
export interface FilterParams {
  where?: Record<string, any>;
  orderBy?: Record<string, any>;
  withDeleted?: boolean;
}

// ==================== Error Types ====================
export * from './errors';

