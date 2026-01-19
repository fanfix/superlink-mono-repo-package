import React, { FC, ReactNode } from "react";
import { Box, Skeleton } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

export type CardSkeletonVariant = "video" | "profile" | "article" | "custom";

export interface CardSkeletonProps {
  /**
   * Variant of the skeleton card
   * @default 'video'
   */
  variant?: CardSkeletonVariant;
  /**
   * Show thumbnail skeleton
   * @default true
   */
  showThumbnail?: boolean;
  /**
   * Thumbnail aspect ratio (width/height)
   * @default 16/9
   */
  thumbnailAspectRatio?: number;
  /**
   * Show title skeleton
   * @default true
   */
  showTitle?: boolean;
  /**
   * Number of title lines
   * @default 2
   */
  titleLines?: number;
  /**
   * Show subtitle/metadata skeleton
   * @default true
   */
  showSubtitle?: boolean;
  /**
   * Show avatar skeleton
   * @default false
   */
  showAvatar?: boolean;
  /**
   * Show description skeleton
   * @default false
   */
  showDescription?: boolean;
  /**
   * Number of description lines
   * @default 3
   */
  descriptionLines?: number;
  /**
   * Show action buttons skeleton
   * @default false
   */
  showActions?: boolean;
  /**
   * Custom content to render instead of default skeleton
   */
  children?: ReactNode;
  /**
   * Animation type
   * @default 'pulse'
   */
  animation?: "pulse" | "wave" | false;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * System props for styling the container
   */
  sx?: SxProps<Theme>;
  /**
   * System props for styling the thumbnail
   */
  thumbnailSx?: SxProps<Theme>;
  /**
   * System props for styling the content area
   */
  contentSx?: SxProps<Theme>;
}

// Helper function to get variant styles
const getVariantStyles = (variant: CardSkeletonVariant): {
  container: SxProps<Theme>;
  thumbnail: SxProps<Theme>;
  content: SxProps<Theme>;
} => {
  switch (variant) {
    case "video":
      return {
        container: {
          display: "flex",
          flexDirection: "column",
          borderRadius: "var(--border-radius-md)",
          overflow: "hidden",
          backgroundColor: "var(--color-white)",
          boxShadow: "var(--shadow-sm)",
        },
        thumbnail: {
          width: "100%",
          borderRadius: "var(--border-radius-md)",
        },
        content: {
          padding: "var(--padding-md)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--padding-sm)",
        },
      };
    case "profile":
      return {
        container: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "var(--padding-md)",
          padding: "var(--padding-md)",
          borderRadius: "var(--border-radius-md)",
          backgroundColor: "var(--color-white)",
          boxShadow: "var(--shadow-sm)",
        },
        thumbnail: {
          width: "60px",
          height: "60px",
          borderRadius: "var(--border-radius-full)",
          flexShrink: 0,
        },
        content: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "var(--padding-xs)",
        },
      };
    case "article":
      return {
        container: {
          display: "flex",
          flexDirection: "column",
          borderRadius: "var(--border-radius-md)",
          overflow: "hidden",
          backgroundColor: "var(--color-white)",
          boxShadow: "var(--shadow-sm)",
        },
        thumbnail: {
          width: "100%",
          borderRadius: "var(--border-radius-md)",
        },
        content: {
          padding: "var(--padding-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--padding-md)",
        },
      };
    case "custom":
    default:
      return {
        container: {},
        thumbnail: {},
        content: {},
      };
  }
};

export const CardSkeleton: FC<CardSkeletonProps> = ({
  variant = "video",
  showThumbnail = true,
  thumbnailAspectRatio = 16 / 9,
  showTitle = true,
  titleLines = 2,
  showSubtitle = true,
  showAvatar = false,
  showDescription = false,
  descriptionLines = 3,
  showActions = false,
  children,
  animation = "pulse",
  className,
  sx,
  thumbnailSx,
  contentSx,
}) => {
  const variantStyles = getVariantStyles(variant);

  // If custom children provided, render them
  if (children) {
    return (
      <Box
        className={className}
        sx={[
          variantStyles.container,
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {children}
      </Box>
    );
  }

  // Calculate thumbnail height based on aspect ratio
  const thumbnailHeight = variant === "profile" 
    ? "60px" 
    : `calc(100% / ${thumbnailAspectRatio})`;

  return (
    <Box
      className={className}
      sx={[
        variantStyles.container,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Thumbnail/Avatar Skeleton */}
      {showThumbnail && (
        <Skeleton
          variant="rectangular"
          animation={animation}
          sx={[
            {
              width: variant === "profile" ? "60px" : "100%",
              height: variant === "profile" ? "60px" : thumbnailHeight,
              borderRadius: variant === "profile" 
                ? "var(--border-radius-full)" 
                : "var(--border-radius-md)",
              backgroundColor: "var(--color-gray-200)",
            },
            variantStyles.thumbnail,
            ...(Array.isArray(thumbnailSx) ? thumbnailSx : [thumbnailSx]),
          ]}
        />
      )}

      {/* Content Area */}
      <Box
        sx={[
          variantStyles.content,
          ...(Array.isArray(contentSx) ? contentSx : [contentSx]),
        ]}
      >
        {/* Avatar (for video variant) */}
        {showAvatar && variant === "video" && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "var(--padding-sm)" }}>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              animation={animation}
              sx={{
                backgroundColor: "var(--color-gray-200)",
              }}
            />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--padding-xs)" }}>
              <Skeleton
                variant="text"
                width="60%"
                height={16}
                animation={animation}
                sx={{
                  backgroundColor: "var(--color-gray-200)",
                }}
              />
              <Skeleton
                variant="text"
                width="40%"
                height={14}
                animation={animation}
                sx={{
                  backgroundColor: "var(--color-gray-200)",
                }}
              />
            </Box>
          </Box>
        )}

        {/* Title Lines */}
        {showTitle && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--padding-xs)" }}>
            {Array.from({ length: titleLines }).map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width={index === titleLines - 1 ? "70%" : "100%"}
                height={variant === "profile" ? 20 : 18}
                animation={animation}
                sx={{
                  backgroundColor: "var(--color-gray-200)",
                }}
              />
            ))}
          </Box>
        )}

        {/* Subtitle/Metadata */}
        {showSubtitle && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "var(--padding-sm)" }}>
            {variant === "video" && (
              <>
                <Skeleton
                  variant="text"
                  width={60}
                  height={14}
                  animation={animation}
                  sx={{
                    backgroundColor: "var(--color-gray-200)",
                  }}
                />
                <Skeleton
                  variant="circular"
                  width={4}
                  height={4}
                  animation={animation}
                  sx={{
                    backgroundColor: "var(--color-gray-200)",
                  }}
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={14}
                  animation={animation}
                  sx={{
                    backgroundColor: "var(--color-gray-200)",
                  }}
                />
              </>
            )}
            {variant === "profile" && (
              <Skeleton
                variant="text"
                width="60%"
                height={14}
                animation={animation}
                sx={{
                  backgroundColor: "var(--color-gray-200)",
                }}
              />
            )}
            {variant === "article" && (
              <Skeleton
                variant="text"
                width="40%"
                height={14}
                animation={animation}
                sx={{
                  backgroundColor: "var(--color-gray-200)",
                }}
              />
            )}
          </Box>
        )}

        {/* Description Lines */}
        {showDescription && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--padding-xs)" }}>
            {Array.from({ length: descriptionLines }).map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width={index === descriptionLines - 1 ? "80%" : "100%"}
                height={14}
                animation={animation}
                sx={{
                  backgroundColor: "var(--color-gray-200)",
                }}
              />
            ))}
          </Box>
        )}

        {/* Action Buttons */}
        {showActions && (
          <Box sx={{ display: "flex", gap: "var(--padding-sm)", marginTop: "var(--padding-xs)" }}>
            <Skeleton
              variant="rectangular"
              width={100}
              height={36}
              animation={animation}
              sx={{
                borderRadius: "var(--border-radius-md)",
                backgroundColor: "var(--color-gray-200)",
              }}
            />
            <Skeleton
              variant="rectangular"
              width={100}
              height={36}
              animation={animation}
              sx={{
                borderRadius: "var(--border-radius-md)",
                backgroundColor: "var(--color-gray-200)",
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
