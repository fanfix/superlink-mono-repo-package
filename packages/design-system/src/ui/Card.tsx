import { FC, ReactNode } from "react";
import MuiCard, { CardProps as MuiCardProps } from "@mui/material/Card";
import { SxProps, Theme } from "@mui/material/styles";

export type CardVariant = "profile" | "modal" | "default" | "elevated" | "outlined";

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  /**
   * Card variant - supports MUI variants and custom variants
   * @default 'default'
   */
  variant?: CardVariant;
  /**
   * Card content
   */
  children: ReactNode;
  /**
   * System props for styling
   */
  sx?: SxProps<Theme>;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Whether the card is clickable
   * @default false
   */
  clickable?: boolean;
}

export const Card: FC<CardProps> = ({
  children,
  variant = "default",
  sx,
  onClick,
  clickable = false,
  ...props
}) => {
  // Check if it's a custom variant
  const isCustomVariant = ["profile", "modal"].includes(variant as string);
  
  if (isCustomVariant) {
    const customStyles = getCustomVariantStyles(variant as CardVariant, clickable);
    return (
      <MuiCard
        onClick={onClick}
        sx={[
          customStyles,
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      >
        {children}
      </MuiCard>
    );
  }

  // Standard MUI variants
  return (
    <MuiCard
      onClick={onClick}
      sx={{
        cursor: clickable || onClick ? "pointer" : "default",
        transition: "var(--transition-normal)",
        ...sx, // allow overrides
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
};

// Custom variant styles

// Custom variant styles
const getCustomVariantStyles = (variant: CardVariant, clickable: boolean): SxProps<Theme> => {
    switch (variant) {
      case "profile":
        return {
          height: "var(--card-profile-height) !important",
          width: "var(--card-profile-width) !important",
          minHeight: "var(--card-profile-height)",
          maxHeight: "var(--card-profile-height)",
          padding: "var(--card-profile-padding)",
          borderRadius: "var(--card-profile-border-radius)",
          backgroundColor: "var(--color-white)",
          cursor: clickable ? "pointer" : "default",
          transition: "var(--transition-normal)",
          boxShadow: "var(--shadow-sm)",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          "&:hover": clickable ? {
            boxShadow: "var(--shadow-md)",
            transform: "translateY(-2px)",
          } : {},
          "&:active": clickable ? {
            transform: "translateY(0px)",
            boxShadow: "var(--shadow-sm)",
          } : {},
        };
      case "modal":
        return {
          height: "var(--card-modal-height)",
          width: "var(--card-modal-width)",
          padding: "var(--card-modal-padding) !important",
          borderRadius: "var(--card-modal-border-radius)",
          backgroundColor: "var(--card-modal-background-color)",
          cursor: clickable ? "pointer" : "default",
          transition: "var(--transition-normal)",
          boxShadow: "var(--shadow-lg)",
        //   boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          "&:hover": clickable ? {
            boxShadow: "var(--shadow-xl)",
            transform: "translateY(-2px)",
          } : {},
          "&:active": clickable ? {
            transform: "translateY(0px)",
            boxShadow: "var(--shadow-lg)",
          } : {},
        };
      default:
        return {};
    }
};