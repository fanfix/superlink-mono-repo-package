'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import { Typography, Button } from '@superline/design-system';
import { MoreVert as MoreVertIcon, Add as AddIcon, Image as ImageIcon } from '@mui/icons-material';
import UploadContentModal from '../../UploadContentModal';
import type { UploadContentData } from '../../UploadContentModal/types';
import VerifiedCreatorModal from '../../modals/VerifiedCreatorModal';
import { styles } from './styles';
import { useGetStripeConnect } from '../../../../../../hooks/usePaymentApi';

interface ExclusiveContentSectionProps {
  coverImage?: string;
  onAddContent?: (data: UploadContentData) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export default function ExclusiveContentSection({
  coverImage,
  onAddContent,
  dragHandleProps = {},
}: ExclusiveContentSectionProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVerifiedCreatorModalOpen, setIsVerifiedCreatorModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(coverImage || null);

  const { execute: getStripeConnect, loading: stripeLoading } = useGetStripeConnect();

  const handleAddContent = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadComplete = (data: UploadContentData) => {
    if (data.file) {
      const imageUrl = URL.createObjectURL(data.file);
      setSelectedImage(imageUrl);
    }
    if (onAddContent) {
      onAddContent(data);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const displayImage = selectedImage || coverImage;

  const handleStripeConnect = useCallback(() => {
    // Debug: verify button click is firing
    // eslint-disable-next-line no-console
    console.log('[ExclusiveContentSection] Connect Stripe button clicked');
    setIsVerifiedCreatorModalOpen(true);
  }, []);

  const handleStripeConnectContinue = useCallback(async () => {
    try {
      // Debug: verify modal Continue is firing
      // eslint-disable-next-line no-console
      console.log('[ExclusiveContentSection] VerifiedCreatorModal Continue clicked – calling useGetStripeConnect');

      const res = await getStripeConnect();
      // eslint-disable-next-line no-console
      console.log('[ExclusiveContentSection] Stripe connect response', res);
      const url = res?.url;
      const transferAllowed = !!res?.transferAllowed;

      if (!url) {
        throw new Error('Stripe connect URL not received');
      }

      if (typeof window !== 'undefined') {
        // Remember where to come back after Stripe
        sessionStorage.setItem('stripe_connect_redirect', '/creator/myPage');
      }

      if (transferAllowed) {
        window.open(url, '_blank');
        return;
      }

      window.location.href = url;
    } catch (err) {
      // For now we just log; UI can be enhanced later with visible errors
      // eslint-disable-next-line no-console
      console.error('Failed to start Stripe connect from ExclusiveContentSection', err);
    }
  }, [getStripeConnect]);

  return (
    <>
      <Box sx={styles.container}>
        <Box sx={styles.header}>
          <Typography sx={styles.title}>Exclusive Content</Typography>
          <Box {...(dragHandleProps || {})} sx={styles.dragHandle}>
            <MoreVertIcon sx={styles.dragHandleIcon} />
          </Box>
        </Box>

        <Box sx={styles.contentArea}>
          <Box sx={styles.imagePlaceholder}>
            <Box
              sx={styles.smallImageContainer}
              onClick={handleImageClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleImageClick();
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              {displayImage ? (
                <Box component="img" src={displayImage} alt="Exclusive Content" sx={styles.smallImage} />
              ) : (
                <Box sx={styles.emptyImagePlaceholder}>
                  <ImageIcon sx={styles.imageIcon} />
                </Box>
              )}
              <Box sx={styles.imageIconOverlay}>
                <ImageIcon sx={styles.smallImageIcon} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Button variant="primary-dark" onClick={handleAddContent} sx={styles.addContentButton}>
          <AddIcon sx={styles.addIcon} />
          Add Content
        </Button>

        <Button
          variant="primary-dark"
          onClick={handleStripeConnect}
          sx={styles.stripeButton}
          disabled={stripeLoading}
        >
          <Box component="span" sx={styles.stripeLogo}>S</Box>
          Connect Stripe and Activate Section
        </Button>
      </Box>

      <UploadContentModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAdd={handleUploadComplete}
        hideTitleColor
      />

      <VerifiedCreatorModal
        open={isVerifiedCreatorModalOpen}
        onClose={() => setIsVerifiedCreatorModalOpen(false)}
        onContinue={handleStripeConnectContinue}
      />
    </>
  );
}
