"use client";

import React, { useState, useEffect } from 'react';
import { Box, Drawer, Tooltip } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { Typography, TextField, Button, Image, Card, Toast, Table, Loader } from '@superline/design-system';
import { Add as AddIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useTeamsApi, CreateTeamInput, GetTeamsParams } from '../../../hooks/useTeamsApi';
import { useCreatorsApi, GetCreatorsParams as CreatorsQueryParams } from '../../../hooks/useCreatorsApi';
import { Team } from '../../../api/types';

type CreatorOption = {
  bioId: string;
  name: string;
  imageURL: string | null;
};

const DEFAULT_AVATAR = '/assets/default-avatar.svg';

export default function TeamsPage() {
  const router = useRouter();
  const { agencyId, user, isLoading: authLoading } = useAuth();
  const { fetchTeams, createTeam, loading: teamsLoading } = useTeamsApi();
  const { fetchCreators: creatorsApi } = useCreatorsApi();
  const { execute: fetchCreatorsExecute, loading: creatorsLoading } = creatorsApi;
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    bio: '',
    phone: ''
  });
  const [teams, setTeams] = useState<Team[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState('');
  const [lastCreatedTeamName, setLastCreatedTeamName] = useState('');
  const [creatorOptions, setCreatorOptions] = useState<CreatorOption[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<CreatorOption[]>([]);
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});

  // Fetch teams when component mounts and agencyId is available (only once)
  useEffect(() => {
    if (authLoading) {
      console.log('TeamsPage: Auth still loading, waiting...');
      return;
    }
    
    if (!agencyId) {
      console.log('TeamsPage: agencyId not available, waiting...');
      return;
    }

    // Prevent multiple calls
    let isMounted = true;

    console.log('TeamsPage: ✅ Fetching teams for agencyId:', agencyId);
    
    const loadTeams = async () => {
      try {
        const params: GetTeamsParams = {
          agencyId,
          userId: user?.id || undefined,
          limit: 100,
          offset: 0,
        };
        
        console.log('TeamsPage: Calling fetchTeams.execute with params:', params);
        
        const response = await fetchTeams.execute(params);
        
        console.log('TeamsPage: Response received:', response);
        
        if (isMounted && response) {
          console.log('TeamsPage: ✅ Teams fetched:', {
            response,
            hasGetTeams: !!response.getTeams,
            teamsCount: response.getTeams?.length || 0,
            teams: response.getTeams,
          });
          
          // Ensure we have an array
          const teamsArray = Array.isArray(response.getTeams) ? response.getTeams : [];
          console.log('TeamsPage: Setting teams state with:', teamsArray.length, 'teams');
          setTeams(teamsArray);
        } else {
          console.warn('TeamsPage: Response is null or component unmounted');
        }
      } catch (err) {
        if (isMounted) {
          console.error('TeamsPage: ❌ Failed to fetch teams:', err);
        }
      }
    };

    loadTeams();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId, authLoading]);

  useEffect(() => {
    if (!isDrawerOpen || authLoading) {
      return;
    }

    if (!agencyId) {
      console.warn('TeamsPage: Cannot load creators - agencyId missing');
      return;
    }

    let isMounted = true;

    const loadCreators = async () => {
      try {
        const params: CreatorsQueryParams = {
          agencyId,
          limit: 200,
          offset: 0,
        };
        const response = await fetchCreatorsExecute(params);
        if (isMounted && response?.getCreators) {
          const options = response.getCreators.map(creator => ({
            bioId: creator.bio?.id || '',
            name: creator.bio?.pageName || 'Unknown Creator',
            imageURL: creator.bio?.imageURL || null,
          })).filter(option => option.bioId);
          setCreatorOptions(options);
        }
      } catch (err) {
        if (isMounted) {
          console.error('TeamsPage: ❌ Failed to load creators for dropdown', err);
          setCreatorOptions([]);
        }
      }
    };

    loadCreators();

    return () => {
      isMounted = false;
    };
  }, [isDrawerOpen, agencyId, authLoading, fetchCreatorsExecute]);

  // Style objects for complex styling
  const mainContainerStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)' },
    gap: { xs: 'var(--padding-lg)', sm: 'var(--padding-xl)', md: 'var(--padding-2xl)' },
    backgroundColor: 'var(--color-white-sidebar)',
    position: 'relative',
    minHeight: '100%',
    flexGrow: 1,
    width: '100%',
  };

  const emptyCardStyles = {
    width: '100%',
    flex: '1 1 auto',
    minHeight: { xs: 'calc(100vh - 160px)', md: 'calc(100vh - 180px)' },
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)' },
    position: 'relative',
  };

  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 'var(--padding-md)', sm: 0 },
    marginBottom: { xs: 'var(--padding-md)', sm: 0 },
  };

  const emptyStateContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--padding-lg-1)',
    textAlign: 'center'
  };

  const avatarContainerStyles = {
    position: 'relative',
    width: 'var(--width-avatar-lg)',
    height: 'var(--height-avatar-sm)'
  };

  const firstAvatarStyles = {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 'var(--width-avatar-sm)',
    height: 'var(--height-avatar-sm)',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid var(--color-avatar-border)',
    boxShadow: '0 2px 6px var(--color-avatar-shadow)',
    zIndex: 1
  };

  const secondAvatarStyles = {
    position: 'absolute',
    left: 'var(--padding-avatar-lg)',
    top: 0,
    width: 'var(--width-avatar-sm)',
    height: 'var(--height-avatar-sm)',
    backgroundColor: 'var(--color-white)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--color-avatar-border-secondary)',
    boxShadow: '0 2px 8px var(--color-avatar-shadow-hover)',
    zIndex: 2
  };

  const paginationContainerStyles = {
    bottom: 'var(--padding-xl)',
    right: 'var(--padding-xl)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 'var(--padding-lg-1)'
  };

  const paginationButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--width-pagination-md)',
    height: 'var(--height-pagination-md)',
    borderRadius: '50%',
    border: '1.5px solid var(--color-pagination-border)',
    cursor: 'pointer',
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-pagination-blue)',
    fontWeight: 400,
    '&:hover': {
      border: '1.5px solid var(--color-pagination-border)',
      backgroundColor: 'var(--color-white)',
    },
  };

  const currentPageStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-black)',
    fontWeight: 600,
  };

  const nextPageStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--width-pagination-md)',
    height: 'var(--height-pagination-md)',
    borderRadius: '50%',
    border: '1px solid var(--color-pagination-border)',
    cursor: 'pointer',
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-pagination-blue)',
    marginX: 'var(--padding-md)',
    fontWeight: 400,
    '&:hover': {
      backgroundColor: 'var(--color-white)',
    },
  };

  const tableCardStyles = {
    width: '100%',
    flex: '1 1 auto',
    minHeight: { xs: 'calc(100vh - 160px)', md: 'calc(100vh - 180px)' },
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    p: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)' },
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  };

  const tableHeaderStyles = {
    display: 'flex',
    alignItems: { xs: 'flex-start', sm: 'center' },
    justifyContent: 'space-between',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-2xl)' },
    mb: { xs: 2, sm: 3 }
  };

  const searchButtonContainerStyles = {
    display: 'flex',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: { xs: 'var(--padding-sm)', sm: 'var(--padding-md)' },
    flexDirection: { xs: 'column', sm: 'row' },
    width: { xs: '100%', sm: 'auto' },
  };

  const tableContainerStyles = {
    mt: 2,
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    overflowX: 'auto',
    position: 'relative',
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#CBD5E0',
      borderRadius: '9999px',
    },
  };

  const drawerStyles = {
    '& .MuiDrawer-paper': {
      width: { xs: '90%', sm: 'var(--width-card-sm)', md: 'var(--width-card-sm)' },
      maxWidth: 'var(--width-card-sm)',
      overflowX: 'hidden',
      backgroundColor: 'var(--color-white)',
      padding: { xs: 'var(--padding-md)', sm: 'var(--padding-lg)', md: 'var(--padding-xl)' },
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 'var(--padding-lg)', sm: 'var(--padding-xl)', md: 'var(--padding-2xl)' },
      boxSizing: "border-box",
    }
  };

  const formContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-xl)',
    flex: 1
  };

  const fieldContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-md)'
  };

  const buttonContainerStyles = {
    display: 'flex',
    gap: 'var(--padding-lg-1)',
    flexDirection: { xs: 'column', sm: 'row' },
    width: { xs: '100%', sm: 'auto' },
  };

  const saveButtonStyles = {
    minWidth: { xs: "100%", sm: "var(--width-sm-1)" },
    width: { xs: "100%", sm: "auto" },
    height: "var(--height-sm-1)",
  };

  // Additional style objects for inline sx props
  const imageCoverStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const imageBlockStyles = {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    display: 'block',
  };

  const addIconStyles = {
    fontSize: 'var(--font-size-icon-lg)',
    color: 'var(--color-grey-light)',
  };

  const chevronLeftStyles = {
    fontSize: 'var(--font-size-icon-md)',
    color: 'var(--color-grey-light)',
  };

  const creatorOptionContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-sm)',
    width: '100%',
  };

  const creatorOptionAvatarStyles = {
    width: 32,
    height: 32,
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#F2F4F7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  

  const validateField = (field: string, value: string): string | undefined => {
    const trimmed = value.trim();
    
    switch (field) {
      case 'name':
        if (!trimmed) {
          return undefined; // Don't show error on empty, only on blur/submit
        }
        if (trimmed.length < 3) {
          return 'Minimum length is 3 characters';
        }
        return undefined;
      
      case 'email':
        if (!trimmed) {
          return undefined; // Don't show error on empty
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
          return 'Invalid format';
        }
        return undefined;
      
      default:
        return undefined;
    }
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate field on change if it has a value
    if (value.trim()) {
      const error = validateField(field, value);
      setFormErrors(prev => ({
        ...prev,
        [field]: error
      }));
    } else {
      // Clear error if field is empty
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleBlur = (field: string) => () => {
    // Validate on blur
    if (field === 'name' || field === 'email') {
      const value = formData[field as keyof typeof formData];
      const error = validateField(field, value || '');
      setFormErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const handleSave = async () => {
    if (!agencyId) {
      console.warn('TeamsPage: Cannot create team without agencyId');
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const bioIds = Array.from(new Set(selectedCreators.map(option => option.bioId))).filter(Boolean);

    // Validate all fields
    const errors: { name?: string; email?: string } = {};
    
    if (!trimmedName) {
      errors.name = 'Name is required';
    } else if (trimmedName.length < 3) {
      errors.name = 'Minimum length is 3 characters';
    }
    
    if (!trimmedEmail) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Invalid format';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const input: CreateTeamInput = {
      agencyId,
      name: trimmedName,
      email: trimmedEmail,
      bioIds: bioIds.length ? bioIds : undefined,
    };

    try {
      await createTeam.execute(input);

      const params: GetTeamsParams = {
        agencyId,
        userId: user?.id || undefined,
        limit: 100,
        offset: 0,
      };

      const refreshed = await fetchTeams.execute(params);
      if (refreshed?.getTeams) {
        setTeams(refreshed.getTeams);
      }

      setLastCreatedTeamName(trimmedName);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      setIsDrawerOpen(false);
      setSelectedCreators([]);
      setFormData({ name: '', email: '', username: '', bio: '', phone: '' });
      setFormErrors({});
    } catch (err) {
      console.error('TeamsPage: ❌ Failed to create team', err);
      setErrorToastMessage('Failed to create team. Please try again.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }
  };

  const handleCancel = () => {
    setIsDrawerOpen(false);
    setFormData({
      name: '',
      email: '',
      username: '',
      bio: '',
      phone: ''
    });
    setFormErrors({});
    setSelectedCreators([]);
  };

  const handleTeamClick = (teamId: string) => {
    const href = `/dashboard/teams/${teamId}`;
    // Prefetch for faster navigation
    router.prefetch(href);
    router.push(href);
  };

  // Transform teams data to add clickable names and ensure all required fields
  const teamsWithClickableNames = teams.map(team => {
    // Ensure status is always a valid string - handle all edge cases
    let statusValue = 'Active'; // Default fallback
    if (team.status && typeof team.status === 'string' && team.status.trim() !== '') {
      statusValue = team.status.trim();
    }
    // If statusValue is still undefined/null, use default
    if (!statusValue || typeof statusValue !== 'string') {
      statusValue = 'Active';
    }

    const accessList = Array.isArray(team.access) ? team.access : [];
    const teamIdValue = String(team.id || '');

    const assignedAvatars = accessList.length > 0 ? (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {accessList.slice(0, 4).map((access, index) => {
          const creatorName = access.bio?.pageName || 'Unknown Creator';
          const avatarSrc = access.bio?.imageURL || DEFAULT_AVATAR;
          return (
            <Tooltip key={`${team.id}-creator-${access.bio?.id || index}`} title={creatorName} placement="top" arrow>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #FFFFFF',
                  backgroundColor: 'var(--color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ml: index === 0 ? 0 : '-12px',
                  boxShadow: '0 1px 4px rgba(15, 23, 42, 0.08)',
                  cursor: 'default',
                }}
              >
                <Image
                  src={avatarSrc}
                  alt={creatorName}
                  width="32px"
                  height="32px"
                  sx={imageCoverStyles}
                />
              </Box>
            </Tooltip>
          );
        })}
        {accessList.length > 4 && (
          <Box
            sx={{
              ml: '-12px',
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#F2F4F7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#475467',
              border: '2px solid #FFFFFF',
            }}
          >
            +{accessList.length - 4}
          </Box>
        )}
      </Box>
    ) : (
      <Typography sx={{ color: '#98A2B3' }}>No Creators</Typography>
    );
    
    return {
      ...team,
      name: (
        <Typography 
          onClick={(e) => {
            e.stopPropagation();
            handleTeamClick(teamIdValue);
          }}
          sx={{ 
            cursor: 'pointer', 
            color: '#667085',
            '&:hover': { color: '#475467' }
          }}
        >
          {team.name || 'Unknown Team'}
        </Typography>
      ),
      id: teamIdValue,
      email: String(team.user?.email || ''),
      assignedCreators: assignedAvatars,
      status: String(statusValue), // Double ensure it's a string
    };
  });

  // Table columns
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'id', label: 'Team ID' },
    { id: 'email', label: 'Email' },
    { id: 'assignedCreators', label: 'Assigned Creators' },
  ];

  return (
    <Box sx={mainContainerStyles}>
      {showToast && (
      <Toast message={`You successfully added "${lastCreatedTeamName || 'Name'}" to your teams!`} visible={showToast} type="success" position="top-center" onClose={() => setShowToast(false)} sx={{}} />
      )}
      {showErrorToast && (
      <Toast message={errorToastMessage} visible={showErrorToast} type="error" position="top-center" onClose={() => setShowErrorToast(false)} sx={{}} />
      )}
      {/* Show loader while loading */}
      {(authLoading || teamsLoading) ? (
        <Card
          onClick={() => {}}
          sx={emptyCardStyles}
        >
          <Box sx={headerStyles}>
            <Typography variant='heading-sm' sx={{ color: 'var(--color-black-secondary)' }}>
              Teams
            </Typography>
            <TextField
              variant='outlined'
              placeholder='Search'
              label=''
              helperText=''
              sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: '100%', sm: '200px' } }}
              id="search-teams-main"
            />
          </Box>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            flex: 1,
            minHeight: '400px',
            gap: 'var(--padding-lg)'
          }}>
            <Loader size={40} color="black" />
            <Typography variant="text-md" sx={{ color: 'var(--color-grey-light)' }}>
              Loading teams...
            </Typography>
          </Box>
        </Card>
      ) : teams.length === 0 ? (
        <Card
          onClick={() => {}}
          sx={emptyCardStyles}
        >
          <Box sx={headerStyles}>
            <Typography variant='heading-sm' sx={{ color: 'var(--color-black-secondary)' }}>
              Teams
            </Typography>
            <TextField
              variant='outlined'
              placeholder='Search'
              label=''
              helperText=''
              sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: '100%', sm: '200px' } }}
              id="search-teams-main"
            />
          </Box>
          <Box sx={emptyStateContainerStyles}>
            <Box sx={avatarContainerStyles}>
              <Box sx={firstAvatarStyles}>
                <Image
                  src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=94&h=94&fit=crop&crop=face'
                  alt='team-empty'
                  width='var(--width-avatar-sm)'
                  height='var(--height-avatar-sm)'
                  sx={imageBlockStyles}
                  className=''
                  onClick={() => {}}
                />
              </Box>
              <Box sx={secondAvatarStyles}>
                <AddIcon sx={addIconStyles} />
              </Box>
            </Box>
            <Typography variant='heading-sm' sx={{ color: 'var(--color-black-secondary)' }}>
              No Teams yet...
            </Typography>
            <Typography variant='text-md' sx={{ color: 'var(--color-grey-light)' }}>
              Create your first team and manage your Teams.
            </Typography>
            <Button variant='primary-dark-sm' onClick={() => setIsDrawerOpen(true)} disabled={false} sx={{}}>
              Create Team
            </Button>
          </Box>
          <Box sx={paginationContainerStyles}>
            <Typography variant='text-sm' sx={{ color: 'var(--color-grey-light)' }}>
              Page-1 | Total Item -6 | Showing 41-40 out of 142
            </Typography>

            <Box display={'flex'} gap={'var(--padding-md)'}>
              <Box sx={paginationButtonStyles}>
                <ChevronLeft sx={chevronLeftStyles} />
              </Box>

              <Box sx={currentPageStyles}>1</Box>

              <Box sx={nextPageStyles}>
                <ChevronRight sx={{ fontSize: 22 }} />
              </Box>
            </Box>
          </Box>
        </Card>
      ) : (
        <Card
          sx={tableCardStyles}
          onClick={() => {}}
        >
          <Box sx={tableHeaderStyles}>
            <Typography variant='heading-sm' sx={{ color: 'var(--color-black-secondary)', flex: 1 }}>
              Teams
            </Typography>
            <Box sx={searchButtonContainerStyles}>
              <TextField
                variant='outlined'
                placeholder='Search'
                label=''
                helperText=''
                sx={{ width: { xs: '100%', sm: 'fit-content' },
                minWidth: { xs: '100%', sm: '300px' },
                }}
                id="search-teams-table"
              />
              <Button variant='primary-dark-sm' onClick={() => setIsDrawerOpen(true)} disabled={false} sx={{}}>
                Create Team
              </Button>
            </Box>
          </Box>
          <Box sx={tableContainerStyles}>
            <Table
              columns={columns}
              rows={teamsWithClickableNames}
              showPagination={teamsWithClickableNames.length > 1}
               paginationPosition="right"
              itemsPerPage={10}
              sx={{ pb: 'var(--padding-4xl)' }}
            />
          </Box>
        </Card>
      )}

      {/* Create Team Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCancel}
        sx={drawerStyles}
      >
        <Typography variant='heading-sm' sx={{ color: 'var(--color-black-secondary)' }}>
          Create Team
        </Typography>

        <Box sx={formContainerStyles}>
          <Box sx={fieldContainerStyles}>
            <Typography variant='text-md' sx={{ color: 'var(--color-black)'}}>
              Name*
            </Typography>
            <TextField
              variant='outlined'
              label=''
              placeholder='Enter name'
              helperText={formErrors.name || ''}
              value={formData.name}
              onChange={handleInputChange('name')}
              onBlur={handleBlur('name')}
              id="team-name"
              error={Boolean(formErrors.name)}
            />
          </Box>

          <Box sx={fieldContainerStyles}>
            <Typography variant='text-md' sx={{ color: 'var(--color-black)'}}>
              Email
            </Typography>
            <TextField
              variant='outlined'
              label=''
              placeholder='Enter Email'
              helperText={formErrors.email || ''}
              type='email'
              value={formData.email}
              onChange={handleInputChange('email')}
              onBlur={handleBlur('email')}
              id="team-email"
              error={Boolean(formErrors.email)}
            />
          </Box>

          <Box sx={fieldContainerStyles}>
            <Typography variant='text-md' sx={{ color: 'var(--color-black)'}}>
              Creators
            </Typography>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={creatorOptions}
              value={selectedCreators}
              onChange={(_, value, reason, details) => {
                if (reason === 'selectOption' && value.length > 4) {
                  return;
                }
                setSelectedCreators(value);
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.bioId === value.bioId}
              loading={creatorsLoading}
              getOptionDisabled={(option) =>
                selectedCreators.length >= 4 &&
                !selectedCreators.some((creator) => creator.bioId === option.bioId)
              }
              renderOption={(props, option, { selected }) => (
                <li {...props} key={option.bioId}>
                  <Box sx={creatorOptionContainerStyles}>
                    <Box sx={creatorOptionAvatarStyles}>
                      <Image
                        src={option.imageURL || DEFAULT_AVATAR}
                        alt={option.name}
                        width="32px"
                        height="32px"
                        sx={imageCoverStyles}
                      />
                    </Box>
                    <Typography variant='text-md' sx={{ color: 'var(--color-black-secondary)' }}>
                      {option.name}
                    </Typography>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  variant='outlined'
                  label=''
                  placeholder='Select up to 4 creators'
                  helperText=''
                  id="team-creators"
                />
              )}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 'var(--border-radius-md)',
                  minHeight: 'var(--height-sm-1)',
                  alignItems: 'center',
                  backgroundColor: 'var(--color-white)',
                  padding: '0 var(--padding-lg)',
                  border: '1px solid var(--color-white-light)',
                  '&:hover': {
                    borderColor: 'var(--color-white-light)',
                  },
                  '&.Mui-focused': {
                    borderColor: 'var(--color-black-secondary)',
                    boxShadow: '0 0 0 2px rgba(15, 23, 42, 0.12)',
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiChip-root': {
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: 'var(--color-white-dull)',
                  color: 'var(--color-black-secondary)',
                },
              }}
              ListboxProps={{
                style: {
                  maxHeight: 280,
                },
              }}
            />
            <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
              You can assign up to 4 creators.
            </Typography>
          </Box>
        </Box>

        <Box sx={buttonContainerStyles}>
          <Button
            variant='outline-sm'
            onClick={handleCancel}
            disabled={false}
            sx={{...saveButtonStyles, 
              order: { xs: 2, sm: 1 }}}
          >
            Cancel
          </Button>
          <Button
            variant='primary-dark-sm'
            onClick={handleSave}
            disabled={createTeam.loading || !formData.name.trim() || !formData.email.trim()}
            sx={{...saveButtonStyles, 
              order: { xs: 1, sm: 2 }}}
          >
            Save
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
