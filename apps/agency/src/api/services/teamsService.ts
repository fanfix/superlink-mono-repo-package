/**
 * Teams Service
 * Handles all teams-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  CREATE_TEAM_MUTATION,
  GET_TEAM_QUERY,
  GET_TEAMS_QUERY,
  DELETE_TEAM_MUTATION,
  GRANT_TEAM_ACCESS_MUTATION,
  REVOKE_TEAM_ACCESS_MUTATION,
} from '../queries';
import { Team } from '../types';

/**
 * Get Teams
 */
export interface GetTeamsParams {
  agencyId: string;
  query?: string;
  limit?: number;
  offset?: number;
  userId?: string;
}

export interface GetTeamsResponse {
  getTeams: Team[];
  teamsAggregate: number;
}

export const getTeams = async (params: GetTeamsParams): Promise<GetTeamsResponse> => {
  try {
    console.log('getTeams: Calling API with params:', params);
    
    const response = await executeGraphQL<GetTeamsResponse>({
      operationName: 'GetTeams',
      query: GET_TEAMS_QUERY,
      variables: params,
    });

    console.log('getTeams: API response:', {
      response,
      hasData: !!response.data,
      hasGetTeams: !!response.data?.getTeams,
      teamsCount: response.data?.getTeams?.length || 0,
      teamsAggregate: response.data?.teamsAggregate,
    });

    // GraphQL response structure: { data: { getTeams: [...], teamsAggregate: number } }
    // executeGraphQL returns response.data, so we get: { getTeams: [...], teamsAggregate: number }
    if (response.data) {
      return response.data;
    }

    console.error('getTeams: ❌ Unexpected response structure', {
      response,
    });

    return {
      getTeams: [],
      teamsAggregate: 0,
    };
  } catch (error: any) {
    console.error('getTeams: ❌ Error fetching teams', {
      error,
      errorMessage: error?.message,
      errorResponse: error?.response?.data,
      params,
    });
    throw error;
  }
};

/**
 * Create Team
 */
export interface CreateTeamInput {
  agencyId: string;
  name: string;
  email: string;
  bioIds?: string[];
}

export interface CreateTeamPayload {
  id: string;
  email: string;
  __typename?: string;
}

export interface CreateTeamResponse {
  createTeam: CreateTeamPayload;
}

export const createTeam = async (input: CreateTeamInput): Promise<CreateTeamPayload> => {
  try {
    const response = await executeGraphQL<CreateTeamResponse>({
      operationName: 'CreateTeam',
      query: CREATE_TEAM_MUTATION,
      variables: { input },
    });

    if (response.data?.createTeam) {
      return response.data.createTeam;
    }

    throw new Error('Failed to create team');
  } catch (error) {
    console.error('createTeam: ❌ Error creating team', error);
    throw error;
  }
};

/**
 * Get Team by ID
 */
export interface GetTeamParams {
  teamId: string;
}

export interface GetTeamResponse {
  getTeam: Team;
}

export const getTeam = async (params: GetTeamParams): Promise<Team> => {
  try {
    const response = await executeGraphQL<GetTeamResponse>({
      operationName: 'GetTeam',
      query: GET_TEAM_QUERY,
      variables: params,
    });

    if (response.data?.getTeam) {
      return response.data.getTeam;
    }

    throw new Error('Team not found');
  } catch (error) {
    console.error('getTeam: ❌ Error fetching team', error);
    throw error;
  }
};

/**
 * Delete Team
 */
export interface DeleteTeamParams {
  agencyId: string;
  teamId: string;
}

export interface DeleteTeamPayload {
  id: string;
  __typename?: string;
}

export interface DeleteTeamResponse {
  deleteTeam: DeleteTeamPayload;
}

export const deleteTeam = async (params: DeleteTeamParams): Promise<DeleteTeamPayload> => {
  try {
    const response = await executeGraphQL<DeleteTeamResponse>({
      operationName: 'DeleteTeam',
      query: DELETE_TEAM_MUTATION,
      variables: params,
    });

    if (response.data?.deleteTeam) {
      return response.data.deleteTeam;
    }

    throw new Error('Failed to delete team');
  } catch (error) {
    console.error('deleteTeam: ❌ Error deleting team', error);
    throw error;
  }
};

/**
 * Grant Team Access (assign creators to a team member)
 */
export interface GrantTeamAccessParams {
  agencyId: string;
  userId: string;
  bioIds: string[];
}

export interface GrantTeamAccessResponse {
  grantTeamAccess: {
    id: string;
    __typename?: string;
  };
}

export const grantTeamAccess = async (
  params: GrantTeamAccessParams
): Promise<GrantTeamAccessResponse['grantTeamAccess']> => {
  try {
    const response = await executeGraphQL<GrantTeamAccessResponse>({
      operationName: 'GrantTeamAccess',
      query: GRANT_TEAM_ACCESS_MUTATION,
      variables: params,
    });

    if (response.data?.grantTeamAccess) {
      return response.data.grantTeamAccess;
    }

    throw new Error('Failed to grant team access');
  } catch (error) {
    console.error('grantTeamAccess: ❌ Error granting team access', error);
    throw error;
  }
};

/**
 * Revoke Team Access (remove creator from team member)
 */
export interface RevokeTeamAccessParams {
  teamId: string;
  bioId: string;
}

export interface RevokeTeamAccessResponse {
  revokeTeamAccess: {
    id: string;
    __typename?: string;
  };
}

export const revokeTeamAccess = async (
  params: RevokeTeamAccessParams
): Promise<RevokeTeamAccessResponse['revokeTeamAccess']> => {
  try {
    const response = await executeGraphQL<RevokeTeamAccessResponse>({
      operationName: 'RevokeTeamAccess',
      query: REVOKE_TEAM_ACCESS_MUTATION,
      variables: params,
    });

    if (response.data?.revokeTeamAccess) {
      return response.data.revokeTeamAccess;
    }

    throw new Error('Failed to revoke team access');
  } catch (error) {
    console.error('revokeTeamAccess: ❌ Error revoking team access', error);
    throw error;
  }
};

export default {
  getTeams,
  createTeam,
  getTeam,
  deleteTeam,
  grantTeamAccess,
  revokeTeamAccess,
};

