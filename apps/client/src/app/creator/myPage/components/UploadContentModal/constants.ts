/**
 * Default title color for content preview
 */
export const DEFAULT_TITLE_COLOR = '#ff7d3c';

/**
 * Default preview title when no title is provided
 */
export const DEFAULT_PREVIEW_TITLE = 'James David';

/**
 * Crop configuration
 */
export const CROP_CONFIG = {
  ASPECT_RATIO: 3 / 4,
  ZOOM_MIN: 1,
  ZOOM_MAX: 3,
  ZOOM_STEP: 0.01,
} as const;

/**
 * Countdown validation limits
 */
export const COUNTDOWN_LIMITS = {
  MINUTES_MAX: 59,
  SECONDS_MAX: 59,
} as const;

