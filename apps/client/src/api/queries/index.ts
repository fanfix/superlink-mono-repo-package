/**
 * GraphQL Queries and Mutations for Client App
 * Centralized GraphQL query/mutation strings
 * 
 * Note: Add your actual queries/mutations here as you implement endpoints
 */

// ==================== Auth Queries ====================
export const GET_USER_STATE_QUERY = `
  query GetUserState {
    getUserState {
      id
      email
      name
      phone
      phoneNumber
      imageURL
      username
      bioId
      bio {
        id
        username
        pageName
        imageURL
        bio
        followerCount
        allowAgencyBranding
        socialLinks {
          id
          name
          url
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const CURRENT_USER_QUERY = `
  fragment Bios on BiosEntity {
    id
    username
    pageName
    pageFont
    imageURL
    bannerImageURL
    introMessage
    perMessageCost
    allowMessaging
    allowSMS
    allowTipping
    allowAgencyBranding
    followerCount
    buttonText
    verificationStatus
    theme
    backgroundColor
    layoutForAvatarAndBio
    textColor
    titleColor
    backgroundSecondaryColor
    backgroundImageURL
    backgroundImageOpacity
    backgroundImageBlur
    socialLinks {
      id
      order
      name
      url
      __typename
    }
    customButtons {
      id
      order
      name
      url
      isFavorite
      isEmail
      __typename
    }
    customSections {
      id
      order
      name
      isRow
      isEmbed
      listMode
      rowMode
      sectionType
      unlockContentOriginalImageURL
      unlockContentBlurredImageURL
      unlockContentPrice
      unlockContentTitle
      unlockContentTitleColor
      unlockContentBeforeDiscountPrice
      editedAt
      unlockContents {
        id
        title
        price
        description
        beforeDiscountPrice
        titleColor
        unlockContentOriginalURL
        unlockContentBlurredURL
        contentType
        order
        cropWidth
        cropHeight
        cropX
        cropY
        countdownStart
        percentDiscount
        editedAt
        icon
        __typename
      }
      videoContents {
        id
        title
        price
        beforeDiscountPrice
        titleColor
        originalVideoUrl
        previewVideoUrl
        cropWidth
        cropHeight
        cropX
        cropY
        __typename
      }
      brandKit {
        id
        bannerImageURL
        description
        engagements {
          id
          count
          title
          __typename
        }
        kitItems {
          id
          price
          title
          __typename
        }
        __typename
      }
      sectionLinks {
        id
        order
        name
        size
        imageURL
        url
        content
        isEmail
        __typename
      }
      __typename
    }
    __typename
  }

  query CurrentUser {
    currentUser {
      id
      name
      email
      phoneNumber
      dateOfBirth
      isAgency
      isSuperLockedEnabled
      appointmentProfile {
        id
        title
        content
        bannerImageURL
        bufferTimeInMin
        isActive
        timeZone
        availableSlots {
          id
          dayOfWeek
          endTime
          startTime
          __typename
        }
        events {
          id
          title
          durationInMin
          order
          price
          __typename
        }
        __typename
      }
      connectedAgency {
        id
        name
        brandColor
        imageURL
        displayAgencyBranding
        __typename
      }
      bio {
        ...Bios
        __typename
      }
      __typename
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = `
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      id
      __typename
    }
  }
`;

// ==================== Public User by Username (for public profile page) ====================
export const USER_QUERY = `
  fragment BiosPublic on BiosEntity {
    id
    username
    pageName
    pageFont
    imageURL
    bannerImageURL
    introMessage
    perMessageCost
    allowMessaging
    allowSMS
    allowTipping
    allowAgencyBranding
    followerCount
    buttonText
    verificationStatus
    theme
    backgroundColor
    layoutForAvatarAndBio
    textColor
    titleColor
    backgroundSecondaryColor
    backgroundImageURL
    backgroundImageOpacity
    backgroundImageBlur
    socialLinks {
      id
      order
      name
      url
      __typename
    }
    customButtons {
      id
      order
      name
      url
      isFavorite
      isEmail
      __typename
    }
    customSections {
      id
      order
      name
      isRow
      isEmbed
      listMode
      rowMode
      sectionType
      unlockContentOriginalImageURL
      unlockContentBlurredImageURL
      unlockContentPrice
      unlockContentTitle
      unlockContentTitleColor
      unlockContentBeforeDiscountPrice
      editedAt
      unlockContents {
        id
        title
        price
        description
        beforeDiscountPrice
        titleColor
        unlockContentOriginalURL
        unlockContentBlurredURL
        contentType
        order
        cropWidth
        cropHeight
        cropX
        cropY
        countdownStart
        percentDiscount
        editedAt
        icon
        __typename
      }
      videoContents {
        id
        title
        price
        beforeDiscountPrice
        titleColor
        originalVideoUrl
        previewVideoUrl
        cropWidth
        cropHeight
        cropX
        cropY
        __typename
      }
      brandKit {
        id
        bannerImageURL
        description
        engagements {
          id
          count
          title
          __typename
        }
        kitItems {
          id
          price
          title
          __typename
        }
        __typename
      }
      sectionLinks {
        id
        order
        name
        size
        imageURL
        url
        content
        isEmail
        __typename
      }
      __typename
    }
    __typename
  }

  query User($usernameOrId: String!) {
    user(usernameOrId: $usernameOrId) {
      id
      name
      isSuperLockedEnabled
      bio {
        ...BiosPublic
        __typename
      }
      connectedAgency {
        id
        brandColor
        name
        imageURL
        displayAgencyBranding
        __typename
      }
      __typename
    }
  }
`;

// ==================== Profile Queries ====================
export const GET_PROFILE_QUERY = `
  query GetProfile($username: String!) {
    getProfile(username: $username) {
      id
      username
      pageName
      imageURL
      bio
      followerCount
      socialLinks {
        id
        name
        url
        __typename
      }
      __typename
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      __typename
    }
  }
`;

export const UPDATE_BIO_MUTATION = `
  mutation UpdateBio($bioId: String!, $updateBioInput: UpdateBioInput!) {
    updateBio(bioId: $bioId, updateBioInput: $updateBioInput) {
      createdAt
      id
      imageURL
      introMessage
      pageName
      pageFont
      perMessageCost
      allowAgencyBranding
      bannerImageURL
      layoutForAvatarAndBio
      username
      __typename
    }
  }
`;

// ==================== Monetization Mutations ====================
export const PRICE_CHANGE_MUTATION = `
  mutation PriceChange($price: Float!) {
    priceChange(price: $price) {
      id
      createdAt
      price
      __typename
    }
  }
`;

export const ADD_SOCIAL_LINK_MUTATION = `
  mutation AddSocialLink($createSocialLinkInput: CreateSocialLinkInput!) {
    addSocialLink(createSocialLinkInput: $createSocialLinkInput) {
      id
      order
      name
      url
      __typename
    }
  }
`;

export const UPDATE_SOCIAL_LINK_MUTATION = `
  mutation UpdateSocialLink($socialLinkId: String!, $updateSocialLinkInput: UpdateSocialLinkInput!) {
    updateSocialLink(
      socialLinkId: $socialLinkId
      updateSocialLinkInput: $updateSocialLinkInput
    ) {
      id
      order
      name
      url
      __typename
    }
  }
`;

export const REMOVE_SOCIAL_LINK_MUTATION = `
  mutation RemoveSocialLink($socialLinkId: String!) {
    removeSocialLink(socialLinkId: $socialLinkId) {
      id
      __typename
    }
  }
`;

export const DELETE_SOCIAL_LINK_MUTATION = `
  mutation DeleteSocialLink($socialLinkId: String!) {
    deleteSocialLink(socialLinkId: $socialLinkId) {
      id
      __typename
    }
  }
`;

// ==================== Content Queries ====================
export const GET_CONTENT_LIST_QUERY = `
  query GetContentList($bioId: String!, $limit: Float, $offset: Float) {
    getContentList(bioId: $bioId, limit: $limit, offset: $offset) {
      id
      title
      description
      imageURL
      videoURL
      price
      discount
      duration
      isLocked
      createdAt
      __typename
    }
  }
`;

export const GET_CONTENT_DETAIL_QUERY = `
  query GetContentDetail($contentId: String!) {
    getContentDetail(contentId: $contentId) {
      id
      title
      description
      imageURL
      videoURL
      price
      discount
      duration
      isLocked
      createdAt
      __typename
    }
  }
`;

export const CREATE_CONTENT_MUTATION = `
  mutation CreateContent($input: CreateContentInput!) {
    createContent(input: $input) {
      id
      __typename
    }
  }
`;

export const UPDATE_CONTENT_MUTATION = `
  mutation UpdateContent($input: UpdateContentInput!) {
    updateContent(input: $input) {
      id
      __typename
    }
  }
`;

export const DELETE_CONTENT_MUTATION = `
  mutation DeleteContent($contentId: String!) {
    deleteContent(contentId: $contentId) {
      id
      __typename
    }
  }
`;

// ==================== Insights Queries ====================
export const GET_INSIGHTS_QUERY = `
  query GetInsights($bioId: String!, $startDate: String!, $endDate: String!) {
    getInsights(bioId: $bioId, startDate: $startDate, endDate: $endDate) {
      totalVisits
      totalRevenue
      totalPurchases
      pageVisits {
        date
        visits
        __typename
      }
      contentAnalytics {
        contentId
        title
        views
        purchases
        revenue
        __typename
      }
      __typename
    }
  }
`;

export const GET_PAGE_VISITS_QUERY = `
  query GetPageVisits($bioId: String!, $startDate: String!, $endDate: String!) {
    getPageVisits(bioId: $bioId, startDate: $startDate, endDate: $endDate) {
      date
      visits
      __typename
    }
  }
`;

// ==================== Messages Queries ====================
export const GET_CHANNELS_QUERY = `
  query GetChannels($userId: String!) {
    channels(userId: $userId)
  }
`;

export const GET_CONTENT_ANALYTICS_QUERY = `
  query GetContentAnalytics($bioId: String!, $startDate: String!, $endDate: String!) {
    getContentAnalytics(bioId: $bioId, startDate: $startDate, endDate: $endDate) {
      contentId
      title
      views
      purchases
      revenue
      __typename
    }
  }
`;

// ==================== Messages Queries ====================
export const GET_CHATS_QUERY = `
  query GetChats($bioId: String!, $limit: Float, $offset: Float) {
    getChats(bioId: $bioId, limit: $limit, offset: $offset) {
      id
      userId
      userName
      userAvatar
      lastMessage
      lastMessageTime
      unreadCount
      __typename
    }
  }
`;

export const GET_MESSAGES_QUERY = `
  query GetMessages($chatId: String!, $limit: Float, $offset: Float) {
    getMessages(chatId: $chatId, limit: $limit, offset: $offset) {
      id
      senderId
      receiverId
      content
      timestamp
      isRead
      __typename
    }
  }
`;

export const SEND_MESSAGE_MUTATION = `
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      __typename
    }
  }
`;

export const MARK_MESSAGE_READ_MUTATION = `
  mutation MarkMessageRead($messageId: String!) {
    markMessageRead(messageId: $messageId) {
      id
      __typename
    }
  }
`;

// ==================== Settings Queries ====================
export const GET_SETTINGS_QUERY = `
  query GetSettings($bioId: String!) {
    getSettings(bioId: $bioId) {
      notifications {
        emailNotifications
        pushNotifications
        messageNotifications
        __typename
      }
      privacy {
        profileVisibility
        showEmail
        showPhone
        __typename
      }
      __typename
    }
  }
`;

export const UPDATE_SETTINGS_MUTATION = `
  mutation UpdateSettings($input: UpdateSettingsInput!) {
    updateSettings(input: $input) {
      id
      __typename
    }
  }
`;

// ==================== Custom Button Mutations ====================
export const ADD_CUSTOM_BUTTON_MUTATION = `
  mutation AddCustomButton($createCustomButtonInput: CreateCustomButtonInput!) {
    addCustomButton(createCustomButtonInput: $createCustomButtonInput) {
      id
      name
      order
      url
      isEmail
      __typename
    }
  }
`;

export const UPDATE_CUSTOM_BUTTON_MUTATION = `
  mutation UpdateCustomButton($customButtonId: String!, $updateCustomButtonInput: UpdateCustomButtonInput!) {
    updateCustomButton(
      customButtonId: $customButtonId
      updateCustomButtonInput: $updateCustomButtonInput
    ) {
      id
      order
      name
      url
      isEmail
      __typename
    }
  }
`;

export const UPDATE_FAVORITE_CUSTOM_BUTTON_MUTATION = `
  mutation UpdateFavoriteCustomButton($customButtonId: String!) {
    updateFavoriteCustomButton(customButtonId: $customButtonId) {
      id
      order
      name
      url
      isFavorite
      __typename
    }
  }
`;

export const REMOVE_CUSTOM_BUTTON_MUTATION = `
  mutation RemoveCustomButton($customButtonId: String!) {
    removeCustomButton(customButtonId: $customButtonId) {
      id
      order
      name
      url
      __typename
    }
  }
`;

// ==================== Custom Section Mutations ====================
export const ADD_CUSTOM_SECTION_MUTATION = `
  mutation AddCustomSection($createCustomSectionInput: CreateCustomSectionInput!) {
    addCustomSection(createCustomSectionInput: $createCustomSectionInput) {
      id
      order
      name
      isEmbed
      isRow
      listMode
      rowMode
      sectionType
      sectionLinks {
        id
        order
        name
        size
        imageURL
        url
        isEmail
        content
        __typename
      }
      __typename
    }
  }
`;

export const UPDATE_CUSTOM_SECTION_MUTATION = `
  mutation UpdateCustomSection($customSectionId: String!, $updateCustomSectionInput: UpdateCustomSectionInput!) {
    updateCustomSection(
      customSectionId: $customSectionId
      updateCustomSectionInput: $updateCustomSectionInput
    ) {
      id
      order
      name
      isRow
      listMode
      rowMode
      sectionType
      __typename
    }
  }
`;

export const REMOVE_CUSTOM_SECTION_MUTATION = `
  mutation RemoveCustomSection($customSectionId: String!) {
    removeCustomSection(customSectionId: $customSectionId) {
      id
      order
      name
      isRow
      __typename
    }
  }
`;

// ==================== Custom Section Link Mutations ====================
export const ADD_CUSTOM_SECTION_LINK_MUTATION = `
  mutation AddCustomSectionLink($customSectionId: String!, $createCustomSectionLinkInput: CreateCustomSectionLinkInput!) {
    addCustomSectionLink(
      customSectionId: $customSectionId
      createCustomSectionLinkInput: $createCustomSectionLinkInput
    ) {
      id
      order
      name
      imageURL
      content
      url
      size
      isEmail
      __typename
    }
  }
`;

export const UPDATE_CUSTOM_SECTION_LINK_MUTATION = `
  mutation UpdateCustomSectionLink($customSectionLinkId: String!, $updateCustomSectionLinkInput: UpdateCustomSectionLinkInput!) {
    updateCustomSectionLink(
      customSectionLinkId: $customSectionLinkId
      updateCustomSectionLinkInput: $updateCustomSectionLinkInput
    ) {
      id
      order
      name
      imageURL
      size
      url
      content
      isEmail
      __typename
    }
  }
`;

export const REMOVE_CUSTOM_SECTION_LINK_MUTATION = `
  mutation RemoveCustomSectionLink($customSectionLinkId: String!) {
    removeCustomSectionLink(customSectionLinkId: $customSectionLinkId) {
      id
      order
      name
      imageURL
      url
      content
      __typename
    }
  }
`;

// ==================== Brand Kit Mutations ====================
export const CREATE_BRAND_KIT_MUTATION = `
  mutation CreateBrandKit($createBrandKitDto: CreateBrandKitDto!) {
    createBrandKit(createBrandKitDto: $createBrandKitDto) {
      id
      bannerImageURL
      description
      __typename
    }
  }
`;

export const UPDATE_BRAND_KIT_MUTATION = `
  mutation UpdateBrandKit($brandKitId: String!, $updateBrandKitDto: UpdateBrandKitDto!) {
    updateBrandKit(brandKitId: $brandKitId, updateBrandKitDto: $updateBrandKitDto) {
      id
      description
      bannerImageURL
      __typename
    }
  }
`;

export const DELETE_BRAND_KIT_MUTATION = `
  mutation DeleteBrandKit($brandKitId: String!) {
    deleteBrandKit(brandKitId: $brandKitId) {
      id
      __typename
    }
  }
`;

export const CREATE_ENGAGEMENT_MUTATION = `
  mutation CreateEngagement($brandKitId: String!, $createEngagementDto: CreateEngagementDto!) {
    createEngagement(
      brandKitId: $brandKitId
      createEngagementDto: $createEngagementDto
    ) {
      id
      order
      title
      count
      __typename
    }
  }
`;

export const UPDATE_ENGAGEMENT_MUTATION = `
  mutation UpdateEngagement($engagementId: String!, $updateEngagementDto: UpdateEngagementDto!) {
    updateEngagement(
      engagementId: $engagementId
      updateEngagementDto: $updateEngagementDto
    ) {
      id
      order
      title
      count
      __typename
    }
  }
`;

export const DELETE_ENGAGEMENT_MUTATION = `
  mutation DeleteEngagement($engagementId: String!) {
    deleteEngagement(engagementId: $engagementId) {
      id
      __typename
    }
  }
`;

export const CREATE_BRAND_KIT_ITEM_MUTATION = `
  mutation CreateBrandKitItem($brandKitId: String!, $createKitItemsDto: CreateKitItemsDto!) {
    createBrandKitItem(
      brandKitId: $brandKitId
      createKitItemsDto: $createKitItemsDto
    ) {
      id
      order
      price
      title
      __typename
    }
  }
`;

export const UPDATE_BRAND_KIT_ITEM_MUTATION = `
  mutation UpdateBrandKitItem($brandKitItemId: String!, $updateKitItemsDto: UpdateKitItemsDto!) {
    updateBrandKitItem(
      brandKitItemId: $brandKitItemId
      updateKitItemsDto: $updateKitItemsDto
    ) {
      id
      order
      title
      price
      __typename
    }
  }
`;

export const DELETE_BRAND_KIT_ITEM_MUTATION = `
  mutation DeleteBrandKitItem($brandKitItemId: String!) {
    deleteBrandKitItem(brandKitItemId: $brandKitItemId) {
      id
      __typename
    }
  }
`;

// ==================== User Profile Mutations ====================
export const UPDATE_USER_MUTATION = `
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      name
      email
      phoneNumber
      dateOfBirth
      __typename
    }
  }
`;

// ==================== Onboarding Queries/Mutations ====================
export const CHECK_IF_PHONE_AND_EMAIL_EXISTS_QUERY = `
  query Query($email: String!, $phone: String!) {
    checkIfPhoneAndEmailExists(email: $email, phone: $phone)
  }
`;

export const ONBOARD_USER_MUTATION = `
  mutation OnboardUser($onboardUserInput: OnboardUserInput!) {
    onboardUser(onboardUserInput: $onboardUserInput) {
      id
      __typename
    }
  }
`;

