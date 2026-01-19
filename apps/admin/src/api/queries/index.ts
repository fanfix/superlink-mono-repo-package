/**
 * GraphQL Queries for Admin Panel
 * Centralized GraphQL query strings based on admin API documentation
 */

// ==================== Users Management Queries ====================
export const USERS_FOR_ADMIN_QUERY = `
  query UsersForAdmin(
    $limit: Float
    $offset: Float
    $withDeleted: Boolean
    $where: JSON
    $orderBy: JSON
  ) {
    usersForAdmin(
      limit: $limit
      offset: $offset
      withDeleted: $withDeleted
      where: $where
      orderBy: $orderBy
    ) {
      phoneNumber
      name
      email
      id
      isAdmin
      createdAt
      deletedAt
      profileVisits
      onboardingOrigin
      totalRevenue
    }
    usersAggregateForAdmin(withDeleted: $withDeleted, where: $where)
  }
`;

export const USER_ONE_FOR_ADMIN_QUERY = `
  query userOneForAdmin($id: String!, $withDeleted: Boolean) {
    userOneForAdmin(id: $id, withDeleted: $withDeleted) {
      id
      email
      name
      isAdmin
      phoneNumber
      createdAt
      deletedAt
      onboardingOrigin
      isSuperLockedEnabled
      bio {
        id
      }
    }
  }
`;

export const UPDATE_USER_FOR_ADMIN_MUTATION = `
  mutation UpdateUserForAdmin(
    $userId: String!
    $updateUserInput: UpdateUserInputForAdmin!
  ) {
    updateUserForAdmin(
      userId: $userId
      updateUserInput: $updateUserInput
    ) {
      email
      id
      isAdmin
      name
      phoneNumber
      createdAt
      deletedAt
    }
  }
`;

export const REMOVE_USER_FOR_ADMIN_MUTATION = `
  mutation RemoveUserForAdmin($userId: String!) {
    removeUserForAdmin(userId: $userId) {
      email
      id
      isAdmin
      name
      phoneNumber
      createdAt
      deletedAt
    }
  }
`;

// ==================== Bios Management Queries ====================
export const FIND_ALL_BIOS_FOR_ADMIN_QUERY = `
  query FindAllBiosForAdmin(
    $limit: Float
    $offset: Float
    $withDeleted: Boolean
    $where: JSON
    $orderBy: JSON
  ) {
    findAllBiosForAdmin(
      limit: $limit
      offset: $offset
      withDeleted: $withDeleted
      where: $where
      orderBy: $orderBy
    ) {
      id
      pageName
      introMessage
      perMessageCost
      theme
      username
      deletedAt
      imageURL
      createdAt
      updatedAt
      verificationStatus
      allowAgencyBranding
      agencyAccess {
        id
        agency {
          name
        }
      }
      customSections {
        sectionType
      }
      profileVisits
    }
    biosAdminAggregate(withDeleted: $withDeleted, where: $where)
  }
`;

export const FIND_ONE_BIO_FOR_ADMIN_QUERY = `
  query FindOneBioForAdmin($bioId: String!, $withDeleted: Boolean) {
    findOneBioForAdmin(bioId: $bioId, withDeleted: $withDeleted) {
      id
      pageName
      introMessage
      messages
      perMessageCost
      verificationStatus
      theme
      username
      earnings
      deletedAt
      imageURL
      createdAt
      avgResponseTime
      followerCount
      socialLinks {
        id
        name
        order
        url
      }
      user {
        id
        email
        phoneNumber
        isClaimed
      }
      customButtons {
        id
        name
        order
        url
      }
      customSections {
        id
        isRow
        name
        order
        sectionType
        sectionLinks {
          id
          name
          imageURL
          order
          url
          content
        }
      }
    }
  }
`;

export const CREATE_BIO_MUTATION = `
  mutation CreateBio($createBioInput: CreateBioInput!) {
    createBio(createBioInput: $createBioInput) {
      id
      imageURL
      introMessage
      messages
      pageName
      perMessageCost
      socialLinks {
        id
        order
        name
        url
      }
      theme
      username
      deletedAt
      earnings
      customSections {
        id
        order
        name
        isRow
        sectionLinks {
          id
          order
          name
          imageURL
          url
        }
      }
      customButtons {
        id
        order
        name
        url
      }
      createdAt
      allowMessaging
    }
  }
`;

export const UPDATE_BIO_ADMIN_MUTATION = `
  mutation UpdateBioAdmin(
    $bioId: String!
    $updateBioInput: UpdateBioInputForAdmin!
  ) {
    updateBioAdmin(bioId: $bioId, updateBioInput: $updateBioInput) {
      id
      username
      pageName
      theme
      introMessage
      perMessageCost
      deletedAt
    }
  }
`;

export const REMOVE_BIO_MUTATION = `
  mutation RemoveBio($bioId: String!) {
    removeBio(bioId: $bioId) {
      id
      username
      pageName
      theme
      introMessage
      perMessageCost
      deletedAt
    }
  }
`;

// ==================== Superlocked Content Queries ====================
export const GET_USERS_WITH_UNLOCK_CONTENT_QUERY = `
  query GetUsersWithUnlockContent(
    $limit: Int!
    $offset: Int!
    $agencyId: String
  ) {
    usersWithUnlockContent(
      limit: $limit
      offset: $offset
      agencyId: $agencyId
    )
  }
`;

// ==================== Price Change Requests Queries ====================
export const PRICE_CHANGE_REQUESTS_QUERY = `
  query PriceChangeRequests(
    $limit: Float
    $offset: Float
    $where: JSON
    $orderBy: JSON
    $withDeleted: Boolean
  ) {
    priceChangeRequests(
      limit: $limit
      offset: $offset
      where: $where
      orderBy: $orderBy
      withDeleted: $withDeleted
    ) {
      approved
      id
      price
      createdAt
      bio {
        id
        username
        pageName
        perMessageCost
      }
    }
    listAggregateChangeRequests(
      limit: $limit
      offset: $offset
      where: $where
      orderBy: $orderBy
      withDeleted: $withDeleted
    )
  }
`;

export const PRICE_CHANGE_REQUEST_QUERY = `
  query PriceChangeRequest($reqId: String!, $withDeleted: Boolean) {
    priceChangeRequest(reqId: $reqId, withDeleted: $withDeleted) {
      approved
      createdAt
      id
      price
      bio {
        id
        pageName
        username
        perMessageCost
      }
    }
  }
`;

export const UPDATE_PRICE_CHANGE_MUTATION = `
  mutation UpdatePriceChange($reqId: String!, $approved: Boolean!) {
    updatePriceChange(reqId: $reqId, approved: $approved) {
      approved
      createdAt
      id
      price
    }
  }
`;

// ==================== Reports Queries ====================
export const REPORTS_QUERY = `
  query Reports(
    $limit: Float
    $offset: Float
    $where: JSON
    $orderBy: JSON
    $withDeleted: Boolean
  ) {
    reports(
      limit: $limit
      offset: $offset
      where: $where
      orderBy: $orderBy
      withDeleted: $withDeleted
    ) {
      id
      isBullying
      isSpam
      isHarassment
      isHateSpeech
      isOther
      createdAt
    }
    reportsAggregate(where: $where, withDeleted: $withDeleted)
  }
`;

export const REPORT_QUERY = `
  query Report($reportId: String!, $withDeleted: Boolean) {
    report(id: $reportId, withDeleted: $withDeleted) {
      id
      isBullying
      isSpam
      isHarassment
      isHateSpeech
      isOther
      createdAt
    }
  }
`;

// ==================== Agency Management Queries ====================
export const GET_ALL_AGENCIES_QUERY = `
  query GetAllAgencies(
    $limit: Float
    $offset: Float
    $withDeleted: Boolean
    $where: JSON
    $orderBy: JSON
  ) {
    getAllAgencies(
      limit: $limit
      offset: $offset
      withDeleted: $withDeleted
      where: $where
      orderBy: $orderBy
    ) {
      count
      agencies {
        id
        name
        brandColor
        displayAgencyBranding
        phoneNumber
        email
        createdAt
        deletedAt
        isSubscriptionFree
        totalRevenue
      }
    }
  }
`;

export const GET_AGENCY_BY_ID_QUERY = `
  query getAgencyById($agencyId: String!) {
    getAgencyById(agencyId: $agencyId) {
      id
      email
      name
      createdAt
      deletedAt
      phoneNumber
      brandColor
      introMessage
      website
      street
      city
      zip
      state
      owner {
        id
      }
      landmark
      country
      displayAgencyBranding
      subscriptionPlans {
        id
        price
        active
      }
      subscriptions {
        months
        price
        discountedPrice
        endDate
        expiresAt
        createdAt
        status
        deletedAt
      }
    }
  }
`;

export const CREATE_SUBSCRIPTION_PLAN_MUTATION = `
  mutation CreateSubscriptionPlan(
    $createSubscriptionPlanDto: CreateSubscriptionPlanDto!
  ) {
    createSubscriptionPlan(
      createSubscriptionPlanDto: $createSubscriptionPlanDto
    ) {
      id
      price
      createdAt
    }
  }
`;

export const UPDATE_SUBSCRIPTION_PLAN_MUTATION = `
  mutation UpdateSubscriptionPlan(
    $updatePlanDto: UpdateSubscriptionPlanDto!
  ) {
    updateSubscriptionPlan(updatePlanDto: $updatePlanDto) {
      id
    }
  }
`;

// ==================== Subscriptions Queries ====================
export const GET_ALL_SUBSCRIPTIONS_QUERY = `
  query GetAllSubscriptions(
    $limit: Float
    $offset: Float
    $where: JSON
    $status: String
    $orderBy: JSON
  ) {
    getAllSubscriptions(
      limit: $limit
      offset: $offset
      where: $where
      status: $status
      orderBy: $orderBy
    ) {
      count
      subscriptions {
        id
        status
        price
        discountedPrice
        months
        expiresAt
        deletedAt
        createdAt
        agency {
          name
          phoneNumber
          email
        }
      }
    }
  }
`;

export const GET_AGENCY_SUBSCRIPTION_BY_ID_QUERY = `
  query GetAgencySubscriptionById($subscriptionId: String!) {
    getAgencySubscriptionById(subscriptionId: $subscriptionId) {
      id
      status
      price
      months
      expiresAt
      endDate
      createdAt
      discountedPrice
      deletedAt
      agency {
        name
        email
      }
      subscriptionPlan {
        id
        price
      }
    }
  }
`;

// ==================== Brand Kit Leads Queries ====================
export const GET_ALL_BRAND_LEADS_QUERY = `
  query GetAllBrandLeads(
    $limit: Float
    $offset: Float
    $orderBy: JSON
    $where: JSON
  ) {
    getAllBrandLeads(
      limit: $limit
      offset: $offset
      orderBy: $orderBy
      where: $where
    ) {
      brandLeads {
        id
        enquireEmail
        createdAt
        deletedAt
        creator {
          email
          name
        }
      }
      count
    }
  }
`;

export const GET_BRAND_LEAD_BY_ID_QUERY = `
  query GetBrandLeadById($brandLeadId: String!) {
    getBrandLeadById(brandLeadId: $brandLeadId) {
      createdAt
      updatedAt
      deletedAt
      id
      enquireEmail
      creator {
        name
        email
        phoneNumber
      }
    }
  }
`;

// ==================== Dashboard Insights Query ====================
export const INSIGHTS_QUERY = `
  query Insights {
    insights
  }
`;

