'use client';

import { Box, IconButton, Typography } from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import FilterListRounded from '@mui/icons-material/FilterListRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';

export interface MessageStat {
  label: string;
  value: string;
  color: string;
}

interface MessageStatsBarProps {
  stats: MessageStat[];
  loading?: boolean;
}

// Style variables
const statsBarContainerStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingInline: { xs: 'var(--padding-insights-xl)', md: 'var(--padding-insights-4xl)' },
  paddingTop: { xs: 'var(--padding-lg-1)', md: 'var(--padding-3xl)' },
  paddingBottom: { xs: 'var(--padding-insights-xl)', md: 'var(--padding-3xl)' },
  gap: 'var(--padding-lg-1)',
  borderBottom: '1px solid var(--color-black-overlay-08)',
  backgroundColor: 'var(--color-white)',
};

const statsContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 'var(--spacing-insights-gap-md)',
  fontSize: 'var(--font-size-lg)',
  fontWeight: 600,
};

const statValueStyles = {
  fontSize: { xs: '18px', md: 'var(--font-size-lg)' },
  fontWeight: 600,
};

const separatorStyles = {
  color: 'var(--color-gray-text-medium-dark-messages)',
  marginInline: 'var(--spacing-gap-sm)',
  fontWeight: 500,
};

const infoButtonStyles = {
  backgroundColor: 'var(--color-white)',
  borderRadius: '50%',
  border: '1px solid var(--color-gray-border-very-light-messages)',
  padding: '4px',
  boxShadow: 'var(--shadow-button-sm)',
};

const actionButtonStyles = {
  width: 'var(--size-button-action)',
  height: 'var(--size-button-action)',
  borderRadius: 'var(--border-radius-button-action)',
  border: '1px solid var(--color-gray-border-light-medium-messages)',
  backgroundColor: 'var(--color-white-overlay-92)',
  boxShadow: 'var(--shadow-button-md)',
};

const MessageStatsBar = ({ stats, loading }: MessageStatsBarProps) => (
  <Box sx={statsBarContainerStyles}>
    <Box sx={statsContainerStyles}>
      {stats.map((stat, index) => (
        <Box key={`creator-message-stat-${stat.label}-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography component="span" sx={{ ...statValueStyles, color: stat.color }}>
            {loading ? '...' : stat.value}
          </Typography>
          {index < stats.length - 1 && (
            <Typography component="span" sx={separatorStyles}>
              /
            </Typography>
          )}
        </Box>
      ))}

      <IconButton aria-label="Message stats info" size="small" sx={infoButtonStyles}>
        <InfoOutlined fontSize="small" sx={{ color: 'var(--color-dark-text)' }} />
      </IconButton>
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-insights-gap-md)' }}>
      {[FilterListRounded, SearchRounded].map((IconComponent, index) => (
        <IconButton
          key={`creator-message-action-${index}`}
          aria-label={index === 0 ? 'Filter messages' : 'Search messages'}
          sx={actionButtonStyles}
        >
          <IconComponent sx={{ color: 'var(--color-dark-gray)' }} />
        </IconButton>
      ))}
    </Box>
  </Box>
);

export default MessageStatsBar;

