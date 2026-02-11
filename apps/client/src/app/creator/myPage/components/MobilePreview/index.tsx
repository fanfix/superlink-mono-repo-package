'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';
import { ShareIconSvg } from '../../constants/icons';
import fontsData from '../../fonts.json';
import { styles } from './styles';
import { MobilePreviewProps } from './types';
import { ExclusiveContentSlider } from './components/ExclusiveContentSlider';
import { CustomSectionRenderer } from './components/CustomSectionRenderer';
import { TextSectionRenderer } from './components/TextSectionRenderer';
import { BrandKitRenderer } from './components/BrandKitRenderer';

export default function MobilePreview({
  pageName,
  coverImage,
  profileImage,
  introMessage,
  socialLinks = [],
  backgroundColor = 'var(--color-mypage-background-white)',
  backgroundImage,
  selectedFont = 'Inter',
  selectedTextColor = 'var(--color-mypage-text-black)',
  selectedLayout = 'layout1',
  contentItems = [],
  customSections = [],
  textSections = [],
  brandKitItems = [],
  engagements = [],
  pricing = [],
  customButtons = [],
  showReplicateCta = false,
  onReplicateClick,
  showCreateOwnPageLink = false,
  onCreateOwnPageClick,
  compactSectionLayout = false,
}: MobilePreviewProps) {
  const selectedFontData = fontsData.fonts.find((f) => f.value === selectedFont) || fontsData.fonts[0];

  const hexToRgba = (hex: string, opacity: number = 0.6): string => {
    if (hex.startsWith('var(') || hex === 'var(--color-mypage-background-white)' || hex === 'var(--color-white)') {
      return 'transparent';
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const overlayColor = hexToRgba(backgroundColor, 0.6);

  const isDarkBg = (() => {
    if (!backgroundColor) return false;
    const s = String(backgroundColor).toLowerCase();
    if (s.includes('white') || s.includes('#fff') || s === 'transparent') return false;
    if (s.includes('black') || s.includes('#000') || s.includes('181818') || s.includes('dark')) return true;
    const hex = s.match(/#([0-9a-f]{6})/)?.[1];
    if (hex) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
    }
    return false;
  })();

  return (
    <Box sx={styles.previewContainer}>
      <Box sx={styles.mobileFrame}>
        <Box sx={styles.mobileContent(backgroundColor, backgroundImage)}>
          {/* Cover Image with Overlays */}
          <Box sx={styles.coverImageContainer}>
            {coverImage ? (
              <Box component="img" src={coverImage} alt="Cover" sx={styles.coverImage} />
            ) : (
              <Box sx={styles.coverImageTransparent} />
            )}

            {/* Share Button - Top Right */}
            <Box sx={styles.shareButton}>
              <ShareIconSvg sx={styles.shareIcon} />
            </Box>

            {/* Bottom Blur Gradient - Only bottom line blur */}
            <Box sx={styles.bottomBlurGradient(backgroundColor, backgroundImage)} />

            {/* Layout 1: Profile Image Centered, Name Below */}
            {selectedLayout === 'layout1' && (
              <>
                <Box sx={styles.profileImageContainer}>
                  {profileImage ? (
                    <Box component="img" src={profileImage} alt="Profile" sx={styles.profileImage} />
                  ) : (
                    <Box sx={styles.profileImageCentered}>
                      <img
                        src="/assets/Client/user_icon.svg"
                        alt="User Icon"
                        style={styles.userIconImage}
                      />
                    </Box>
                  )}
                </Box>
                <Typography sx={styles.pageNameLayout1(selectedTextColor)}>{pageName}</Typography>
                {introMessage && (
                  <Box
                    sx={styles.introMessageLayout1(selectedTextColor, selectedFontData.family)}
                    dangerouslySetInnerHTML={{ __html: introMessage }}
                  />
                )}
              </>
            )}

            {/* Layout 2: Profile Image Left, Name Right */}
            {selectedLayout === 'layout2' && (
              <>
                <Box sx={styles.layout2OverlayContainer}>
                  <Box sx={styles.profileImageContainerLayout2}>
                    {profileImage ? (
                      <Box component="img" src={profileImage} alt="Profile" sx={styles.profileImage} />
                    ) : (
                      <Box sx={styles.profileImageCentered}>
                        <img
                          src="/assets/Client/user_icon.svg"
                          alt="User Icon"
                          style={styles.userIconImage}
                        />
                      </Box>
                    )}
                  </Box>
                  <Box sx={styles.layout2RightContainer}>
                    <Typography sx={styles.pageNameLayout2(selectedTextColor, selectedFontData.family)}>
                      {pageName}
                    </Typography>
                    {introMessage && (
                      <Box
                        sx={styles.introMessageLayout2(selectedTextColor, selectedFontData.family)}
                        dangerouslySetInnerHTML={{ __html: introMessage }}
                      />
                    )}
                  </Box>
                </Box>
              </>
            )}
          </Box>

          {/* Social Icons - black circle + white icon (mono) in mobile preview */}
          {socialLinks.length > 0 && (
            <Box sx={styles.socialIconsContainer}>
              {socialLinks.map((link, index) => (
                <Box
                  key={index}
                  component="a"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={styles.socialIconCircle}
                >
                  {link.icon}
                </Box>
              ))}
            </Box>
          )}

          {/* Custom Buttons - Below Social Icons */}
          {customButtons.length > 0 && (
            <Box sx={styles.customButtonsContainer}>
              {customButtons.map((button) => (
                <Box
                  key={button.id}
                  component="a"
                  href={button.type === 'email' ? `mailto:${button.value}` : button.value}
                  target={button.type === 'url' ? '_blank' : undefined}
                  rel={button.type === 'url' ? 'noopener noreferrer' : undefined}
                  sx={styles.customButton}
                >
                  <Typography sx={styles.customButtonText}>{button.buttonText}</Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Content Area */}
          <Box sx={styles.contentArea}>
            {/* Exclusive Content Cards */}
            {contentItems.length > 0 && <ExclusiveContentSlider items={contentItems} coverImage={coverImage} />}

            {/* Custom Sections */}
            {customSections.map((section) => (
              <CustomSectionRenderer key={section.id} section={section} compactLayout={compactSectionLayout} />
            ))}

            {/* Text Sections */}
            {textSections.map((section) => (
              <TextSectionRenderer key={section.id} section={section} />
            ))}

            {/* Brand Kit Items with Engagements and Pricing inside */}
            {brandKitItems.length > 0 && (
              <BrandKitRenderer 
                items={brandKitItems} 
                engagements={engagements}
                pricing={pricing}
                pageName={pageName}
              />
            )}
          </Box>

          {/* Order: Replicate CTA → SuperLink Logo → Create Your Own Page (matches mobile preview) */}
          {showReplicateCta && (
            <>
              <Box sx={styles.replicateCtaContainer(isDarkBg)}>
                <Box sx={styles.replicateCtaLabels}>
                  <Typography sx={styles.replicateCtaLine1(isDarkBg)}>Like this profile?</Typography>
                  <Typography sx={styles.replicateCtaLine2(isDarkBg)}>Replicate it.</Typography>
                </Box>
                <Box
                  component="button"
                  type="button"
                  sx={styles.replicateCtaButton(isDarkBg)}
                  onClick={onReplicateClick ?? (() => {})}
                >
                  Replicate this profile
                </Box>
              </Box>
              <Box sx={styles.footer}>
                <img src="/assets/landing/asset 0.svg" alt="SuperLink Logo" style={styles.footerLogo(isDarkBg) as React.CSSProperties} />
              </Box>
              {showCreateOwnPageLink && (
                <Box sx={styles.createOwnPageLinkWrap}>
                  <Box
                    component="button"
                    type="button"
                    sx={styles.createOwnPageLink(isDarkBg)}
                    onClick={onCreateOwnPageClick ?? (() => {})}
                  >
                    Create your own page
                  </Box>
                </Box>
              )}
            </>
          )}

          {/* SuperLink Logo Footer - when replicate CTA is hidden */}
          {!showReplicateCta && (
            <Box sx={styles.footer}>
              <img src="/assets/landing/asset 0.svg" alt="SuperLink Logo" style={styles.footerLogo(isDarkBg) as React.CSSProperties} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
