import React, { useState } from 'react';
import { Box, OutlinedInput, IconButton } from '@mui/material';
import { Typography } from '@superline/design-system';
import { Email as EmailIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { TextSection } from '../types';
import { styles } from './styles';

interface TextSectionRendererProps {
  section: TextSection;
}

export function TextSectionRenderer({ section }: TextSectionRendererProps) {
  const [emailValue, setEmailValue] = useState('');
  
  // Check if this is an email section - use type field if available, otherwise check title
  const isEmailSection = section.type === 'email' || 
    (section.type === undefined && (section.title.toLowerCase() === 'social' || section.title.toLowerCase() === 'email'));
  
  const handleEmailSubmit = () => {
    if (emailValue.trim()) {
      window.location.href = `mailto:${emailValue.trim()}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailSubmit();
    }
  };

  if (isEmailSection) {
    return (
      <Box sx={styles.emailSection}>
        <Typography sx={styles.emailSectionTitle}>{section.title}</Typography>
        <Box sx={styles.emailInputContainer}>
          <EmailIcon sx={styles.emailInputIcon} />
          <OutlinedInput
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="example@domain.com"
            type="email"
            sx={styles.emailInput}
            fullWidth
          />
          <IconButton
            onClick={handleEmailSubmit}
            disabled={!emailValue.trim()}
            sx={styles.emailSubmitButton}
            size="small"
          >
            <ArrowForwardIcon sx={{ fontSize: '16px', color: 'var(--color-white)' }} />
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={styles.textSection}>
      <Typography sx={styles.textSectionTitle}>{section.title}</Typography>
      <Typography sx={styles.textSectionContent}>{section.content}</Typography>
    </Box>
  );
}

