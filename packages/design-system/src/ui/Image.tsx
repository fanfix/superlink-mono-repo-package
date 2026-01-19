import { FC } from "react";
import { SxProps, Theme } from "@mui/material/styles";

export type ImageVariant = "rounded-sm" | "rounded-md" | "rounded-lg" | "rounded-full";
export type ImageSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
export type ImageObjectFit = "cover" | "contain" | "fill";
export interface ImageProps {
  /**
   * Image source URL
   */
  src: string;
  /**
   * Alt text for accessibility
   */
  alt: string;
  /**
   * Image variant for border radius
   * @default 'rounded-full'
   */
  variant?: ImageVariant;
  /**
   * Image size preset
   * @default 'md'
   */
  size?: ImageSize;
  /**
   * Custom width (overrides size preset)
   */
  width?: string | number;
  /**
   * Custom height (overrides size preset)
   */
  height?: string | number;
  /**
   * Object fit behavior
   * @default 'cover'
   */
  objectFit?: ImageObjectFit;
  /**
   * System props for styling
   */
  sx?: SxProps<Theme>;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Loading state
   */
  loading?: "lazy" | "eager";
}

export const Image: FC<ImageProps> = ({
  src,
  alt,
  variant = "rounded-full",
  size = "md",
  width,
  height,
  objectFit = "cover",
  sx,
  className,
  onClick,
  loading = "lazy",
  ...props
}) => {
  // Get size dimensions from CSS variables
  const getSizeDimensions = (size: ImageSize) => {
    const sizeMap = {
      xs: "var(--image-size-xs)",
      sm: "var(--image-size-sm)",
      md: "var(--image-size-md)",
      lg: "var(--image-size-lg)",
      xl: "var(--image-size-xl)",
      "2xl": "var(--image-size-2xl)",
      "3xl": "var(--image-size-3xl)",
      "4xl": "var(--image-size-4xl)",
    };
    return sizeMap[size];
  };

  // Get border radius from CSS variables
  const getBorderRadius = (variant: ImageVariant) => {
    const radiusMap = {
      "rounded-sm": "var(--image-border-radius-sm)",
      "rounded-md": "var(--image-border-radius-md)",
      "rounded-lg": "var(--image-border-radius-lg)",
      "rounded-full": "var(--image-border-radius-full)",
    };
    return radiusMap[variant];
  };

  // Get object fit value
  const getObjectFitValue = (objectFit: ImageObjectFit) => {
    const objectFitMap = {
      cover: "cover" as const,
      contain: "contain" as const,
      fill: "fill" as const,
    };
    return objectFitMap[objectFit];
  };

  // Base styles
  const baseStyles: React.CSSProperties = {
    display: "block",
    borderRadius: getBorderRadius(variant),
    objectFit: getObjectFitValue(objectFit),
    transition: "var(--transition-normal)",
    cursor: onClick ? "pointer" : "default",
    // Use custom dimensions if provided, otherwise use size preset
    width: width || getSizeDimensions(size),
    height: height || getSizeDimensions(size),
  };

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onClick={onClick}
      style={{
        ...baseStyles,
        ...(sx as React.CSSProperties),
      }}
      {...props}
    />
  );
};
