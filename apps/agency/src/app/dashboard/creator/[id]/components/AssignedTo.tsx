"use client";

import React from 'react';
import { Box } from '@mui/material';
import { Typography, Image } from '@superline/design-system';
import { styled } from '@mui/material/styles';

const AssignedToContainer = styled(Box)(({ theme }) => ({
  marginBottom: 'var(--padding-md)',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginBottom: 'var(--padding-lg)',
  },
  [theme.breakpoints.up('md')]: {
    marginBottom: 'var(--padding-xl)',
  },
}));

const AssignedToTitle = styled(Typography)(({ theme }) => ({
  color: 'var(--color-black-secondary)',
  marginBottom: 'var(--padding-md)',
  fontSize: '16px',
  fontWeight: 600,
  [theme.breakpoints.up('sm')]: {
    marginBottom: 'var(--padding-lg)',
    fontSize: '17px',
  },
  [theme.breakpoints.up('md')]: {
    marginBottom: 'var(--padding-xl)',
    fontSize: 'var(--font-size-heading-sm)',
  },
}));

const AssignedToInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--padding-md)'
});

const AssignedToDetails = styled(Box)({
  display: 'flex',
  flexDirection: 'column'
});

const AssignedToName = styled(Typography)({
  color: 'var(--color-black-secondary)',
  fontWeight: 600,
  marginBottom: 'var(--padding-xs)',
  fontSize: 'var(--font-size-lg)'
});

const AssignedToEmail = styled(Typography)({
  color: 'var(--color-grey-light)',
  fontSize: 'var(--font-size-md)'
});

interface AssignedToProps {
  assignedTo: string;
  assignedEmail: string;
  assignedAvatar: string;
  teamMembers?: Array<{
    id: string;
    name?: string | null;
    email?: string | null;
    imageURL?: string | null;
  }>;
}

export default function AssignedTo({ assignedTo, assignedEmail, assignedAvatar, teamMembers }: AssignedToProps) {
  // Use teamMembers if available, otherwise fall back to single assigned user
  const displayMembers = teamMembers && teamMembers.length > 0 
    ? teamMembers 
    : [{ name: assignedTo, email: assignedEmail, imageURL: assignedAvatar }];

  // Helper function to get image source for each member
  const getMemberImageSrc = (member: typeof displayMembers[0]) => {
    // Check if member has a valid imageURL
    if (member.imageURL && 
        member.imageURL.trim() !== '' && 
        member.imageURL !== 'null' && 
        member.imageURL !== 'undefined') {
      return member.imageURL;
    }
    // If no valid imageURL, use default avatar
    return '/assets/default-avatar.svg';
  };

  return (
    <AssignedToContainer>
      <AssignedToTitle>Assigned To</AssignedToTitle>
      
      {displayMembers.map((member, index) => (
        <AssignedToInfo 
          key={(member as any).id || index} 
          sx={{ marginBottom: index < displayMembers.length - 1 ? 'var(--padding-lg)' : 0 }}
        >
          <Image
            src={getMemberImageSrc(member)}
            alt={member.name || assignedTo}
            sx={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: 'none',
              outline: 'none',
              boxShadow: 'none'
            }}
          />
          <AssignedToDetails>
            <AssignedToName>{member.name || assignedTo}</AssignedToName>
            <AssignedToEmail>{member.email || assignedEmail}</AssignedToEmail>
          </AssignedToDetails>
        </AssignedToInfo>
      ))}
    </AssignedToContainer>
  );
}
