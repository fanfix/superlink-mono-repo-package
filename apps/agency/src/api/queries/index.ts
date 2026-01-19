/**
 * GraphQL Queries
 * Centralized GraphQL query strings
 */

// ==================== Dashboard Queries ====================
export const DAILY_AGENCY_VISITS_QUERY = `
  query DailyAgencyVisits($agencyId: String!, $endDate: String!, $startDate: String!) {
    dailyAgencyVisits(agencyId: $agencyId, endDate: $endDate, startDate: $startDate) {
      date
      revenue
      visits
      __typename
    }
  }
`;

export const GET_PROFILE_VISITS_QUERY = `query GetProfileVisits($startDate: String!, $endDate: String!) {
    getProfileVisits(startDate: $startDate, endDate: $endDate) {
      id
      pageName
      profileVisits
      username
      __typename
    }
  }
`;

export const GET_RECENT_ACTIVITIES_QUERY = `query GetRecentActivities($agencyId: String!, $offset: Float, $limit: Float) {
    getRecentActivities(agencyId: $agencyId, offset: $offset, limit: $limit)
  }
`;

export const GET_ANALYTICS_QUERY = `
  query GetAnalytics($agencyId: String!, $creators: [String!]!) {
    getAnalytics(agencyId: $agencyId, creators: $creators) {
      creators
      teams
      revenue
      __typename
    }
  }
`;

// ==================== Creators Queries ====================
export const GET_CREATORS_QUERY = `
  query GetCreators($agencyId: String!, $query: String, $limit: Float, $offset: Float, $teamId: String) {
    getCreators(
      agencyId: $agencyId
      query: $query
      limit: $limit
      offset: $offset
      teamId: $teamId
    ) {
      id
      accepted
      bio {
        id
        followerCount
        user {
          id
          email
          name
          __typename
        }
        pageName
        imageURL
        username
        allowAgencyBranding
        agencyTeamAccess {
          agencyTeam {
            user {
              id
              name
              email
              imageURL
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    creatorsAggregate(agencyId: $agencyId, query: $query, teamId: $teamId)
  }
`;

export const GET_CREATORS_WITH_UNLOCK_CONTENT_QUERY = `
  query getCreatorsWithUnlockContent($agencyId: String!, $query: String, $limit: Float, $offset: Float, $teamId: String) {
    getCreatorsWithUnlockContent(
      agencyId: $agencyId
      query: $query
      limit: $limit
      offset: $offset
      teamId: $teamId
    ) {
      id
      accepted
      bio {
        id
        followerCount
        user {
          id
          __typename
        }
        pageName
        imageURL
        agencyTeamAccess {
          agencyTeam {
            user {
              id
              email
              imageURL
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    creatorsAggregate(agencyId: $agencyId, query: $query, teamId: $teamId)
  }
`;

// ==================== Creator Detail Query ====================
export const GET_CREATOR_QUERY = `query GetCreator($bioId: String!, $teamId: String) {
  getCreator(bioId: $bioId, teamId: $teamId) {
    id
    accepted
    payoutMethod
    bio {
      id
      pageName
      imageURL
      username
      allowAgencyBranding
      socialLinks {
        name
        url
        __typename
      }
      user {
        id
        isClaimed
        __typename
      }
      agencyTeamAccess {
        agencyTeam {
          user {
            id
            name
            email
            imageURL
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}`;

// ==================== Teams Queries ====================
export const CREATE_TEAM_MUTATION = `
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
      email
      __typename
    }
  }
`;

export const GET_TEAM_QUERY = `
  query GetTeam($teamId: String!) {
    getTeam(teamId: $teamId) {
      id
      user {
        id
        name
        email
        imageURL
        __typename
      }
      access {
        id
        bio {
          id
          pageName
          imageURL
          username
          allowAgencyBranding
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export const GET_TEAMS_QUERY = `query GetTeams($agencyId: String!, $query: String, $limit: Float, $offset: Float, $userId: String) {
    getTeams(
      agencyId: $agencyId
      query: $query
      limit: $limit
      offset: $offset
      userId: $userId
    ) {
      id
      name
      user {
        id
        name
        email
        imageURL
      }
      access {
        bio {
          id
          pageName
          imageURL
        }
      }
    }
    teamsAggregate(agencyId: $agencyId, query: $query, userId: $userId)
  }
`;

export const DELETE_TEAM_MUTATION = `
  mutation DeleteTeam($agencyId: String!, $teamId: String!) {
    deleteTeam(agencyId: $agencyId, teamId: $teamId) {
      id
      __typename
    }
  }
`;

export const GRANT_TEAM_ACCESS_MUTATION = `
  mutation GrantTeamAccess($agencyId: String!, $bioIds: [String!]!, $userId: String!) {
    grantTeamAccess(agencyId: $agencyId, bioIds: $bioIds, userId: $userId) {
      id
      __typename
    }
  }
`;

export const REVOKE_TEAM_ACCESS_MUTATION = `
  mutation RevokeTeamAccess($teamId: String!, $bioId: String!) {
    revokeTeamAccess(teamId: $teamId, bioId: $bioId) {
      id
      __typename
    }
  }
`;

// ==================== Agency Creators Mutations ====================
export const CREATE_AGENCY_CREATOR_MUTATION = `
  mutation CreateAgencyCreator($input: CreateBioAndUserInput!) {
    createAgencyCreator(input: $input) {
      id
      __typename
    }
  }
`;

export const REVOKE_AGENCY_ACCESS_MUTATION = `
  mutation RevokeAgencyAccess($agencyId: String!, $bioId: String!) {
    revokeAgencyAccess(agencyId: $agencyId, bioId: $bioId) {
      id
      __typename
    }
  }
`;

// ==================== Profile Mutations ====================
export const UPDATE_AGENCY_USER_MUTATION = `
  mutation UpdateAgencyUser($input: UpdateAgencyUserInput!) {
    updateAgencyUser(input: $input) {
      id
      name
      email
      phoneNumber
      imageURL
      __typename
    }
  }
`;

export const UPDATE_AGENCY_MUTATION = `
  mutation UpdateAgency($input: UpdateAgencyInput!) {
    updateAgency(input: $input) {
      id
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

// ==================== Agency Creators Mutations ====================
// export const CREATE_AGENCY_CREATOR_MUTATION = `
//   mutation CreateAgencyCreator($input: CreateBioAndUserInput!) {
//     createAgencyCreator(input: $input) {
//       id
//       __typename 
//     }
//   }
// `;