'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import MobilePreview from '../creator/myPage/components/MobilePreview';
import type {
  ContentItem,
  CustomSection,
  TextSection,
  BrandKitItem,
  Engagement,
  Pricing,
} from '../creator/myPage/components/MobilePreview/types';
import type { PublicUser } from '../../api/types';
import { useGetPublicUser } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import { getSocialIconMono } from '../creator/myPage/components/sections/SocialLinksSection/utils/getSocialIcon';
import { ReplicationWarningModal } from '../../components/ReplicationWarningModal';
import { LoginModal } from '../../components/LoginModal';


// -----------------------------------------------------------------------------
// Helpers: API bio → MobilePreview props
// -----------------------------------------------------------------------------

function bioToPreviewProps(user: PublicUser): ReturnType<typeof buildPreviewProps> | null {
  const bio = user.bio;
  if (!bio) return null;

  const selectedLayout = bio.layoutForAvatarAndBio === 'horizontal' ? 'layout2' : 'layout1';

  const customSections: CustomSection[] = (bio.customSections || [])
    .filter((s) => s.sectionType !== 'unlock_content' && s.sectionType !== 'brand_kit')
    .map((section) => ({
      id: section.id,
      name: section.name,
      layout:
        section.rowMode === 'parallel_row'
          ? 'parallel-row'
          : section.rowMode === 'slider'
            ? 'row'
            : 'list',
      useContentImageAsBackground: false,
      sectionType: section.sectionType as CustomSection['sectionType'],
      items: (section.sectionLinks || []).map((link) => ({
        id: link.id,
        title: link.name,
        url: link.url,
        imageUrl: link.imageURL,
        price: '',
        isEmail: link.isEmail ?? false,
        ...(link.content != null && link.content !== '' && { content: link.content }),
      })),
    }));

  const textSections: TextSection[] = (bio.customSections || [])
    .filter((s) => s.sectionType === 'email' || s.sectionType === 'text')
    .map((section) => {
      const firstLink = (section.sectionLinks || [])[0];
      return {
        id: section.id,
        title: section.name,
        content: firstLink?.content ?? firstLink?.url ?? '',
        type: (section.sectionType === 'email' ? 'email' : 'text') as 'email' | 'text',
      };
    });

  let brandKitItems: BrandKitItem[] = [];
  let engagements: Engagement[] = [];
  let pricing: Pricing[] = [];
  const brandKitSection = (bio.customSections || []).find((s) => s.sectionType === 'brand_kit');
  if (brandKitSection?.brandKit) {
    const kit = brandKitSection.brandKit;
    if (kit.bannerImageURL) {
      brandKitItems = [{ id: kit.id, thumbnailUrl: kit.bannerImageURL, description: kit.description }];
    }
    engagements = (kit.engagements || []).map((e) => ({ id: e.id, title: e.title, count: e.count }));
    pricing = (kit.kitItems || []).map((p) => ({
      id: p.id,
      title: p.title,
      price: (p.price / 100).toString(),
    }));
  }

  return buildPreviewProps(bio, {
    selectedLayout,
    customSections,
    textSections,
    brandKitItems,
    engagements,
    pricing,
  });
}

function buildPreviewProps(
  bio: NonNullable<PublicUser['bio']>,
  overrides: {
    selectedLayout: 'layout1' | 'layout2';
    customSections: CustomSection[];
    textSections: TextSection[];
    brandKitItems: BrandKitItem[];
    engagements: Engagement[];
    pricing: Pricing[];
  }
) {
  const customButtons = (bio.customButtons || []).map((btn) => ({
    id: btn.id,
    buttonText: btn.name,
    type: (btn.isEmail ? 'email' : 'url') as 'email' | 'url',
    value: btn.url,
    isActive: true,
  }));

  const socialLinks = (bio.socialLinks || []).map((link) => ({
    platform: link.name || 'link',
    url: link.url,
    icon: getSocialIconMono(link.name || 'link', 16),
  }));

  return {
    pageName: (bio.pageName || bio.username || 'Profile') as string,
    coverImage: bio.bannerImageURL || undefined,
    profileImage: bio.imageURL || undefined,
    introMessage: bio.introMessage || undefined,
    socialLinks,
    backgroundColor: bio.backgroundColor || 'var(--color-mypage-background-white)',
    backgroundImage: bio.backgroundImageURL || undefined,
    selectedFont: bio.pageFont || 'Inter',
    selectedTextColor: bio.textColor || 'var(--color-mypage-text-black)',
    contentItems: [] as ContentItem[],
    customButtons,
    ...overrides,
  };
}

// -----------------------------------------------------------------------------
// Layout styles (one place to tweak)
// -----------------------------------------------------------------------------

const layoutStyles = {
  root: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--color-gray-100)',
  },
  previewWrapper: {
    width: '100%',
   
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    flexShrink: 0,
  },
  centeredMessage: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
   
  },
} as const;

// -----------------------------------------------------------------------------
// Page component
// -----------------------------------------------------------------------------

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = typeof params?.username === 'string' ? params.username : '';

  const { execute: fetchUser, loading, error, data: user } = useGetPublicUser({ throwOnError: false });
  const { isAuthenticated } = useAuth();
  const [replicationWarningOpen, setReplicationWarningOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    if (username) fetchUser(username);
  }, [username, fetchUser]);

  const previewProps = useMemo(() => (user ? bioToPreviewProps(user) : null), [user]);

  const handleReplicateClick = useCallback(() => {
    if (isAuthenticated) setReplicationWarningOpen(true);
    else setLoginModalOpen(true);
  }, [isAuthenticated]);

  const handleLoginContinue = useCallback(
    (phoneE164: string) => {
      setLoginModalOpen(false);
      const replicate = username ? `&replicate=${encodeURIComponent(username)}` : '';
      router.push(`/otp-verify?phone=${encodeURIComponent(phoneE164)}${replicate}`);
    },
    [username, router]
  );

  const closeReplicationWarning = useCallback(() => setReplicationWarningOpen(false), []);
  const closeLoginModal = useCallback(() => setLoginModalOpen(false), []);

  // Early exits: invalid URL, loading, error, no content
  if (!username) {
    return (
      <Box sx={layoutStyles.centeredMessage}>
        <Typography color="text.secondary">Invalid profile URL.</Typography>
      </Box>
    );
  }
  if (loading && !user) {
    return (
      <Box sx={layoutStyles.centeredMessage}>
        <CircularProgress />
      </Box>
    );
  }
  if (error || !user) {
    return (
      <Box sx={layoutStyles.centeredMessage}>
        <Typography color="error">Profile not found or failed to load.</Typography>
      </Box>
    );
  }
  if (!previewProps) {
    return (
      <Box sx={layoutStyles.centeredMessage}>
        <Typography color="text.secondary">No profile content.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={layoutStyles.root}>
        <Box sx={layoutStyles.previewWrapper}>
          <MobilePreview
            {...previewProps}
            showReplicateCta
            onReplicateClick={handleReplicateClick}
            showCreateOwnPageLink
            onCreateOwnPageClick={() => router.push('/signup')}
          />
        </Box>
      </Box>
      <ReplicationWarningModal open={replicationWarningOpen} onClose={closeReplicationWarning} />
      <LoginModal open={loginModalOpen} onClose={closeLoginModal} onContinue={handleLoginContinue} />
    </>
  );
}
