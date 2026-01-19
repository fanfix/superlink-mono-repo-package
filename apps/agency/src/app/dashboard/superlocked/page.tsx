'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Drawer } from '@mui/material';
import { Typography, TextField, Button, Image, Card, Toast, Table, Loader } from '@superline/design-system';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { useCreatorsApi } from '../../../hooks/useCreatorsApi';
import type { Creator } from '../../../api/types';

export default function CreatorPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { agencyId, isLoading: authLoading } = useAuth();
  const { fetchCreatorsWithUnlockContent } = useCreatorsApi();
  const {
    execute: fetchCreatorsWithUnlockContentExecute,
    loading: fetchCreatorsWithUnlockContentLoading,
  } = fetchCreatorsWithUnlockContent;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    bio: '',
    phone: '',
  });
  const [creators, setCreators] = useState<Creator[]>([]);
  const [totalCreators, setTotalCreators] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const limit = 20;

  // Style objects for complex styling
  const mainContainerStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 'var(--padding-xl)',
    gap: 'var(--padding-2xl)',
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
    padding: 'var(--padding-xl)',
    position: 'relative',
  };

  const headerStyles = {
    display: 'flex',
    gap: 'var(--padding-md)',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  };

  const emptyStateContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--padding-lg-1)',
    textAlign: 'center',
  };

  const avatarContainerStyles = {
    position: 'relative',
    width: 'var(--width-avatar-lg)',
    height: 'var(--height-avatar-sm)',
  };

  const firstAvatarStyles = {
    position: 'var(--position-absolute)',
    left: 0,
    bottom: 0,
    width: 'var(--width-avatar-sm)',
    height: 'var(--height-avatar-sm)',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid var(--color-avatar-border)',
    boxShadow: '0 2px 6px var(--color-avatar-shadow)',
    zIndex: 1,
  };

  const secondAvatarStyles = {
    position: 'var(--position-absolute)',
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
    zIndex: 2,
  };

  const paginationContainerStyles = {
    bottom: 'var(--padding-xl)',
    right: 'var(--padding-xl)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 'var(--padding-lg-1)',
    paddingTop: { xs: 'var(--padding-md)', sm: 'var(--padding-xl)' },
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
    p: 'var(--padding-xl)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  };

  const tableHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--padding-2xl)',
    mb: 3,
  };

  const searchButtonContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
  };

  const tableContainerStyles = {
    mt: 2,
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    position: 'relative',
  };

  const drawerStyles = {
    Width: 'var(--width-card-sm)',
    '& .MuiDrawer-paper': {
      width: 'var(--width-card-sm)',
      overflowX: 'hidden',
      backgroundColor: 'var(--color-white)',
      padding: 'var(--padding-xl)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--padding-2xl)',
      boxSizing: 'border-box',
    },
  };

  const formContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-xl)',
    flex: 1,
  };

  const fieldContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--padding-md)',
  };

  const buttonContainerStyles = {
    display: 'flex',
    gap: 'var(--padding-lg-1)',
  };

  const saveButtonStyles = {
    minWidth: 'var(--width-sm-1)',
    height: 'var(--height-sm-1)',
  };

  // Additional style objects for inline sx props
  const lockIconSmallStyles = {
    fontSize: 'var(--font-size-icon-xs)',
    color: 'var(--color-white)',
  };

  const lockIconMediumStyles = {
    fontSize: 'var(--font-size-icon-sm-1)',
    color: 'var(--color-white)',
  };

  const emptyStateTextStyles = {
    color: 'var(--color-grey-light)',
    fontSize: 'var(--font-size-md)',
  };

  const chevronIconStyles = {
    fontSize: 'var(--font-size-icon-md)',
    color: 'var(--color-grey-light)',
  };

  const tableInfoContainerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
    setIsDrawerOpen(false);
    setFormData({ name: '', email: '', username: '', bio: '', phone: '' });
  };

  const handleCancel = () => {
    setIsDrawerOpen(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      username: '',
      bio: '',
      phone: '',
    });
  };

  const transformedCreators = useMemo(() => {
    const DEFAULT_AVATAR = '/assets/default-avatar.svg';

    return creators.map((creator) => {
      const assignedUser = creator.bio?.agencyTeamAccess?.[0]?.agencyTeam?.user;
      const statusValue = creator.accepted ? 'Active' : 'Pending';

      return {
        id: String(creator.id ?? creator.bio?.id ?? ''),
        name: creator.bio?.pageName ?? 'Unknown',
        status: statusValue,
        assignedTo: assignedUser?.email ?? 'Unassigned',
        avatar: creator.bio?.imageURL ?? DEFAULT_AVATAR,
      };
    });
  }, [creators]);

  const columns = useMemo(
    () => [
      { id: 'name', label: 'Name' },
      { id: 'status', label: 'Status' },
      { id: 'assignedTo', label: 'Assigned To' },
    ],
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim());
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!agencyId) {
      return;
    }

    let isMounted = true;

    const loadCreators = async () => {
      try {
        const response = await fetchCreatorsWithUnlockContentExecute({
          agencyId,
          query: debouncedSearchValue || undefined,
          limit,
          offset: currentPage * limit,
          teamId: null,
        });

        if (isMounted && response) {
          setCreators(response.getCreatorsWithUnlockContent || []);
          setTotalCreators(response.creatorsAggregate || 0);
        }
      } catch (error) {
        if (isMounted) {
          console.error('SuperlockedPage: ❌ Failed to load creators with unlock content', error);
        }
      }
    };

    void loadCreators();

    return () => {
      isMounted = false;
    };
  }, [
    agencyId,
    authLoading,
    currentPage,
    debouncedSearchValue,
    fetchCreatorsWithUnlockContentExecute,
    limit,
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCreators / limit) || 1);
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
  };
  const isLoading = authLoading || fetchCreatorsWithUnlockContentLoading;
  const isEmptyState = !isLoading && creators.length === 0;

  const startItem = totalCreators === 0 ? 0 : currentPage * limit + 1;
  const endItem = totalCreators === 0 ? 0 : Math.min(totalCreators, currentPage * limit + creators.length);

  if (!isHydrated) {
    return <Box sx={mainContainerStyles} />;
  }

  return (
    <Box sx={mainContainerStyles}>
      {showToast && (
        <Toast
          message={`You successfully added “${formData.name || 'Name'}” to your creators!`}
          visible={showToast}
          type="success"
          position="top-center"
          onClose={() => setShowToast(false)}
          sx={{}}
        />
      )}
      {/* Render table state */}
      {isLoading ? (
        <Card sx={tableCardStyles} onClick={() => {}}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              gap: 'var(--padding-lg)',
            }}
          >
            <Loader size={40} color="black" />
            <Typography variant="text-md" sx={{ color: 'var(--color-grey-light)' }}>
              Loading superlocked creators...
            </Typography>
          </Box>
        </Card>
      ) : isEmptyState ? (
        <Card onClick={() => {}} sx={emptyCardStyles}>
          <Box sx={headerStyles}>
            <Typography variant="heading-sm" sx={{ color: 'var(--color-black-secondary)' }}>
              Superlocked Creators
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Search"
              label=""
              helperText=""
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              sx={{ width: 'auto' }}
            />
          </Box>
          <Box
            sx={{
              width: '100%',
              height: 'var(--height-empty-card)',
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '32px',
              padding: 'var(--padding-3xl)',
              position: 'relative',
            }}
          >
            {/* Three Stacked Cards with Blur Effect */}
            <Box
              sx={{
                position: 'var(--position-relative)',
                width: 'var(--width-card-stack)',
                height: 'var(--height-card-stack)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Left Card */}
              <Card
                sx={{
                  position: 'var(--position-absolute)',
                  left: 'var(--position-card-left)',
                  width: 'var(--width-card-small)',
                  height: 'var(--height-card-small)',
                  border: '1px solid white',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  transform: 'var(--transform-rotate-left)',
                  zIndex: 1,
                }}
              >
                <Image
                  src="/image 49.png"
                  alt="Card image"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 'none !important',
                    filter: 'blur(2px)',
                  }}
                />
                {/* Lock Icon - Center */}
                <Box
                  sx={{
                    position: 'var(--position-absolute)',
                    top: '50%',
                    left: '50%',
                    transform: 'var(--transform-center)',
                    width: 'var(--width-icon-small)',
                    height: 'var(--height-icon-small)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                  }}
                >
                  <Lock sx={lockIconSmallStyles} />
                </Box>
              </Card>

              {/* Center Card */}
              <Card
                sx={{
                  position: 'var(--position-absolute)',
                  left: 'var(--position-card-center-left)',
                  top: 'var(--position-card-center-top)',
                  width: 'var(--width-card-small)',
                  height: 'var(--height-card-small)',
                  border: '1px solid white',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  zIndex: 3,
                }}
              >
                <Image
                  src="/image 49.png"
                  alt="Card image"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 'none !important',
                    filter: 'blur(2px)',
                  }}
                />
                {/* Lock Icon - Center */}
                <Box
                  sx={{
                    position: 'var(--position-absolute)',
                    top: '50%',
                    left: '50%',
                    transform: 'var(--transform-center)',
                    width: 'var(--width-icon-medium)',
                    height: 'var(--height-icon-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                  }}
                >
                  <Lock sx={lockIconMediumStyles} />
                </Box>
              </Card>

              {/* Right Card */}
              <Card
                sx={{
                  position: 'var(--position-absolute)',
                  right: '-20px',
                  width: '60px',
                  height: '78px',
                  border: '1px solid white',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  transform: 'rotate(10deg)',
                  zIndex: 1,
                }}
              >
                <Image
                  src="/image 49.png"
                  alt="Card image"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 'none !important',
                    filter: 'blur(2px)',
                  }}
                />
                {/* Lock Icon - Center */}
                <Box
                  sx={{
                    position: 'var(--position-absolute)',
                    top: '50%',
                    left: '50%',
                    transform: 'var(--transform-center)',
                    width: 'var(--width-icon-small)',
                    height: 'var(--height-icon-small)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                  }}
                >
                  <Lock sx={lockIconSmallStyles} />
                </Box>
              </Card>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="heading-md"
                sx={{
                  color: 'var(--color-black-secondary)',
                  fontWeight: 600,
                  fontSize: { xs: 'var(--font-size-lg)', sm: 'var(--font-size-xl)' },
                }}
              >
                No superlocked creators yet...
              </Typography>
              <Typography
                variant="text-md"
                sx={emptyStateTextStyles}
              >
                Try adjusting your search to find creators.
              </Typography>
            </Box>
          </Box>

          <Box sx={paginationContainerStyles}>
            <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)', fontSize: { xs: 'var(--font-size-sm)', sm: 'var(--font-size-md)' } }}>
              Page 1 | Total Items 0
            </Typography>
            <Box display={'flex'} gap={'var(--padding-md)'}>
              <Box sx={paginationButtonStyles}>
                <ChevronLeft sx={chevronIconStyles} />
              </Box>

              <Box sx={currentPageStyles}>1</Box>

              <Box sx={nextPageStyles}>
                <ChevronRight sx={{ fontSize: 22 }} />
              </Box>
            </Box>
          </Box>
        </Card>
      ) : (
        <Card sx={tableCardStyles} onClick={() => {}}>
          <Box sx={tableHeaderStyles}>
            <Typography variant="heading-sm" sx={{ color: 'var(--color-black-secondary)', flex: 1 }}>
              Superlocked Creators
            </Typography>
            <Box sx={searchButtonContainerStyles}>
              <TextField
                variant="outlined"
                placeholder="Search"
                label=""
                helperText=""
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                sx={{ width: 'fit-content' }}
              />
            </Box>
          </Box>

          <Box sx={tableInfoContainerStyles}>
            <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
              Showing {startItem}-{endItem} of {totalCreators} creators
            </Typography>
          </Box>

          <Box sx={tableContainerStyles}>
            <Table
              columns={columns}
              rows={transformedCreators}
              showPagination={false}
              itemsPerPage={limit}
              sx={{ pb: 'var(--padding-4xl)' }}
            />
          </Box>

          <Box sx={paginationContainerStyles}>
            <Typography variant="text-sm" sx={{ color: 'var(--color-grey-light)' }}>
              Page {currentPage + 1} of {totalPages}
            </Typography>

            <Box display={'flex'} gap={'var(--padding-md)'}>
              <Box
                sx={{
                  ...paginationButtonStyles,
                  opacity: currentPage === 0 ? 0.4 : 1,
                  pointerEvents: currentPage === 0 ? 'none' : 'auto',
                }}
                onClick={handlePrevPage}
              >
                <ChevronLeft sx={chevronIconStyles} />
              </Box>

              <Box sx={currentPageStyles}>{currentPage + 1}</Box>

              <Box
                sx={{
                  ...nextPageStyles,
                  opacity: currentPage + 1 >= totalPages ? 0.4 : 1,
                  pointerEvents: currentPage + 1 >= totalPages ? 'none' : 'auto',
                }}
                onClick={handleNextPage}
              >
                <ChevronRight sx={{ fontSize: 22 }} />
              </Box>
            </Box>
          </Box>
        </Card>
      )}

      {/* Add Creator Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleCancel} sx={drawerStyles}>
        {/* Drawer Header */}

        <Typography variant="heading-sm" sx={{ color: 'var(--color-black-secondary)' }}>
          Add Creator
        </Typography>

        {/* Form Fields */}
        <Box sx={formContainerStyles}>
          <Box sx={fieldContainerStyles}>
            <Typography variant="text-md" sx={{ color: 'var(--color-black)' }}>
              Name
            </Typography>
            <TextField
              variant="outlined"
              label=""
              placeholder="Enter name"
              helperText=""
              value={formData.name}
              onChange={handleInputChange('name')}
            />
          </Box>

          <Box sx={fieldContainerStyles}>
            <Typography variant="text-md" sx={{ color: 'var(--color-black)' }}>
              Email
            </Typography>
            <TextField
              variant="outlined"
              label=""
              placeholder="Enter Email"
              helperText=""
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
            />
          </Box>

          <Box sx={fieldContainerStyles}>
            <Typography variant="text-md" sx={{ color: 'var(--color-black)' }}>
              Username
            </Typography>
            <TextField
              variant="outlined"
              label=""
              placeholder="Enter Username"
              helperText=""
              value={formData.username}
              onChange={handleInputChange('username')}
            />
          </Box>

          <Box sx={fieldContainerStyles}>
            <Typography variant="text-md" sx={{ color: 'var(--color-black)' }}>
              Bio
            </Typography>
            <TextField
              variant="outlined"
              label=""
              placeholder="Enter Bio"
              helperText=""
              value={formData.bio}
              onChange={handleInputChange('bio')}
            />
          </Box>

          <Box sx={fieldContainerStyles}>
            <Typography variant="text-md" sx={{ color: 'var(--color-black)' }}>
              Phone number
            </Typography>
            <TextField
              variant="outlined"
              label=""
              placeholder="1 (702) 123-456"
              helperText=""
              value={formData.phone}
              onChange={handleInputChange('phone')}
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={buttonContainerStyles}>
          <Button variant="outline-sm" onClick={handleCancel} disabled={false} sx={{}}>
            Cancel
          </Button>
          <Button
            variant="primary-dark-sm"
            onClick={handleSave}
            disabled={false}
            sx={saveButtonStyles}
          >
            Save
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}

