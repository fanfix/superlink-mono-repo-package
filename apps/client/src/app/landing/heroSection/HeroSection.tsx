'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Button, Typography, TextField } from '@superline/design-system';
import { ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Hero1Image from '../../../assets/landing/Slider1.webp';
import Hero2Image from '../../../assets/landing/Slider2.webp';
import Hero3Image from '../../../assets/landing/Slider3.webp';

interface TestimonialSlide {
  image: any;
  text: string;
}

const testimonials: TestimonialSlide[] = [
  {
    image: Hero1Image,
    text: 'Sell any content directly in your link in bio',
  },
 
  {
    image: Hero3Image,
    text: 'Interact with fans directy in your link in bio',
   
  },
  {
    image: Hero2Image,
    text: "One Link in Bio infinite Possibilities",
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [username, setUsername] = useState('');

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClaimAccount = () => {
    if (username.trim()) {
      router.push(`/signup?username=${username.trim()}`);
    } else {
      router.push('/signup');
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Styling variables
  const heroContainerStyles = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: { xs: '40px var(--padding-2xl)', md: '30px var(--padding-2xl)' },
  };

  const sliderContainerStyles = {
    maxWidth: { xs: '100%', md: '50%' },
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 'var(--border-radius-lg)',
  };

  const sliderWrapperStyles = {
    display: 'flex',
    width: `${testimonials.length * 100}%`,
    transform: `translateX(-${currentSlide * (100 / testimonials.length)}%)`,
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const slideItemStyles = {
    width: `${100 / testimonials.length}%`,
    flexShrink: 0,
    position: 'relative',
    aspectRatio: { xs: '4/5', md: '3/4' },
    minHeight: { xs: '320px', md: '480px' },
    maxHeight: { xs: '320px', md: '500px' },
    display: 'flex',
    flexDirection: 'column',
  };

  const imageContainerStyles = {
    width: '100%',
    flex: 1,
    position: 'relative',
    backgroundColor: 'var(--color-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const textContainerStyles = {
    width: '100%',
    backgroundColor: 'var(--color-white)',
    padding: { xs: 'var(--padding-lg-1)', md: '30px 100px' },
    borderBottomLeftRadius: 'var(--border-radius-lg)',
    borderBottomRightRadius: 'var(--border-radius-lg)',
  };

  const titleStyles = {
    fontSize: { xs: '23px', sm: '20px', md: '40px' },
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-black)',
    textAlign: 'center',
    lineHeight: 'var(--line-height-tight)',
  };

  const inputSectionStyles = {
    width: '100%',
    maxWidth: { xs: '100%', sm: '600px', md: '700px' },
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 'var(--padding-lg-1)', sm: 'var(--padding-lg)' },
    alignItems: 'stretch',
  };

  const inputContainerStyles = {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-white-sidebar)',
    borderRadius: 'var(--border-radius-full)',
    padding: '10px',
    height: { xs: '48px', md: '60px' },
  };

  const prefixTextStyles = {
    fontSize: { xs: 'var(--font-size-md)', md: 'var(--font-size-md-1)' },
    color: 'var(--color-pagination-border)',
    fontWeight: 'var(--font-weight-semibold)',
    marginRight: 'var(--padding-md)',
    whiteSpace: 'nowrap',
  };

  const textFieldStyles = {
    flex: 1,
    backgroundColor: 'transparent',
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'transparent',
      borderRadius: '0',
      height: '100%',
      paddingLeft: 0,
      paddingRight: 'var(--padding-lg-1)',
      fontSize: { xs: 'var(--font-size-md)', md: 'var(--font-size-md-1)' },
      color: 'var(--color-pagination-border)',
      '& fieldset': {
        border: 'none',
      },
      '&:hover fieldset': {
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        border: 'none',
      },
      '& .MuiOutlinedInput-input': {
        padding: 0,
        fontSize: { xs: 'var(--font-size-md)', md: 'var(--font-size-md-1)' },
        fontWeight: 'var(--font-weight-medium)',
        '&::placeholder': {
          color: 'var(--color-gray-400)',
          opacity: 1,
          fontSize: { xs: 'var(--font-size-md)', md: 'var(--font-size-md-1)' },
          fontWeight: 'var(--font-weight-medium)',
        },
      },
    },
  };

  const claimButtonStyles = {
    borderRadius: '40px',
    height: { xs: '48px', md: '45px' },
    padding: { xs: '0 var(--padding-2xl)', md: '0px var(--padding-xl)' },
    fontSize: { xs: 'var(--font-size-md)', md: 'var(--font-size-md-1)' },
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    minWidth: { xs: 'auto', sm: '160px' },
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
    '&:hover': {
      backgroundColor: '#1a1a1a',
    },
  };

  const arrowIconStyles = {
    fontSize: '18px',
    transform: 'rotate(-45deg)',
    marginLeft: 'var(--padding-xs)',
  };

  const paginationContainerStyles = {
    display: 'flex',
    gap: 'var(--padding-md)',
    marginTop: { xs: 'var(--padding-3xl)', md: '40px' },
    alignItems: 'center',
  };

  const getPaginationDotStyles = (isActive: boolean) => ({
    width: isActive ? 'var(--padding-2xl)' : 'var(--padding-md)',
    height: 'var(--padding-md)',
    borderRadius: 'var(--padding-xs)',
    backgroundColor: isActive ? 'var(--color-grey-light)' : 'var(--color-gray-300)',
    cursor: 'pointer',
    transition: 'all var(--transition-normal)',
    '&:hover': {
      backgroundColor: isActive ? '#1a1a1a' : 'var(--color-gray-400)',
    },
  });

  return (
    <Box sx={heroContainerStyles}>
      {/* Testimonial Slider */}
      <Box sx={sliderContainerStyles}>
        {/* Slider Wrapper - Horizontal sliding container */}
        <Box sx={sliderWrapperStyles}>
          {testimonials.map((testimonial, index) => (
            <Box key={index} sx={slideItemStyles}>
              {/* Image Container */}
              <Box sx={imageContainerStyles}>
                <Image
                  src={testimonial.image}
                  alt={testimonial.text}
                  fill
                  style={{
                    objectFit: 'contain',
                  }}
                  priority={index === 0}
                />
              </Box>

              {/* Text Container Below Image - Show for all slides */}
              <Box sx={textContainerStyles}>
                <Typography variant="h1" sx={titleStyles}>
                  {testimonial.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Input and Button Section */}
      <Box sx={inputSectionStyles}>
        {/* Input Field */}
        <Box sx={inputContainerStyles}>
          <Typography variant="body2" sx={prefixTextStyles}>
            Superlink.io/
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Claim your profile now"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleClaimAccount();
              }
            }}
            sx={textFieldStyles}
          />
          {/* Claim Account Button */}
          <Button
            variant="primary-dark"
            onClick={handleClaimAccount}
            sx={claimButtonStyles}
          >
            Claim account
            <ArrowForward sx={arrowIconStyles} />
          </Button>
        </Box>
      </Box>

      {/* Pagination Dots */}
      <Box sx={paginationContainerStyles}>
        {testimonials.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={getPaginationDotStyles(index === currentSlide)}
          />
        ))}
      </Box>
    </Box>
  );
}

