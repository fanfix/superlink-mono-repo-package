import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * Main page container - full viewport height with white background
 */
export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: 'var(--color-white)',
  width: '100%',
  overflow: 'auto', // Mobile: auto, Desktop: hidden
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    height: '100vh',
    overflow: 'hidden', // Desktop: hidden
  },
}));

/**
 * Content container - flex layout for left and right panels
 */
export const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column', // Mobile: column (stacked)
  flex: 1,
  overflow: 'auto', // Mobile: auto
  maxWidth: '100%',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 0, // Allow flex children to shrink
  padding: 0,
  margin: 0,
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row', // Desktop: row (side by side)
    overflow: 'hidden', // Desktop: hidden
  },
}));

/**
 * Left panel - settings and configuration section
 * Full width on mobile (stacked above right panel), 50% width on desktop
 */
export const LeftPanel = styled(Box)(({ theme }) => ({
  flex: '0 0 auto',
  width: '100%',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'visible',
  overflowX: 'hidden',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  backgroundColor: 'var(--color-white)',
  position: 'relative',
  zIndex: 1,
  '&::-webkit-scrollbar': {
    display: 'none',
    width: 0,
    height: 0,
  },
  '&::-webkit-scrollbar-track': {
    display: 'none',
  },
  '&::-webkit-scrollbar-thumb': {
    display: 'none',
  },
  [theme.breakpoints.up('md')]: {
    flex: '0 0 50%',
    maxWidth: '50%',
    height: '100%',
    overflowY: 'auto',
  },
}));

/**
 * Right panel - mobile preview section
 * Full width on mobile (below left panel), 50% on desktop
 */
export const RightPanel = styled(Box)(({ theme }) => ({
  flex: '1 1 auto',
  width: '100%',
  maxWidth: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'var(--color-gray-200)',
  overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
  zIndex: 0,
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  boxSizing: 'border-box',
  padding: 'var(--padding-md)',
  margin: 0,
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  [theme.breakpoints.up('md')]: {
    flex: '0 0 50%',
    maxWidth: '50%',
    height: '100%',
    overflowY: 'hidden',
    padding: 0,
  },
}));

/**
 * Left panel content wrapper - contains all sections
 */
export const LeftPanelContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  width: '100%',
  paddingBottom: 0,
  [theme.breakpoints.up('md')]: {
    paddingBottom: 'var(--padding-3xl)',
  },
}));
