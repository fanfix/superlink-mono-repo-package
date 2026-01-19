"use client";

import React, { useState, useEffect } from 'react';
import { Box, Drawer, Modal } from '@mui/material';
import { Typography, TextField, Button, Image, Card, Toast, Table, Loader, ErrorIcon, DeleteIconWithBg } from '@superline/design-system';
import { Add as AddIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useCreatorsApi, GetCreatorsParams, CreateAgencyCreatorInput } from '../../../hooks/useCreatorsApi';
import { Creator } from '../../../api/types';

export default function CreatorPage() {
  const router = useRouter();
  const { agencyId, user, isLoading: authLoading } = useAuth();
  const { fetchCreators, createCreator, revokeCreator, getAccessToken } = useCreatorsApi();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    bio: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState<{ 
    name?: string;
    email?: string;
    username?: string;
    bio?: string;
  }>({});
  const [creators, setCreators] = useState<Creator[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState('');
  const [showExportToast, setShowExportToast] = useState(false);
  const [showExportErrorToast, setShowExportErrorToast] = useState(false);
  const [exportErrorToastMessage, setExportErrorToastMessage] = useState('');
  const [lastCreatedCreatorName, setLastCreatedCreatorName] = useState('');
  const [deleteModalState, setDeleteModalState] = useState<{
    open: boolean;
    bioId: string;
    name: string;
  }>({
    open: false,
    bioId: '',
    name: '',
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch creators when component mounts and agencyId is available (only once)
  useEffect(() => {
    if (authLoading) {
      console.log('CreatorPage: Auth still loading, waiting...');
      return;
    }
    
    if (!agencyId) {
      console.log('CreatorPage: agencyId not available, waiting...');
      return;
    }

    // Prevent multiple calls
    let isMounted = true;

    console.log('CreatorPage: ✅ Fetching creators for agencyId:', agencyId, 'userId:', user?.id);
    
    const loadCreators = async () => {
      try {
        const params: GetCreatorsParams = {
          agencyId,
          userId: user?.id || undefined,
          limit: 100,
          offset: 0,
        };
        
        console.log('CreatorPage: Calling fetchCreators.execute with params:', params);
        
        const response = await fetchCreators.execute(params);
        
        if (isMounted && response) {
          console.log('CreatorPage: ✅ Creators fetched:', response);
          setCreators(response.getCreators || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('CreatorPage: ❌ Failed to fetch creators:', err);
        }
      }
    };

    loadCreators();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId, authLoading]);

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
    width: { xs: "100%",},
    height: "var(--height-sm-1)",
  };

  // Additional style objects for inline sx props
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

  const modalTitleStyles = {
    fontWeight: 700,
    color: 'var(--color-black-secondary)',
    marginTop: 'var(--padding-lg)',
  };

  const modalActionsContainerStyles = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    // flexDirection: 'column',
    gap: 'var(--padding-sm)',
  };

  const deleteButtonStyles = {
    order: { xs: 2, sm: 1 },
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

  const cancelButtonStyles = {
    order: { xs: 2, sm: 1 },
    width: '100%',
    height: 'auto',
    paddingTop: 'var(--padding-md)',
    paddingBottom: 'var(--padding-md)',
    backgroundColor: 'var(--color-white-dull)',
    '&:hover': {
      backgroundColor: 'var(--color-white-light)',
    },
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
      
      case 'username':
        if (!trimmed) {
          return undefined; // Don't show error on empty
        }
        if (trimmed.length < 3) {
          return 'Minimum length is 3 characters';
        }
        return undefined;
      
      case 'bio':
        if (!trimmed) {
          return undefined; // Don't show error on empty
        }
        if (trimmed.length < 10) {
          return 'Minimum length is 10 characters';
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

  const handleSave = async () => {
    if (!agencyId) {
      console.warn('CreatorPage: Cannot create creator without agencyId');
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedUsername = formData.username.trim();
    const trimmedBio = formData.bio.trim();

    // Validate all fields
    const errors: { name?: string; email?: string; username?: string; bio?: string } = {};
    
    if (!trimmedName) {
      errors.name = 'Name is required';
    } else if (trimmedName.length < 3) {
      errors.name = 'Minimum length is 3 characters';
    }
    
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Invalid format';
    }
    
    if (trimmedUsername && trimmedUsername.length < 3) {
      errors.username = 'Minimum length is 3 characters';
    }
    
    if (trimmedBio && trimmedBio.length < 10) {
      errors.bio = 'Minimum length is 10 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const input: CreateAgencyCreatorInput = {
      pageName: trimmedName,
    };

    if (trimmedUsername) {
      input.username = trimmedUsername;
    }

    if (trimmedEmail) {
      input.email = trimmedEmail;
    }

    const bioValue = formData.bio.trim();
    const phoneValue = formData.phone.trim();

    if (bioValue) {
      input.introMessage = bioValue;
    }

    if (phoneValue) {
      input.phoneNumber = phoneValue;
    }

    try {
      await createCreator.execute(input);

      const params: GetCreatorsParams = {
        agencyId,
        userId: user?.id || undefined,
        limit: 100,
        offset: 0,
      };

      const refreshed = await fetchCreators.execute(params);
      if (refreshed?.getCreators) {
        setCreators(refreshed.getCreators);
      }

      setLastCreatedCreatorName(trimmedName);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      setIsDrawerOpen(false);
      setFormData({ name: '', email: '', username: '', bio: '', phone: '' });
      setFormErrors({ name: undefined, email: undefined, username: undefined, bio: undefined });
    } catch (err) {
      console.error('CreatorPage: ❌ Failed to create creator', err);
      setErrorToastMessage('Failed to create creator. Please try again.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }
  };

  const handleCancel = () => {
    setIsDrawerOpen(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      username: '',
      bio: '',
      phone: ''
    });
    setFormErrors({ name: undefined, email: undefined, username: undefined, bio: undefined });
  };
  const isSaveDisabled = createCreator.loading || !formData.name.trim();

  const handleViewCreator = (bioId: string) => {
    const href = `/dashboard/creator/${bioId}`;
    // Prefetch for faster navigation
    router.prefetch(href);
    router.push(href);
  };

  const handleExport = async (bioId: string) => {
    if (!bioId) {
      setExportErrorToastMessage('Creator ID is missing');
      setShowExportErrorToast(true);
      setTimeout(() => setShowExportErrorToast(false), 3000);
      return;
    }

    try {
      await getAccessToken.execute({ bioId });
      setShowExportToast(true);
      setTimeout(() => setShowExportToast(false), 3000);
    } catch (err) {
      console.error('CreatorPage: ❌ Failed to export creator', err);
      setExportErrorToastMessage('Failed to export creator. Please try again.');
      setShowExportErrorToast(true);
      setTimeout(() => setShowExportErrorToast(false), 3000);
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
    if (revokeCreator.loading) return;
    setDeleteModalState({
      open: false,
      bioId: '',
      name: '',
    });
  };

  const handleDeleteCreator = async () => {
    if (!deleteModalState.bioId || !agencyId) return;

    try {
      await revokeCreator.execute({
        agencyId,
        bioId: deleteModalState.bioId,
      });

      // Refresh creators list
      const params: GetCreatorsParams = {
        agencyId,
        userId: user?.id || undefined,
        limit: 100,
        offset: 0,
      };
      
      const refreshed = await fetchCreators.execute(params);
      if (refreshed?.getCreators) {
        setCreators(refreshed.getCreators);
      }

      setDeleteModalState({
        open: false,
        bioId: '',
        name: '',
      });
      setShowDeleteToast(true);
      setTimeout(() => setShowDeleteToast(false), 3000);
    } catch (err) {
      console.error('CreatorPage: ❌ Failed to delete creator', err);
      setErrorToastMessage('Failed to delete creator. Please try again.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }
  };

  // Transform creators data to match table format
  const transformedCreators = creators.map(creator => {
    // Ensure status is always a valid string
    let statusValue = 'Inactive'; // Default
    if (creator.accepted === true) {
      statusValue = 'Active';
    } else if (creator.accepted === false) {
      statusValue = 'Inactive';
    } else if (creator.status && typeof creator.status === 'string') {
      statusValue = creator.status;
    }
    
    // If statusValue is still undefined/null, use default
    if (!statusValue || typeof statusValue !== 'string') {
      statusValue = 'Inactive';
    }
    
    // IMPORTANT: bioId is always taken from bio.id (source of truth)
    const creatorBioId = creator.bio?.id || '';
    
    // Default avatar path
    const DEFAULT_AVATAR = '/assets/default-avatar.svg';
    
    const assignedUser = creator.bio?.agencyTeamAccess?.[0]?.agencyTeam?.user;

    return {
      ...creator,
      name: creator.bio?.pageName || 'Unknown',
      id: String(creator.id || ''),
      bioId: String(creatorBioId),
      avatar: creator.bio?.imageURL || DEFAULT_AVATAR,
      status: String(statusValue),
      assignedTo: String(assignedUser?.name || 'Unassigned'),
      assignedAvatar: assignedUser?.imageURL || DEFAULT_AVATAR,
      email: String(creator.bio?.user?.email || ''),
    };
  });

  // Table columns per Figma design
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'id', label: 'User ID' },
    { id: 'status', label: 'Status' },
    { id: 'assignedTo', label: 'Assigned To' },
    // Actions header is automatically added by Table component when actions prop is given
  ];

  return (
    <Box sx={mainContainerStyles}>
      {showToast && (
        <Toast message={`You successfully added "${lastCreatedCreatorName || 'Name'}" to your creators!`} visible={showToast} type="success" position="top-center" onClose={() => setShowToast(false)} sx={{}} />
      )}
      {showDeleteToast && (
        <Toast message="Creator deleted successfully" visible={showDeleteToast} type="success" position="top-center" onClose={() => setShowDeleteToast(false)} sx={{}} />
      )}
      {showErrorToast && (
        <Toast message={errorToastMessage} visible={showErrorToast} type="error" position="top-center" onClose={() => setShowErrorToast(false)} sx={{}} />
      )}
      {showExportToast && (
        <Toast message="Export token generated successfully" visible={showExportToast} type="success" position="top-center" onClose={() => setShowExportToast(false)} sx={{}} />
      )}
      {showExportErrorToast && (
        <Toast message={exportErrorToastMessage} visible={showExportErrorToast} type="error" position="top-center" onClose={() => setShowExportErrorToast(false)} sx={{}} />
      )}
      {/* Show loader while loading */}
      {(authLoading || fetchCreators.loading) ? (
        <Card
          onClick={() => {}}
          sx={emptyCardStyles}
        >
          <Box sx={headerStyles}>
            <Typography variant='heading-sm' sx={{ color: 'var(--color-black-secondary)' }}>
              Creators
            </Typography>
            <TextField
              variant='outlined'
              placeholder='Search'
              label=''
              helperText=''
              sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: '100%', sm: '200px' } }}
              id="search-creators-main"
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
              Loading creators...
            </Typography>
          </Box>
        </Card>
      ) : creators.length === 0 ? (
      <Card
        onClick={() => {}}
        sx={emptyCardStyles}
      >
<Box sx={headerStyles}>
        <Typography variant='heading-sm' sx={{ color: 'var(--color-black-secondary)' }}>
          Creators
        </Typography>
       <TextField
              variant='outlined'
              placeholder='Search'
              label=''
              helperText=''
              sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { xs: '100%', sm: '200px' } }}
              id="search-creators-main"
       />
      </Box>
        <Box sx={emptyStateContainerStyles}>
          <Box sx={avatarContainerStyles}>
            <Box sx={firstAvatarStyles}>
              <Image
                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=94&h=94&fit=crop&crop=face'
                alt='creator-empty'
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
            No Creators yet...
          </Typography>
          <Typography variant='text-md' sx={{ color: 'var(--color-grey-light)' }}>
            Add and manage your Creators.
          </Typography>
          <Button variant='primary-dark-sm' onClick={() => setIsDrawerOpen(true)} disabled={false} sx={{}}>
            Add Creators
          </Button>
        </Box>
          {/* Pagination card visual kept as is, for empty state */}
        {/* Pagination (bottom-right) */}
    <Box sx={paginationContainerStyles}>
          <Typography variant='text-sm' sx={{ color: 'var(--color-grey-light)' }}>
            Page-1 | Total Item -6 | Showing 41-40 out of 142
          </Typography>

          <Box display={'flex'} gap={'var(--padding-md)'}>
         <Box sx={paginationButtonStyles}>
  <ChevronLeft sx={chevronLeftStyles} />
</Box>

<Box sx={currentPageStyles}>
  1
</Box>

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
              Creators
            </Typography>
            <Box sx={searchButtonContainerStyles}>
              <TextField
                variant='outlined'
                placeholder='Search'
                label=''
                helperText=''
                sx={{ width: { xs: '100%', sm: 'fit-content' }, minWidth: { xs: '100%', sm: '200px' } }}
                id="search-creators-table"
              />
              <Button variant='primary-dark-sm' onClick={() => setIsDrawerOpen(true)} disabled={false} sx={{}}>
                Add Creator
              </Button>
            </Box>
          </Box>
          <Box sx={tableContainerStyles}>
            <Table
              columns={columns}
              rows={transformedCreators}
              showPagination={transformedCreators.length > 1}
              itemsPerPage={10}
              paginationPosition="right"
              sx={{ pb: 'var(--padding-4xl)' }}
              actions={(row: any) => (
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <button 
                    title="Export" 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, margin: '0 var(--padding-xs)' }}
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
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, margin: '0 var(--padding-xs)' }}
                    onClick={() => handleViewCreator(row.bioId)}
                  >
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 12.0117C1 12.0117 5 4.01172 12 4.01172C19 4.01172 23 12.0117 23 12.0117C23 12.0117 19 20.0117 12 20.0117C5 20.0117 1 12.0117 1 12.0117Z" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 15.0117C13.6569 15.0117 15 13.6686 15 12.0117C15 10.3549 13.6569 9.01172 12 9.01172C10.3431 9.01172 9 10.3549 9 12.0117C9 13.6686 10.3431 15.0117 12 15.0117Z" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

                  </button>
                  <button 
                    title="Delete" 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, margin: '0 var(--padding-xs)' }}
                    onClick={() => openDeleteModal(row.bioId, row.name)}
                  >
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 6.01172H5H21" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M8 6.01172V4.01172C8 3.48129 8.21071 2.97258 8.58579 2.59751C8.96086 2.22243 9.46957 2.01172 10 2.01172H14C14.5304 2.01172 15.0391 2.22243 15.4142 2.59751C15.7893 2.97258 16 3.48129 16 4.01172V6.01172M19 6.01172V20.0117C19 20.5422 18.7893 21.0509 18.4142 21.4259C18.0391 21.801 17.5304 22.0117 17 22.0117H7C6.46957 22.0117 5.96086 21.801 5.58579 21.4259C5.21071 21.0509 5 20.5422 5 20.0117V6.01172H19Z" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M14 11.0117V17.0117" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10 11.0117V17.0117" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

                  </button>
                </Box>
              )}
            />
          </Box>
      </Card>
      )}

      {/* Add Creator Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCancel}
        sx={drawerStyles}
      >
        {/* Drawer Header */}
        
          <Typography variant='heading-sm' sx={{ color: 'var(--color-black-secondary)' }}>
            Add Creator
          </Typography>
      

        {/* Form Fields */}
        <Box sx={formContainerStyles}>
          <Box sx={fieldContainerStyles}>
            <Typography variant='text-md' sx={{ color: 'var(--color-black)'}}>
              Name*
            </Typography>
            <TextField
              variant='outlined'
              label=''
              placeholder='Enter name'
              helperText={formErrors.name ?? ''}
              value={formData.name}
              onChange={handleInputChange('name')}
              id="creator-name"
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
              helperText={formErrors.email ?? ''}
              type='email'
              value={formData.email}
              onChange={handleInputChange('email')}
              id="creator-email"
              error={Boolean(formErrors.email)}
            />
          </Box>

          <Box sx={fieldContainerStyles}>
            <Typography variant='text-md' sx={{ color: 'var(--color-black)'}}>
              Username
            </Typography>
            <TextField
              variant='outlined'
              label=''
              placeholder='Enter Username'
              helperText={formErrors.username ?? ''}
              value={formData.username}
              onChange={handleInputChange('username')}
              id="creator-username"
              error={Boolean(formErrors.username)}
            />
          </Box>

          <Box sx={fieldContainerStyles}>
            <Typography variant='text-md' sx={{ color: 'var(--color-black)'}}>
              Bio
            </Typography>
            <TextField
              variant='outlined'
              label=''
              placeholder='Enter Bio'
              helperText={formErrors.bio ?? ''}
              value={formData.bio}
              onChange={handleInputChange('bio')}
              id="creator-bio"
              error={Boolean(formErrors.bio)}
            />
          </Box>

          <Box sx={fieldContainerStyles}>
            <Typography variant='text-md' sx={{ color: 'var(--color-black)'}}>
              Phone number
            </Typography>
            <TextField
              variant='outlined'
              label=''
              placeholder='1 (702) 123-456'
              helperText=''
              value={formData.phone}
              onChange={handleInputChange('phone')}
              id="creator-phone"
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={buttonContainerStyles}>
          <Button
            variant='outline-sm'
            onClick={handleCancel}
            disabled={false}
            sx={{
              ...saveButtonStyles,
              order: { xs: 2, sm: 1 },
            }}
          >
            Cancel
          </Button>
          <Button
            variant='primary-dark-sm'
            onClick={handleSave}
            disabled={isSaveDisabled}
            sx={{
              ...saveButtonStyles,
              order: { xs: 1, sm: 2 },
            }}
          >
            Save
          </Button>
          </Box>
      </Drawer>

      {/* Delete Confirmation Modal */}
      {isMounted && (
        <Modal open={deleteModalState.open} onClose={closeDeleteModal} keepMounted={false}>
          <Card
            sx={{
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
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--padding-md)' }}>
                <ErrorIcon size={40} color="#B33737" />
              </Box>
              <Typography variant="heading-sm" sx={modalTitleStyles}>
                Delete Confirmation
              </Typography>
              <Typography
                variant="text-md"
                sx={{
                  padding: 'var(--padding-lg)',
                  color: 'var(--color-grey-light)',
                  marginTop: 'var(--padding-sm)',
                }}
              >
                Are you sure you want to remove access? This process cannot be undone.
              </Typography>
            </Box>

            <Box sx={modalActionsContainerStyles}>
              
              <Button
                variant="primary-dark"
                fullWidth
                onClick={handleDeleteCreator}
                disabled={revokeCreator.loading}
                sx={{...deleteButtonStyles, order: { xs: 1, sm: 2 }}}
              >
                {revokeCreator.loading ? (
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
                onClick={closeDeleteModal}
                disabled={revokeCreator.loading}
                sx={cancelButtonStyles}
              >
                Cancel
              </Button>
            </Box>
          </Card>
        </Modal>
      )}

    </Box>
  );
}


