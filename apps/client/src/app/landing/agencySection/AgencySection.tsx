'use client';

import React, { useRef, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Typography } from '@superline/design-system';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Image from 'next/image';

// Import images for Agency Section
import Asset16Image from '../../../assets/landing/asset 16.png';
import Asset18Image from '../../../assets/landing/asset 18.png';
import Asset19Image from '../../../assets/landing/asset 19.png';
import Asset20Image from '../../../assets/landing/asset 20.png';
import Asset21Image from '../../../assets/landing/asset 21.png';
import Asset22Image from '../../../assets/landing/asset 22.png';
import Asset23Image from '../../../assets/landing/asset 23.png';
import Asset24Image from '../../../assets/landing/asset 24.png';

interface AgencyCard {
  id: number;
  image: any;
  heading: string;
  description: string;
}

const agencyCards: AgencyCard[] = [
  {
    id: 1,
    image: Asset16Image,
    heading: 'Agency Portal',
    description: 'Manage all your creators from a single dashboard. Track revenue, unlock rates, and performance metrics in one place.',
  },
  {
    id: 2,
    image: Asset18Image,
    heading: 'Analytics',
    description: 'Comprehensive analytics dashboard to track total revenue, visits, clicks, and conversion rates across all your creators.',
  },
  {
    id: 3,
    image: Asset19Image,
    heading: 'Increased Conversions',
    description: 'Boost your conversion rates with advanced tracking and optimization tools that help you maximize revenue.',
  },
  {
    id: 4,
    image: Asset20Image,
    heading: 'Creator Management',
    description: 'Easily manage multiple creators, assign roles, and monitor their performance from a centralized platform.',
  },
  {
    id: 5,
    image: Asset21Image,
    heading: 'Revenue Tracking',
    description: 'Real-time revenue tracking and reporting to help you make data-driven decisions and grow your agency.',
  },
  {
    id: 6,
    image: Asset22Image,
    heading: 'Team Collaboration',
    description: 'Collaborate with your team members and assign tasks to manage your creators more effectively.',
  },
  {
    id: 7,
    image: Asset23Image,
    heading: 'Custom Branding',
    description: 'White-label solution with custom branding options to match your agency\'s identity and style.',
  },
  {
    id: 8,
    image: Asset24Image,
    heading: 'Advanced Reports',
    description: 'Generate detailed reports with insights and analytics to share with clients and stakeholders.',
  },
];

export default function AgencySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Scroll by card width + gap
      const newScrollLeft =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  React.useEffect(() => {
    // Initial check after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      
      return () => {
        clearTimeout(timer);
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, []);

  // Styling variables
  const sectionContainerStyles = {
    width: '100%',
    padding: { xs: '60px var(--padding-2xl)', md: '100px 48px' },
    backgroundColor: 'var(--color-white)',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: { xs: 'var(--padding-3xl)', md: 'var(--margin-2xl)' },
    paddingX: { xs: 0, md: 'var(--padding-2xl)' },
  };

  const titleStyles = {
    fontSize: { xs: '32px', md: '48px' },
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-black)',
    lineHeight: 'var(--line-height-tight)',
  };

  const navigationArrowsStyles = {
    display: 'flex',
    gap: 'var(--padding-md)',
    alignItems: 'center',
  };

  const getIconButtonStyles = (enabled: boolean) => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: enabled ? 'var(--color-black)' : 'var(--color-gray-400)',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: 'var(--color-gray-400)',
    },
    transition: 'all var(--transition-normal)',
  });

  const arrowIconStyles = {
    fontSize: 'var(--font-size-md-1)',
    marginLeft: 'var(--padding-xs)',
  };

  const scrollContainerStyles = {
    display: 'flex',
    gap: { xs: 'var(--padding-lg-1)', md: 'var(--padding-2xl)' },
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollBehavior: 'smooth',
    scrollbarWidth: 'none', // Firefox
    '&::-webkit-scrollbar': {
      display: 'none', // Chrome, Safari
    },
    paddingX: { xs: 0, md: 'var(--padding-2xl)' },
    paddingY: 'var(--padding-md)',
  };

  return (
    <Box sx={sectionContainerStyles}>
      {/* Header with Title and Navigation Arrows */}
      <Box sx={headerStyles}>
        {/* Title */}
        <Typography variant="h2" sx={titleStyles}>
          Agencies
        </Typography>

        {/* Navigation Arrows */}
        <Box sx={navigationArrowsStyles}>
          <IconButton
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            sx={getIconButtonStyles(canScrollLeft)}
          >
            <ArrowBackIos sx={arrowIconStyles} />
          </IconButton>

          <IconButton
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            sx={getIconButtonStyles(canScrollRight)}
          >
            <ArrowForwardIos sx={{ fontSize: 'var(--font-size-md-1)' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Scrollable Cards Container */}
      <Box ref={scrollContainerRef} sx={scrollContainerStyles}>
        {agencyCards.map((card) => {
          const cardStyles = {
            minWidth: { xs: '280px', sm: '320px', md: '380px' },
            maxWidth: { xs: '280px', sm: '320px', md: '380px' },
            height: { xs: '400px', md: '480px' },
            position: 'relative',
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden',
            cursor: 'pointer',
            border: '1px solid var(--color-border-light)',
            backgroundColor: 'transparent',
            transition: 'all var(--transition-normal)',
            '&:hover': {
              '& .image-wrapper': {
                transform: 'scale(1.1)',
              },
              '& .heading-wrapper': {
                transform: 'translate3d(0, -75px, 0)',
              },
              '& .description-text': {
                maxHeight: '150px',
                opacity: 1,
              },
            },
          };

          const imageContainerStyles = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden',
            backgroundColor: 'transparent',
          };

          const imageWrapperStyles = {
            width: '100%',
            height: '100%',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          };

          const contentOverlayStyles = {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: { xs: 'var(--padding-2xl) var(--padding-xl) var(--padding-xl)', md: '30px var(--padding-2xl) var(--padding-2xl)' },
            paddingBottom: { xs: 'var(--padding-lg-1)', md: 'var(--padding-xl)' },
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            zIndex: 1,
            minHeight: { xs: '140px', md: '160px' },
            overflow: 'hidden',
          };

          const headingWrapperStyles = {
            position: 'relative',
            zIndex: 2,
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: 'translate3d(0, 0, 0)',
            marginTop: 'auto',
            willChange: 'transform',
          };

          const headingStyles = {
            fontSize: { xs: '18px', md: 'var(--padding-xl)' },
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-black)',
            lineHeight: 'var(--line-height-snug)',
          };

          const descriptionStyles = {
            position: 'absolute',
            bottom: { xs: 'var(--padding-lg-1)', md: 'var(--padding-xl)' },
            left: { xs: 'var(--padding-xl)', md: 'var(--padding-2xl)' },
            right: { xs: 'var(--padding-xl)', md: 'var(--padding-2xl)' },
            fontSize: { xs: 'var(--font-size-md)', md: '15px' },
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--color-black)',
            lineHeight: 'var(--line-height-relaxed)',
            maxHeight: 0,
            overflow: 'hidden',
            opacity: 0,
            transform: 'translateY(0)',
            transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s, opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s',
            zIndex: 1,
          };

          return (
            <Box key={card.id} className="agency-card" sx={cardStyles}>
              {/* Image Container - Full Card Background */}
              <Box sx={imageContainerStyles}>
                <Box className="image-wrapper" sx={imageWrapperStyles}>
                  <Image
                    src={card.image}
                    alt={card.heading}
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </Box>

              {/* Content Overlay - Bottom of Card */}
              <Box sx={contentOverlayStyles}>
                {/* Heading - At Bottom, Moves Up on Hover */}
                <Box className="heading-wrapper" sx={headingWrapperStyles}>
                  <Typography variant="h3" sx={headingStyles}>
                    {card.heading}
                  </Typography>
                </Box>

                {/* Description Text - Shows on Hover with Delay, Always Below Heading */}
                <Typography className="description-text" variant="body1" sx={descriptionStyles}>
                  {card.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

