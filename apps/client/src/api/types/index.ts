/**
 * API Types and Interfaces for Client App
 * Centralized type definitions for all API responses
 */

// ==================== Error Types ====================
export * from './errors';

// ==================== Auth Types ====================
export interface LoginRequest {
  username: string;
  password: string;
  captchaToken?: string;
}

export interface LoginResponse {
  id: string;
  accessToken: string;
}

// ==================== OTP Login Types ====================
export interface SendOTPRequest {
  phoneNumber: string;
  captchaToken: string;
}

export interface SendOTPResponse {
  message: string;
  statusCode?: number;
}

export interface OTPLoginRequest {
  username: string; // phone number
  password: string; // OTP code
  captchaToken: string;
}

export interface OTPLoginResponse {
  id: string;
  accessToken: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
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

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  id: string;
  __typename?: string;
}

export interface UserState {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  avatar?: string | null;
  imageURL?: string | null;
  username?: string | null;
  bioId?: string | null;
  bio?: Bio | null;
  isAdmin?: boolean;
  dateOfBirth?: string | null;
  isFan?: boolean;
  isCreator?: boolean;
  isClaimed?: boolean;
  utmSource?: string | null;
  leadType?: string;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  onboardingOrigin?: string;
  deletedAt?: string | null;
  updatedAt?: string;
  createdAt?: string;
  isSuperLockedUser?: boolean;
  isSuperLockedEnabled?: boolean;
  isLocationEnabled?: boolean;
  onboarding?: boolean;
}

// ==================== Bio/Profile Types ====================
export interface SocialLink {
  id: string;
  order: number;
  name: string;
  url: string;
  __typename?: string;
}

export interface CustomButton {
  id: string;
  order: number;
  name: string;
  url: string;
  isFavorite: boolean;
  isEmail: boolean;
  __typename?: string;
}

export interface UnlockContent {
  id: string;
  title: string;
  price: number;
  description?: string | null;
  beforeDiscountPrice: number;
  titleColor: string;
  unlockContentOriginalURL: string;
  unlockContentBlurredURL: string;
  contentType: 'image' | 'video';
  order: number;
  cropWidth: number;
  cropHeight: number;
  cropX: number;
  cropY: number;
  countdownStart?: number | null;
  percentDiscount?: number | null;
  editedAt?: string | null;
  icon?: string | null;
  __typename?: string;
}

export interface VideoContent {
  id: string;
  title: string;
  price: number;
  beforeDiscountPrice: number;
  titleColor: string;
  originalVideoUrl: string;
  previewVideoUrl: string;
  cropWidth: number;
  cropHeight: number;
  cropX: number;
  cropY: number;
  __typename?: string;
}

export interface Engagement {
  id: string;
  order: number;
  count: string;
  title: string;
  __typename?: string;
}

export interface KitItem {
  id: string;
  order: number;
  price: number;
  title: string;
  __typename?: string;
}

export interface BrandKit {
  id: string;
  bannerImageURL: string;
  description: string;
  engagements: Engagement[];
  kitItems: KitItem[];
  __typename?: string;
}

export interface SectionLink {
  id: string;
  order: number;
  name: string;
  size?: string | null;
  imageURL: string;
  url: string;
  content: string;
  isEmail: boolean;
  __typename?: string;
}

export interface CustomSection {
  id: string;
  order: number;
  name: string;
  isRow: boolean;
  isEmbed: boolean;
  listMode: 'thumbnail' | 'fullscreen';
  rowMode: 'slider' | 'parallel_row' | 'grid';
  sectionType: 'unlock_content' | 'links' | 'embeds' | 'email' | 'text' | 'brand_kit';
  unlockContentOriginalImageURL?: string | null;
  unlockContentBlurredImageURL?: string | null;
  unlockContentPrice?: number | null;
  unlockContentTitle?: string | null;
  unlockContentTitleColor: string;
  unlockContentBeforeDiscountPrice: number;
  editedAt: string;
  unlockContents: UnlockContent[];
  videoContents: VideoContent[];
  brandKit?: BrandKit | null;
  sectionLinks: SectionLink[];
  __typename?: string;
}

export interface Bio {
  id: string;
  username?: string | null;
  pageName?: string | null;
  pageFont?: string | null;
  imageURL?: string | null;
  bannerImageURL?: string | null;
  introMessage?: string | null;
  perMessageCost?: number | null;
  allowMessaging?: boolean | null;
  allowSMS?: boolean | null;
  allowTipping?: boolean | null;
  allowAgencyBranding?: boolean | null;
  followerCount?: number | null;
  buttonText?: string | null;
  verificationStatus?: string | null;
  theme?: 'light' | 'dark' | 'image' | null;
  backgroundColor?: string | null;
  layoutForAvatarAndBio?: 'vertical' | 'horizontal' | null;
  textColor?: string | null;
  titleColor?: string | null;
  backgroundSecondaryColor?: string | null;
  backgroundImageURL?: string | null;
  backgroundImageOpacity?: number | null;
  backgroundImageBlur?: number | null;
  socialLinks?: SocialLink[];
  customButtons?: CustomButton[];
  customSections?: CustomSection[];
  __typename?: string;
}

export interface AppointmentProfile {
  id: string;
  title: string;
  content: string;
  bannerImageURL: string;
  bufferTimeInMin: number;
  isActive: boolean;
  timeZone: string;
  availableSlots: Array<{
    id: string;
    dayOfWeek: number;
    endTime: string;
    startTime: string;
    __typename?: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    durationInMin: number;
    order: number;
    price: number;
    __typename?: string;
  }>;
  __typename?: string;
}

export interface ConnectedAgency {
  id: string;
  name: string;
  brandColor: string;
  imageURL: string;
  displayAgencyBranding: boolean;
  __typename?: string;
}

export interface CurrentUser {
  id: string;
  name?: string | null;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  isAgency?: boolean | null;
  isSuperLockedEnabled: boolean;
  appointmentProfile?: AppointmentProfile | null;
  connectedAgency?: ConnectedAgency | null;
  bio?: Bio | null;
  __typename?: string;
}

export interface UpdateProfileInput {
  bioId: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  imageURL?: string;
  pageName?: string;
  bio?: string;
  username?: string;
}

export interface UpdateProfileResponse {
  id: string;
  __typename?: string;
}

export interface UpdateBioInput {
  pageName?: string;
  introMessage?: string;
  layoutForAvatarAndBio?: 'vertical' | 'horizontal';
  theme?: 'light' | 'dark' | 'image';
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  backgroundSecondaryColor?: string;
  backgroundImageURL?: string;
  backgroundImageOpacity?: number;
  backgroundImageBlur?: number;
  pageFont?: string;
  perMessageCost?: number;
  allowAgencyBranding?: boolean;
  bannerImageURL?: string;
  imageURL?: string;
  username?: string;
}

export interface UpdateBioResponse {
  createdAt: string;
  id: string;
  imageURL: string;
  introMessage: string;
  pageName: string;
  pageFont: string;
  perMessageCost: number;
  allowAgencyBranding?: boolean | null;
  bannerImageURL: string;
  layoutForAvatarAndBio: 'vertical' | 'horizontal';
  __typename?: string;
}

// ==================== Upload Types ====================
export interface UploadResponse {
  imageURL: string;
  originalImageURL: string;
}

// ==================== Payment Types ====================
export interface StripeConnectResponse {
  connectedAccountId: string | null;
  isAgencyAccount: boolean;
}

export interface StripeConnectStatus {
  name: string | null;
  id: string;
  transferAllowed: boolean;
  last4: string;
  isAgencyStripeAccount: boolean;
  isAgencyConnected: boolean;
  payoutMethod: 'agency_payout' | 'individual_payout';
}

export interface PriceChangeResponse {
  id: string;
  createdAt: string;
  price: number;
  __typename?: string;
}

// ==================== Sendbird Types ====================
export interface ChannelInvitationPreference {
  auto_accept: boolean;
}

export interface SendbirdUserUpdate {
  nickname: string;
  profile_url: string;
}

export interface SendbirdUserResponse {
  user_id: string;
  nickname: string;
  profile_url: string;
  require_auth_for_profile_image: boolean;
  metadata: Record<string, any>;
  access_token: string;
  created_at: number;
  discovery_keys: string[];
  is_hide_me_from_friends: boolean;
  session_tokens: any[];
  is_online: boolean;
  last_seen_at: number;
  is_active: boolean;
  has_ever_logged_in: boolean;
  preferred_languages: string[];
  locale: string;
}

export interface MyGroupChannelsResponse {
  channels: any[];
  next: string;
  ts: number;
}

export interface GroupChannelCountResponse {
  group_channel_count: number;
}

// ==================== Profile Settings Types ====================
export interface DecryptProfileRequest {
  email: string;
  phoneNumber: string;
}

export interface DecryptProfileResponse {
  email: string;
  phoneNumber: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface UpdateUserResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string | null;
  __typename?: string;
}

// ==================== Insights Types ====================
export interface EventAnalytics {
  profile_clicks: number;
  page_visit: number;
  section_link_clicks: number;
  avg_time: number;
}

export interface AllInsightsResponse {
  eventAnalytics: EventAnalytics;
  earnings: number | null;
  messages: string;
  tips: number | null;
}

export interface GraphAnalyticsItem {
  date: string;
  ctr: number;
  visits: number;
  clicks: number;
  avgTime: number;
}

export interface GraphAnalyticsTotal {
  visits: number;
  clicks: number;
  avgTime: number;
  ctr: number;
}

export interface GraphCalendarResponse {
  graphAnalytics: GraphAnalyticsItem[];
  total: GraphAnalyticsTotal;
}

// ==================== Clicks Insights Types ====================
export interface ClickAnalyticsSection {
  name: string;
  id?: string;
}

export interface ClickAnalytics {
  name: string;
  count: number;
  isSocial?: boolean;
  isButton?: boolean;
  section?: ClickAnalyticsSection | null;
  url?: string;
}

// ==================== Revenue Insights Types ====================
export interface RevenueData {
  date: string;
  messages: number;
  tips: number;
  messageBlasts: number;
  paidMessages: number;
}

export interface RevenueTotal {
  messages: number;
  tips: number;
  messageBlasts: number;
  paidMessages: number;
}

export interface RevenueInsightsResponse {
  revenueAnalytics: RevenueData[];
  total: RevenueTotal;
}

// ==================== Messages Types ====================
export interface ChannelEarnings {
  succeeded: number;
  pending: number;
  missed?: number;
  timeRemaining?: number;
}

export interface ChannelsResponse {
  [channelUrl: string]: ChannelEarnings;
  total?: {
    succeeded: number;
    pending: number;
    missed: number;
  };
}

// ==================== Manage Access Types ====================
export interface ManageAccessSearchResponse {
  // Adjust based on actual response structure
  [key: string]: any;
}

export interface Agency {
  id: string;
  name: string;
  email?: string;
  imageURL?: string;
}

export interface AgencyStatus {
  id: string;
  name: string;
  email?: string;
  imageURL?: string;
  accepted: boolean;
}

// ==================== Tipping History Types ====================
export interface TippingHistoryItem {
  amount: number;
  createdAt: string;
  sender: {
    name: string;
  } | null;
}

// ==================== Support Types ====================
export interface ContactSupportInput {
  subject: string;
  message: string;
  email?: string;
  name?: string;
}

export interface ContactSupportResponse {
  success: boolean;
  message: string;
}

// ==================== Content Types ====================
export interface Content {
  id: string;
  title?: string | null;
  description?: string | null;
  imageURL?: string | null;
  videoURL?: string | null;
  price?: number | null;
  discount?: number | null;
  duration?: number | null;
  isLocked?: boolean | null;
  createdAt?: string | null;
  __typename?: string;
}

export interface CreateContentInput {
  bioId: string;
  title: string;
  description?: string;
  imageURL?: string;
  videoURL?: string;
  price?: number;
  discount?: number;
  duration?: number;
}

export interface CreateContentResponse {
  id: string;
  __typename?: string;
}

export interface UpdateContentInput {
  contentId: string;
  title?: string;
  description?: string;
  imageURL?: string;
  videoURL?: string;
  price?: number;
  discount?: number;
  duration?: number;
}

export interface UpdateContentResponse {
  id: string;
  __typename?: string;
}

export interface DeleteContentResponse {
  id: string;
  __typename?: string;
}

// ==================== Insights/Analytics Types ====================
export interface PageVisit {
  date: string;
  visits: number;
  __typename?: string;
}

export interface ContentAnalytics {
  contentId: string;
  title: string;
  views: number;
  purchases: number;
  revenue: number;
  __typename?: string;
}

export interface InsightsData {
  totalVisits: number;
  totalRevenue: number;
  totalPurchases: number;
  pageVisits: PageVisit[];
  contentAnalytics: ContentAnalytics[];
  __typename?: string;
}

// ==================== Messages/Chat Types ====================
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  __typename?: string;
}

export interface Chat {
  id: string;
  userId: string;
  userName?: string | null;
  userAvatar?: string | null;
  lastMessage?: string | null;
  lastMessageTime?: string | null;
  unreadCount?: number;
  __typename?: string;
}

export interface SendMessageInput {
  receiverId: string;
  content: string;
}

export interface SendMessageResponse {
  id: string;
  __typename?: string;
}

// ==================== Settings Types ====================
export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
  __typename?: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  __typename?: string;
}

export interface UpdateSettingsInput {
  bioId: string;
  notifications?: Partial<NotificationSettings>;
  privacy?: Partial<PrivacySettings>;
}

export interface UpdateSettingsResponse {
  id: string;
  __typename?: string;
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

// ==================== Social Links Input Types ====================
export interface CreateSocialLinkInput {
  name: string;
  url: string;
  username?: string;
}

export interface UpdateSocialLinkInput {
  name?: string;
  url?: string;
  username?: string;
}

export interface AddSocialLinkResponse {
  id: string;
  order: number;
  name: string;
  url: string;
  __typename?: string;
}

export interface UpdateSocialLinkResponse {
  id: string;
  order: number;
  name: string;
  url: string;
  __typename?: string;
}

export interface RemoveSocialLinkResponse {
  id: string;
  __typename?: string;
}

// ==================== Custom Button Input Types ====================
export interface CreateCustomButtonInput {
  name: string;
  url: string;
  isEmail?: boolean;
}

export interface UpdateCustomButtonInput {
  name?: string;
  url?: string;
  isEmail?: boolean;
}

export interface AddCustomButtonResponse {
  id: string;
  name: string;
  order: number;
  url: string;
  isEmail: boolean;
  __typename?: string;
}

export interface UpdateCustomButtonResponse {
  id: string;
  order: number;
  name: string;
  url: string;
  isEmail: boolean;
  __typename?: string;
}

export interface UpdateFavoriteCustomButtonResponse {
  id: string;
  order: number;
  name: string;
  url: string;
  isFavorite: boolean;
  __typename?: string;
}

export interface RemoveCustomButtonResponse {
  id: string;
  order: number;
  name: string;
  url: string;
  __typename?: string;
}

// ==================== Exclusive Content Types ====================
export interface UploadExclusiveContentInput {
  file: File;
  price: number;
  fakePrice?: number;
  title: string;
  titleColor: string;
  cropWidth: number;
  cropHeight: number;
  cropX: number;
  cropY: number;
  order?: number;
  icon?: string;
  countdownStart?: number;
  percentDiscount?: number;
  description?: string;
}

export interface UploadExclusiveContentResponse {
  id: string;
  title: string;
  titleColor: string;
  description?: string;
  price: number;
  beforeDiscountPrice: number;
  cropWidth: number;
  cropHeight: number;
  cropX: number;
  cropY: number;
  createdAt: string;
  editedAt: string;
  unlockContentOriginalURL: string;
  unlockContentBlurredURL: string;
  contentType: 'image' | 'video';
  thumbnailUrl?: string | null;
  order: number;
  countdownStart?: number;
  percentDiscount?: number;
  icon?: string;
  section: {
    id: string;
    order: number;
    name: string;
    isRow: boolean;
    listMode: string;
    rowMode: string;
    sectionType: string;
    isEmbed: boolean;
    editedAt: string;
    unlockContentBlurredImageURL?: string | null;
    unlockContentOriginalImageURL?: string | null;
    unlockContentPrice?: number | null;
    unlockContentTitle?: string | null;
    unlockContentTitleColor: string;
    unlockContentBeforeDiscountPrice: string;
    videoContents: any[];
    unlockContents: any[];
  };
}

export interface UpdateExclusiveContentInput {
  file?: File;
  price?: number;
  fakePrice?: number;
  title?: string;
  titleColor?: string;
  description?: string;
  cropWidth?: number;
  cropHeight?: number;
  cropX?: number;
  cropY?: number;
  countdownStart?: number;
  percentDiscount?: number;
  icon?: string;
}

export interface UpdateExclusiveContentResponse {
  message: string;
  content: {
    id: string;
    title: string;
    titleColor: string;
    description: string;
    price: number;
    beforeDiscountPrice: number;
    cropWidth: number;
    cropHeight: number;
    cropX: number;
    cropY: number;
    createdAt: string;
    editedAt: string;
    unlockContentOriginalURL: string;
    unlockContentBlurredURL: string;
    contentType: 'image' | 'video';
    thumbnailUrl?: string | null;
    order: number;
    countdownStart?: number;
    percentDiscount?: number;
    icon?: string;
    section: {
      id: string;
      order: number;
      name: string;
      isRow: boolean;
      listMode: string;
      rowMode: string;
      sectionType: string;
      isEmbed: boolean;
      editedAt: string;
      unlockContentBlurredImageURL?: string | null;
      unlockContentOriginalImageURL?: string | null;
      unlockContentPrice?: number | null;
      unlockContentTitle?: string | null;
      unlockContentTitleColor: string;
      unlockContentBeforeDiscountPrice: string;
    };
  };
}

export interface DeleteExclusiveContentResponse {
  message: string;
}

// ==================== Custom Section Link Input Types ====================
export interface CreateCustomSectionLinkInput {
  name: string;
  url: string;
  imageURL?: string;
  content?: string;
  size?: string;
  isEmail?: boolean;
}

export interface UpdateCustomSectionLinkInput {
  name?: string;
  url?: string;
  imageURL?: string;
  content?: string;
  size?: string;
  isEmail?: boolean;
}

export interface AddCustomSectionLinkResponse {
  id: string;
  order: number;
  name: string;
  imageURL: string;
  content: string;
  url: string;
  size?: string | null;
  isEmail: boolean;
  __typename?: string;
}

export interface UpdateCustomSectionLinkResponse {
  id: string;
  order: number;
  name: string;
  imageURL: string;
  size?: string | null;
  url: string;
  content: string;
  isEmail: boolean;
  __typename?: string;
}

export interface RemoveCustomSectionLinkResponse {
  id: string;
  order: number;
  name: string;
  imageURL: string;
  url: string;
  content: string;
  __typename?: string;
}

// ==================== Custom Section Input Types ====================
export interface CreateCustomSectionInput {
  name: string;
  isRow: boolean;
  isEmbed: boolean;
  listMode: 'thumbnail' | 'fullscreen';
  rowMode: 'slider' | 'grid' | 'parallel_row';
  sectionType: 'unlock_content' | 'links' | 'embeds' | 'email' | 'text' | 'brand_kit';
  section?: {
    name?: string;
    url?: string;
    imageURL?: string;
    isEmail?: boolean;
    content?: string;
  };
}

export interface UpdateCustomSectionInput {
  name?: string;
  isRow?: boolean;
  isEmbed?: boolean;
  listMode?: 'thumbnail' | 'fullscreen';
  rowMode?: 'slider' | 'grid' | 'parallel_row';
}

export interface AddCustomSectionResponse {
  id: string;
  order: number;
  name: string;
  isEmbed: boolean;
  isRow: boolean;
  listMode: string;
  rowMode: string;
  sectionType: string;
  sectionLinks: SectionLink[];
  __typename?: string;
}

export interface UpdateCustomSectionResponse {
  id: string;
  order: number;
  name: string;
  isRow: boolean;
  listMode: string;
  rowMode: string;
  sectionType: string;
  __typename?: string;
}

export interface RemoveCustomSectionResponse {
  id: string;
  order: number;
  name: string;
  isRow: boolean;
  __typename?: string;
}

// ==================== Brand Kit Input Types ====================
export interface CreateEngagementDto {
  title: string;
  count: string;
}

export interface UpdateEngagementDto {
  title?: string;
  count?: string;
}

export interface CreateEngagementResponse {
  id: string;
  order: number;
  title: string;
  count: string;
  __typename?: string;
}

export interface UpdateEngagementResponse {
  id: string;
  order: number;
  title: string;
  count: string;
  __typename?: string;
}

export interface DeleteEngagementResponse {
  id: string;
  __typename?: string;
}

export interface CreateKitItemsDto {
  title: string;
  price: number;
}

export interface UpdateKitItemsDto {
  title?: string;
  price?: number;
}

export interface CreateBrandKitItemResponse {
  id: string;
  order: number;
  price: number;
  title: string;
  __typename?: string;
}

export interface UpdateBrandKitItemResponse {
  id: string;
  order: number;
  title: string;
  price: number;
  __typename?: string;
}

export interface DeleteBrandKitItemResponse {
  id: string;
  __typename?: string;
}

// ==================== Brand Kit DTOs and Responses ====================
export interface CreateBrandKitDto {
  customSectionId: string;
  bannerImageURL?: string;
  description?: string;
}

export interface UpdateBrandKitDto {
  bannerImageURL?: string;
  description?: string;
}

export interface CreateBrandKitResponse {
  id: string;
  bannerImageURL?: string;
  description?: string;
  __typename?: string;
}

export interface UpdateBrandKitResponse {
  id: string;
  description?: string;
  bannerImageURL?: string;
  __typename?: string;
}

export interface DeleteBrandKitResponse {
  id: string;
  __typename?: string;
}

