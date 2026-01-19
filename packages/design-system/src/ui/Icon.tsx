import React, { FC, ReactElement } from "react";
import { SxProps, Theme } from "@mui/material/styles";

// Import all SVG icons and Material UI icons from assets
import {
  DashboardIcon,
  TeamsIcon,
  PersonIcon,
  LockIcon,
  SettingsIcon,
  LinkIcon,
  AddIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CalendarTodayIcon,
  DownloadIcon,
  ExportIcon,
  ViewIcon,
  DeleteIcon,
  DeleteIconWithBg,
  ErrorIcon,
  FacebookLogoIcon,
  TwitterLogoIcon,
  InstagramLogoIcon,
  YouTubeLogoIcon,
  TikTokLogoIcon,
  SnapchatLogoIcon,
  SpotifyLogoIcon,
  OnlyFansLogoIcon,
  MaterialIcons
} from '../assets/icons/index';

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
export type IconColor = "primary" | "secondary" | "success" | "error" | "warning" | "info" | "white" | "black";

export interface IconProps {
  /**
   * MUI Icon component to render
   */
  icon: ReactElement;
  /**
   * Icon size preset
   * @default 'md'
   */
  size?: IconSize;
  /**
   * Custom width (overrides size preset)
   */
  width?: string | number;
  /**
   * Custom height (overrides size preset)
   */
  height?: string | number;
  /**
   * Icon color preset
   * @default 'secondary'
   */
  color?: IconColor;
  /**
   * Custom color (overrides color preset)
   */
  customColor?: string;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Whether the icon is clickable
   * @default false
   */
  clickable?: boolean;
  /**
   * System props for styling
   */
  sx?: SxProps<Theme>;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Icon rotation in degrees
   */
  rotation?: number;
  /**
   * Icon opacity
   * @default 1
   */
  opacity?: number;
}

export const Icon: FC<IconProps> = ({
  icon,
  size = "md",
  width,
  height,
  color = "secondary",
  customColor,
  onClick,
  clickable = false,
  sx,
  className,
  rotation = 0,
  opacity = 1,
  ...props
}) => {
  // Get size dimensions from CSS variables
  const getSizeDimensions = (size: IconSize) => {
    const sizeMap = {
      xs: "var(--icon-size-xs)",
      sm: "var(--icon-size-sm)",
      md: "var(--icon-size-md)",
      lg: "var(--icon-size-lg)",
      xl: "var(--icon-size-xl)",
      "2xl": "var(--icon-size-2xl)",
      "3xl": "var(--icon-size-3xl)",
      "4xl": "var(--icon-size-4xl)",
    };
    return sizeMap[size];
  };

  // Get color from CSS variables
  const getColorValue = (color: IconColor) => {
    const colorMap = {
      primary: "var(--icon-color-primary)",
      secondary: "var(--icon-color-secondary)",
      success: "var(--icon-color-success)",
      error: "var(--icon-color-error)",
      warning: "var(--icon-color-warning)",
      info: "var(--icon-color-info)",
      white: "var(--icon-color-white)",
      black: "var(--icon-color-black)",
    };
    return colorMap[color];
  };

  // Base styles
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "inherit",
    // Use custom dimensions if provided, otherwise use size preset
    width: width || getSizeDimensions(size),
    height: height || getSizeDimensions(size),
    color: customColor || getColorValue(color),
    cursor: clickable || onClick ? "pointer" : "default",
    transition: "var(--transition-normal)",
    opacity: opacity,
    transform: rotation !== 0 ? `rotate(${rotation}deg)` : "none",
  };

  // Clone the icon element and apply our styles
  const iconElement = React.cloneElement(icon, {
    ...props,
  });

  return (
    <span
      style={{
        ...baseStyles,
        ...(sx as React.CSSProperties),
      }}
      className={className}
    >
      {iconElement}
    </span>
  );
};

// Export all SVG icons and Material UI icons for direct use
export {
  DashboardIcon,
  TeamsIcon,
  PersonIcon,
  LockIcon,
  SettingsIcon,
  LinkIcon,
  AddIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CalendarTodayIcon,
  DownloadIcon,
  ExportIcon,
  ViewIcon,
  DeleteIcon,
  DeleteIconWithBg,
  ErrorIcon,
  FacebookLogoIcon,
  TwitterLogoIcon,
  InstagramLogoIcon,
  YouTubeLogoIcon,
  TikTokLogoIcon,
  SnapchatLogoIcon,
  SpotifyLogoIcon,
  OnlyFansLogoIcon,
  MaterialIcons,
};
