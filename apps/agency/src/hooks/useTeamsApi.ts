/**
 * useTeamsApi Hook
 * Custom hook for teams API calls with individual loading states
 */

import {
  getTeams,
  createTeam as createTeamService,
  deleteTeam as deleteTeamService,
  getTeam as getTeamService,
  grantTeamAccess as grantTeamAccessService,
  revokeTeamAccess as revokeTeamAccessService,
  GetTeamsParams,
  CreateTeamInput,
  DeleteTeamParams,
  CreateTeamPayload,
  DeleteTeamPayload,
  GrantTeamAccessParams,
  RevokeTeamAccessParams,
} from '../api/services/teamsService';
import { useApiCall } from './useApiCall';

export const useTeamsApi = () => {
  const fetchTeams = useApiCall(getTeams);
  const createTeam = useApiCall<CreateTeamPayload, [CreateTeamInput]>(createTeamService);
  const fetchTeam = useApiCall(getTeamService);
  const deleteTeam = useApiCall<DeleteTeamPayload, [DeleteTeamParams]>(deleteTeamService);
  const grantTeamAccess = useApiCall(grantTeamAccessService);
  const revokeTeamAccess = useApiCall(revokeTeamAccessService);

  return {
    fetchTeams,
    fetchTeam,
    createTeam,
    deleteTeam,
    grantTeamAccess,
    revokeTeamAccess,
    loading: fetchTeams.loading,
    error: fetchTeams.error,
  };
};

export type {
  GetTeamsParams,
  CreateTeamInput,
  DeleteTeamParams,
  CreateTeamPayload,
  DeleteTeamPayload,
  GrantTeamAccessParams,
  RevokeTeamAccessParams,
};

