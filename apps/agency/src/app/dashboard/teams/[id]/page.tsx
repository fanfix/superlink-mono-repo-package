"use client";

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { Box, Modal } from '@mui/material';
import {
  Typography,
  Button,
  Image,
  Card,
  Table,
  TextField,
  Checkbox,
  Toast,
  Loader,
  ErrorIcon,
  DeleteIconWithBg,
} from '@superline/design-system';
import { useParams, useRouter } from 'next/navigation';
import { useTeamsApi } from '../../../../hooks/useTeamsApi';
import { useCreatorsApi } from '../../../../hooks/useCreatorsApi';
import { useAuth } from '../../../../contexts/AuthContext';
import { Team } from '../../../../api/types';

const DEFAULT_AVATAR = '/assets/default-avatar.svg';

function TeamMemberDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { agencyId } = useAuth();
  const { fetchTeam, grantTeamAccess, revokeTeamAccess, deleteTeam } = useTeamsApi();
  const { execute: fetchTeamExecute, loading } = fetchTeam;
  const { execute: grantTeamAccessExecute, loading: assigningCreators } = grantTeamAccess;
  const { execute: revokeTeamAccessExecute, loading: revokingCreator } = revokeTeamAccess;
  const { execute: deleteTeamExecute, loading: deletingTeam } = deleteTeam;
  const { fetchCreators, getAccessToken } = useCreatorsApi();
  const { execute: fetchCreatorsExecute, loading: creatorsLoading } = fetchCreators;

  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableCreators, setAvailableCreators] = useState<any[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [removingCreatorId, setRemovingCreatorId] = useState<string | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{
    open: boolean;
    bioId: string;
    name: string;
  }>({
    open: false,
    bioId: '',
    name: '',
  });
  const [deleteTeamModalOpen, setDeleteTeamModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [toastState, setToastState] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleExport = async (bioId: string) => {
    if (!bioId) {
      setToastState({
        visible: true,
        message: 'Creator ID is missing',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
      return;
    }

    try {
      await getAccessToken.execute({ bioId });
      setToastState({
        visible: true,
        message: 'Export token generated successfully',
        type: 'success',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
    } catch (err) {
      console.error('TeamMemberDetailPage: ❌ Failed to export creator', err);
      setToastState({
        visible: true,
        message: 'Failed to export creator. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
    }
  };

  const handleRemoveCreator = async (bioId: string) => {
    if (!team?.id) return;

    try {
      setRemovingCreatorId(bioId);
      await revokeTeamAccessExecute({
        teamId: team.id,
        bioId,
      });
      const refreshed = await fetchTeamExecute({ teamId: team.id });
      if (refreshed) {
        setTeam(refreshed as Team);
      }
      setToastState({
        visible: true,
        message: 'Creator removed successfully',
        type: 'success',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
    } catch (err) {
      console.error('Remove creator: failed to revoke team access', err);
      setToastState({
        visible: true,
        message: 'Failed to remove creator. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
    } finally {
      setRemovingCreatorId(null);
    }
  };

  const openDeleteModal = (bioId: string, name: string) => {
    setDeleteModalState({
      open: true,
      bioId,
      name,
    });
  };

  const closeDeleteModal = () => {
    if (revokingCreator) return;
    setDeleteModalState({
      open: false,
      bioId: '',
      name: '',
    });
  };

  const confirmRemoveCreator = async () => {
    if (!deleteModalState.bioId) return;
    try {
      await handleRemoveCreator(deleteModalState.bioId);
    } finally {
      setDeleteModalState({
        open: false,
        bioId: '',
        name: '',
      });
    }
  };

  const handleDeleteTeam = async () => {
    if (!team?.id) return;
    if (!agencyId) {
      console.error('Delete team: agencyId missing');
      setToastState({
        visible: true,
        message: 'Unable to delete team. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
      return;
    }

    try {
      await deleteTeamExecute({
        agencyId,
        teamId: team.id,
      });
      setDeleteTeamModalOpen(false);
      setToastState({
        visible: true,
        message: 'Team member deleted successfully',
        type: 'success',
      });
      setTimeout(() => {
        router.prefetch('/dashboard/teams');
        router.push('/dashboard/teams');
      }, 1000);
    } catch (err) {
      console.error('Delete team: failed to remove team member', err);
      setToastState({
        visible: true,
        message: 'Failed to delete team member. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
    }
  };


  useEffect(() => {
    let isMounted = true;

    const loadTeam = async () => {
      if (!params?.id || typeof params.id !== 'string') {
        setError('Team member not found');
        return;
      }

      try {
        setError(null);
        const response = await fetchTeamExecute({ teamId: params.id });
        if (isMounted && response) {
          setTeam(response);
        }
      } catch (err) {
        console.error('TeamDetailPage: failed to fetch team', err);
        if (isMounted) {
          setError('Unable to load team member. Please try again.');
        }
      }
    };

    loadTeam();

    return () => {
      isMounted = false;
    };
  }, [params?.id, fetchTeamExecute]);

  const assignedCreators = useMemo(() => {
    if (!team?.access) return [];
    return team.access.map(access => ({
      id: access.bio?.id ?? '',
      name: access.bio?.pageName ?? 'Unknown Creator',
      username: access.bio?.username ?? '—',
      avatar: access.bio?.imageURL ?? DEFAULT_AVATAR,
    }));
  }, [team]);

  const assignedCreatorIds = useMemo(
    () => new Set(assignedCreators.map(creator => creator.id)),
    [assignedCreators]
  );

  useEffect(() => {
    let isMounted = true;

    const loadCreators = async () => {
      if (!isModalOpen || !agencyId) return;

      try {
        const response = await fetchCreatorsExecute({
          agencyId,
          limit: 200,
          offset: 0,
        });
        if (isMounted && response?.getCreators) {
          setAvailableCreators(response.getCreators);
        }
      } catch (err) {
        console.error('TeamDetailPage: failed to load creators for modal', err);
      }
    };

    loadCreators();

    return () => {
      isMounted = false;
    };
  }, [isModalOpen, agencyId, fetchCreatorsExecute]);

  const selectableCreators = useMemo(() => {
    return availableCreators.filter(creator => {
      const bioId = creator.bio?.id ?? '';
      return bioId && !assignedCreatorIds.has(bioId);
    });
  }, [availableCreators, assignedCreatorIds]);

  const filteredCreators = useMemo(() => {
    if (!searchQuery.trim()) {
      return selectableCreators;
    }
    const lower = searchQuery.toLowerCase();
    return selectableCreators.filter(creator =>
      (creator.bio?.pageName || '').toLowerCase().includes(lower) ||
      (creator.bio?.username || '').toLowerCase().includes(lower)
    );
  }, [selectableCreators, searchQuery]);

  const tableColumns = useMemo(
    () => [
      { id: 'name', label: 'Name' },
      { id: 'id', label: 'User ID' },
      { id: 'username', label: 'Username' },
    ],
    []
  );

  const tableRows = useMemo(() => {
    return assignedCreators.map(creator => ({
      name: creator.name,
      id: creator.id || '—',
      username: creator.username,
      avatar: creator.avatar,
      bioId: creator.id,
      creatorName: creator.name,
    }));
  }, [assignedCreators]);

  if (loading && !team) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--padding-2xl)',
          minHeight: '60vh',
          gap: 'var(--padding-lg)',
        }}
      >
        <Loader size={40} color="black" />
        <Typography variant="text-md" sx={{ color: 'var(--color-grey-light)' }}>
          Loading team member…
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--padding-2xl)',
          minHeight: '60vh',
        }}
      >
        <Typography variant="text-md" sx={{ color: 'var(--color-error-main)' }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!team) {
    return null;
  }

  // Style objects for complex styling
  const pageContainerStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: { xs: 'var(--padding-lg)', md: 'var(--padding-xl)' },
    gap: 'var(--padding-xl)',
    backgroundColor: 'var(--color-white-sidebar)',
    minHeight: '100vh',
  };

  const cardStyles = {
    padding: { xs: 'var(--padding-lg)', md: 'var(--padding-xl)' },
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-xl)',
    backgroundColor: 'var(--color-white)',
  };

  const headerContainerStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'flex-start', md: 'center' },
    justifyContent: 'space-between',
    gap: 'var(--padding-lg)',
  };

  const avatarContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
  };

  const avatarImageStyles = {
    width: 72,
    height: 72,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid var(--color-white)',
    boxShadow: '0 6px 12px rgba(15, 23, 42, 0.08)',
  };

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const memberInfoStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const buttonContainerStyles = {
    display: 'flex',
    gap: 'var(--padding-sm)',
    flexDirection: { xs: 'column', sm: 'row' },
    width: { xs: '100%', sm: 'auto' },
  };

  const addCreatorButtonStyles = {
    minWidth: { xs: '100%', sm: 140 },
    width: { xs: '100%', sm: 'auto' },
  };

  const deleteMemberButtonStyles = {
    minWidth: { xs: '100%', sm: 140 },
    width: { xs: '100%', sm: 'auto' },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--padding-xs)',
    height: 'auto',
    paddingLeft: 'var(--padding-xl)',
    paddingRight: 'var(--padding-xl)',
    paddingTop: 'var(--padding-md)',
    paddingBottom: 'var(--padding-md)',
    backgroundColor: 'var(--color-error-primary)',
    borderColor: 'var(--color-error-primary)',
    color: 'var(--color-white)',
    '&:hover': {
      backgroundColor: 'var(--color-error-dark)',
      borderColor: 'var(--color-error-dark)',
      color: 'var(--color-white)',
    },
  };

  const sectionTitleStyles = {
    color: 'var(--color-black-secondary)',
    marginBottom: 'var(--padding-md)',
    fontWeight: 600,
  };

  const tableWrapperStyles = {
    width: '100%',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#CBD5E0',
      borderRadius: '9999px',
    },
  };

  const emptyStateContainerStyles = {
    padding: 'var(--padding-xl)',
    borderRadius: 'var(--border-radius-md)',
    backgroundColor: 'var(--color-white-dull)',
    border: '1px dashed var(--color-border-light)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--padding-sm)',
  };

  const modalContainerStyles = {
    position: 'absolute',
    top: { xs: '10%', sm: '50%' },
    left: '50%',
    transform: { xs: 'translate(-50%, 0)', sm: 'translate(-50%, -50%)' },
    width: { xs: '90%', sm: 420 },
    maxHeight: { xs: '85vh', sm: '80vh' },
    backgroundColor: 'var(--color-white)',
    borderRadius: '24px',
    boxShadow: '0px 20px 45px rgba(15, 23, 42, 0.18)',
    padding: { xs: 'var(--padding-lg)', sm: 'var(--padding-xl)' },
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-lg)',
    overflowY: 'auto',
  };

  const modalHeaderStyles = {
    fontWeight: 600,
  };

  const searchFieldStyles = {
    width: '100%',
  };

  const creatorsListStyles = {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-sm)',
    maxHeight: { xs: '50vh', sm: '60vh' },
  };

  const loadingContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--padding-xl)',
    gap: 'var(--padding-md)',
  };

  const creatorItemStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
    padding: 'var(--padding-md)',
    borderRadius: 'var(--border-radius-md)',
    border: '1px solid var(--color-border-light)',
  };

  const creatorAvatarStyles = {
    width: 48,
    height: 48,
    borderRadius: '50%',
    overflow: 'hidden',
  };

  const creatorInfoStyles = {
    flex: 1,
    minWidth: 0,
  };

  const creatorNameStyles = {
    color: 'var(--color-black-secondary)',
    fontWeight: 500,
  };

  const modalActionsStyles = {
    display: 'flex',
    gap: 'var(--padding-md)',
    justifyContent: 'flex-end',
    flexDirection: { xs: 'column', sm: 'row' },
  };

  const modalButtonStyles = {
    width: { xs: '100%'},
    height: 'auto',
  };

  const deleteModalCardStyles = {
    position: 'absolute',
    top: { xs: '10%', sm: '50%' },
    left: '50%',
    transform: { xs: 'translate(-50%, 0)', sm: 'translate(-50%, -50%)' },
    width: { xs: '90%', sm: 420 },
    maxWidth: 420,
    padding: { xs: 'var(--padding-lg)', sm: 'var(--padding-xl)' },
    borderRadius: 'var(--border-radius-xl)',
    boxShadow: '0px 20px 45px rgba(15, 23, 42, 0.18)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-lg)',
  };

  const deleteModalHeaderStyles = {
    textAlign: 'center',
  };

  const deleteModalTitleStyles = {
    fontWeight: 700,
    color: 'var(--color-black-secondary)',
    marginTop: 'var(--padding-lg)',
  };

  const deleteModalDescriptionStyles = {
    color: 'var(--color-grey-light)',
    marginTop: 'var(--padding-xl)',
  };

  const deleteModalActionsStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 'var(--padding-sm)',
  };

  const deleteModalCancelButtonStyles = {
    width: '100%',
    height: 'auto',
    paddingTop: 'var(--padding-md)',
    paddingBottom: 'var(--padding-md)',
    backgroundColor: 'var(--color-white-dull)',
    '&:hover': {
      backgroundColor: 'var(--color-white-light)',
    },
  };

  const deleteButtonStyles = {
    order: { xs: 1, sm: 2 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--padding-xs)',
    backgroundColor: 'var(--color-error-primary)',
    '&:hover': {
      backgroundColor: 'var(--color-error-dark)',
    },
    '&:disabled': {
      backgroundColor: 'var(--color-error-primary)',
    }
  };

  const memberName = team.user?.name || team.name || 'Team Member';
  const memberEmail = team.user?.email || 'No email provided';
  const memberAvatar = team.user?.imageURL || DEFAULT_AVATAR;

  return (
    <Box sx={pageContainerStyles}>
      <Card sx={cardStyles} onClick={() => {}}>
        <Box sx={headerContainerStyles}>
          <Box sx={avatarContainerStyles}>
            <Box sx={avatarImageStyles}>
              <Image
                src={memberAvatar}
                alt={memberName}
                width="72px"
                height="72px"
                sx={imageStyles}
              />
            </Box>
            <Box sx={memberInfoStyles}>
              <Typography variant="heading-md" sx={{ color: 'var(--color-black-secondary)' }}>
                {memberName}
              </Typography>
              <Typography variant="text-md" sx={{ color: 'var(--color-grey-light)' }}>
                {memberEmail}
              </Typography>
            </Box>
          </Box>
          <Box sx={buttonContainerStyles}>
            <Button
              variant="primary-dark-sm"
              onClick={() => {
                setSelectedCreators([]);
                setSearchQuery('');
                setIsModalOpen(true);
              }}
              sx={addCreatorButtonStyles}
            >
              Add Creator
            </Button>
            <Button
              variant="outline-sm"
              onClick={() => setDeleteTeamModalOpen(true)}
              sx={{
                ...deleteMemberButtonStyles,
              }}
            >
              <DeleteIconWithBg size={20} color="var(--color-error-secondary)" />
              Delete Member
            </Button>
          </Box>
        </Box>

        <Box>
          <Typography
            variant="heading-sm"
            sx={sectionTitleStyles}
          >
            Assigned Creators
          </Typography>

          {tableRows.length > 0 ? (
            <Box sx={tableWrapperStyles}>
              <Table
                columns={tableColumns}
                rows={tableRows}
                showPagination={false}
                actions={(row: any) => (
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <button
                    title="Export"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      margin: '0 var(--padding-xs)',
                    }}
                    onClick={() => handleExport(row.bioId)}
                    disabled={getAccessToken.loading}
                  >
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 17.0117L15 12.0117L10 7.01172" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 12.0117H3" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 3.01172H19C19.5304 3.01172 20.0391 3.22243 20.4142 3.59751C20.7893 3.97258 21 4.48129 21 5.01172V19.0117C21 19.5422 20.7893 20.0509 20.4142 20.4259C20.0391 20.801 19.5304 21.0117 19 21.0117H15" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    title="View"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      margin: '0 var(--padding-xs)',
                    }}
                    onClick={() => {
                      if (row.bioId) {
                        const href = `/dashboard/creator/${row.bioId}`;
                        router.prefetch(href);
                        router.push(href);
                      }
                    }}
                  >
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 12.0117C1 12.0117 5 4.01172 12 4.01172C19 4.01172 23 12.0117 23 12.0117C23 12.0117 19 20.0117 12 20.0117C5 20.0117 1 12.0117 1 12.0117Z"
                        stroke="#808080"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15.0117C13.6569 15.0117 15 13.6686 15 12.0117C15 10.3549 13.6569 9.01172 12 9.01172C10.3431 9.01172 9 10.3549 9 12.0117C9 13.6686 10.3431 15.0117 12 15.0117Z"
                        stroke="#808080"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    title="Remove"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: removingCreatorId === row.bioId || revokingCreator ? 'not-allowed' : 'pointer',
                      padding: 0,
                      margin: '0 var(--padding-xs)',
                      opacity: removingCreatorId === row.bioId || revokingCreator ? 0.5 : 1,
                    }}
                    disabled={removingCreatorId === row.bioId || revokingCreator}
                    onClick={() => openDeleteModal(row.bioId, row.creatorName || row.name)}
                  >
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 6.01172H5H21"
                        stroke="#808080"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 6.01172V4.01172C8 3.48129 8.21071 2.97258 8.58579 2.59751C8.96086 2.22243 9.46957 2.01172 10 2.01172H14C14.5304 2.01172 15.0391 2.22243 15.4142 2.59751C15.7893 2.97258 16 3.48129 16 4.01172V6.01172M19 6.01172V20.0117C19 20.5422 18.7893 21.0509 18.4142 21.4259C18.0391 21.801 17.5304 22.0117 17 22.0117H7C6.46957 22.0117 5.96086 21.801 5.58579 21.4259C5.21071 21.0509 5 20.5422 5 20.0117V6.01172H19Z"
                        stroke="#808080"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 11.0117V17.0117"
                        stroke="#808080"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 11.0117V17.0117"
                        stroke="#808080"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </Box>
              )}
            />
            </Box>
          ) : (
            <Box sx={emptyStateContainerStyles}>
              <Typography variant="text-md" sx={{ color: 'var(--color-grey-light)' }}>
                No creators assigned yet.
              </Typography>
              <Button
                variant="primary-dark-sm"
                onClick={() => {
                  setSelectedCreators([]);
                  setSearchQuery('');
                  setIsModalOpen(true);
                }}
              >
                Assign Creator
              </Button>
            </Box>
          )}
        </Box>
      </Card>

      {isMounted && (
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          keepMounted={false}
        >
        <Box sx={modalContainerStyles}>
          <Typography variant="heading-sm" sx={modalHeaderStyles}>
            Assign Creators
          </Typography>

          <TextField
            variant="outlined"
            placeholder="Search for creator"
            label=""
            helperText=""
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            sx={searchFieldStyles}
          />

          <Box sx={creatorsListStyles}>
            {creatorsLoading && selectableCreators.length === 0 ? (
              <Box sx={loadingContainerStyles}>
                <Loader size={40} color="black" />
                <Typography variant="text-md" sx={{ color: 'var(--color-grey-light)' }}>
                  Loading creators…
                </Typography>
              </Box>
            ) : filteredCreators.length > 0 ? (
              filteredCreators.map(creator => {
                const bioId = creator.bio?.id ?? '';
                const checked = selectedCreators.includes(bioId);
                return (
                  <Box
                    key={bioId}
                    sx={creatorItemStyles}
                  >
                    <Box sx={creatorAvatarStyles}>
                      <Image
                        src={creator.bio?.imageURL || DEFAULT_AVATAR}
                        alt={creator.bio?.pageName || 'Creator'}
                        width="48px"
                        height="48px"
                        sx={imageStyles}
                      />
                    </Box>
                    <Box sx={creatorInfoStyles}>
                      <Typography
                        variant="text-md"
                        sx={creatorNameStyles}
                      >
                        {creator.bio?.pageName || 'Unknown Creator'}
                      </Typography>
                      <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
                        @{creator.bio?.username || 'username'}
                      </Typography>
                    </Box>
                    <Checkbox
                      size="md"
                      checked={checked}
                      onChange={isChecked => {
                        setSelectedCreators(prev => {
                          if (isChecked) {
                            return [...prev, bioId];
                          }
                          return prev.filter(id => id !== bioId);
                        });
                      }}
                    />
                  </Box>
                );
              })
            ) : (
              <Typography variant="text-md" sx={{ color: 'var(--color-grey-light)' }}>
                No additional creators available.
              </Typography>
            )}
          </Box>

          <Box sx={modalActionsStyles}>
            <Button
              variant="outline-sm"
              onClick={() => setIsModalOpen(false)}
              sx={{...modalButtonStyles, 
                 order: { xs: 2, sm: 1 }}}
            >
              Cancel
            </Button>
            <Button
              variant="primary-dark-sm"
              disabled={selectedCreators.length === 0 || assigningCreators}
              sx={{...modalButtonStyles, 
                order: { xs: 1, sm: 2 }}}
              onClick={async () => {
                if (!agencyId || !team?.id) {
                  console.error('Assign creators: missing agency or team id');
                  return;
                }

                try {
                  const userId = team.user?.id;
                  if (!userId) {
                    throw new Error('Team member userId missing');
                  }

                  await grantTeamAccessExecute({
                    agencyId,
                    userId,
                    bioIds: selectedCreators,
                  });

                  const refreshed = await fetchTeamExecute({ teamId: team.id });
                  if (refreshed) {
                    setTeam(refreshed as Team);
                  }
                  setIsModalOpen(false);
                  setSelectedCreators([]);
                  setSearchQuery('');
                  setToastState({
                    visible: true,
                    message: 'Creators assigned successfully',
                    type: 'success',
                  });
                  setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
                } catch (err) {
                  console.error('Assign creators: failed to grant access', err);
                  setToastState({
                    visible: true,
                    message: 'Failed to assign creators. Please try again.',
                    type: 'error',
                  });
                  setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
                }
              }}
            >
              {assigningCreators ? 'Assigning…' : 'Assign Creators'}
            </Button>
          </Box>
        </Box>
      </Modal>
      )}

      {isMounted && (
        <Modal open={deleteModalState.open} onClose={closeDeleteModal} keepMounted={false}>
          <Card sx={deleteModalCardStyles}>
            <Box sx={deleteModalHeaderStyles}>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--padding-md)' }}>
                <ErrorIcon size={40} color="#B33737" />
              </Box>
              <Typography variant="heading-sm" sx={deleteModalTitleStyles}>
                Remove Creator?
              </Typography>
              <Typography
                variant="text-md"
                sx={deleteModalDescriptionStyles}
              >
                Removing access for{' '}
                <Typography
                  component="span"
                  variant="text-md"
                  sx={{ fontWeight: 600, color: 'var(--color-black-secondary)' }}
                >
                  {deleteModalState.name || 'the selected creator'}
                </Typography>{' '}
                cannot be undone.
              </Typography>
            </Box>

            <Box sx={deleteModalActionsStyles}>
              <Button
                variant="primary-dark"
                fullWidth
                onClick={confirmRemoveCreator}
                disabled={revokingCreator}
                sx={deleteButtonStyles}
              >
                {revokingCreator ? (
                  'Delete…'
                ) : (
                  <>
                    <DeleteIconWithBg size={20} color="var(--color-error-secondary)" />
                    Delete
                  </>
                )}
              </Button>
              <Button
                variant="outline-sm"
                fullWidth
                onClick={closeDeleteModal}
                disabled={revokingCreator}
                sx={deleteModalCancelButtonStyles}
              >
                Cancel
              </Button>
            </Box>
          </Card>
        </Modal>
      )}

      {isMounted && (
        <Modal open={deleteTeamModalOpen} onClose={() => setDeleteTeamModalOpen(false)} keepMounted={false}>
        <Card sx={deleteModalCardStyles}>
          <Box sx={deleteModalHeaderStyles}>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--padding-md)' }}>
              <ErrorIcon size={40} color="#B33737" />
            </Box>
            <Typography variant="heading-sm" sx={deleteModalTitleStyles}>
              Delete Confirmation
            </Typography>
            <Typography
              variant="text-md"
              sx={deleteModalDescriptionStyles}
            >
              Are you sure you want to remove access for{' '}
              <Typography
                component="span"
                variant="text-md"
                sx={{ fontWeight: 600, color: 'var(--color-black-secondary)' }}
              >
                {memberName}
              </Typography>
              ? This process cannot be undone.
            </Typography>
          </Box>

          <Box sx={deleteModalActionsStyles}>
            <Button
              variant="primary-dark"
              fullWidth
              onClick={handleDeleteTeam}
              disabled={deletingTeam}
              sx={deleteButtonStyles}
            >
              {deletingTeam ? (
                'Deleting…'
              ) : (
                <>
                  <DeleteIconWithBg size={20} color="var(--color-error-secondary)" />
                  Delete
                </>
              )}
            </Button>
            <Button
              variant="outline-sm"
              fullWidth
              onClick={() => setDeleteTeamModalOpen(false)}
              disabled={deletingTeam}
              sx={deleteModalCancelButtonStyles}
            >
              Cancel
            </Button>
          </Box>
        </Card>
      </Modal>
      )}

      <Toast
        message={toastState.message}
        type={toastState.type}
        visible={toastState.visible}
        position="top-center"
        onClose={() => setToastState(prev => ({ ...prev, visible: false }))}
      />
    </Box>
  );
}

export default function TeamMemberDetailPage() {
  return (
    <Suspense fallback={<Loader fullScreen={true} />}>
      <TeamMemberDetailContent />
    </Suspense>
  );
}
