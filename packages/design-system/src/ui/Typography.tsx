import { FC } from "react";
import MuiTypography, { TypographyProps as MuiTypographyProps } from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material/styles";

export type CustomTypographyVariant = "heading-sm"| "heading-md"| "heading-lg"| "text-sm" | "text-md"| "text-lg";

export interface TypographyProps extends Omit<MuiTypographyProps, 'variant'> {
  /**
   * Typography variant - supports MUI variants and custom variants
   * @default 'body1'
   */
  variant?: MuiTypographyProps['variant'] | CustomTypographyVariant;
  /**
   * System props for styling
   */
  sx?: SxProps<Theme>;
}

export const Typography: FC<TypographyProps> = ({
  children,
  variant = "body1",
  sx,
  ...props
}) => {
  // Check if it's a custom variant
  const isCustomVariant = ["heading-md","heading-sm", "heading-lg", "text-md","text-lg"].includes(variant as string);
  
  if (isCustomVariant) {
    const customStyles = getCustomVariantStyles(variant as CustomTypographyVariant);
    return (
      <MuiTypography
        variant="body1" // Use body1 as base for custom variants
        sx={{
          ...customStyles,
          ...sx, // allow overrides
        }}
        {...props}
      >
        {children}
      </MuiTypography>
    );
  }

  // Standard MUI variants
  return (
    <MuiTypography
      variant={variant as MuiTypographyProps['variant']}
      sx={{
        ...sx, // allow overrides
      }}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};

// Custom variant styles
const getCustomVariantStyles = (variant: CustomTypographyVariant) => {
  switch (variant) {
    case "heading-lg":
      return {
        fontSize: "var(--font-size-3xl)",
        fontWeight: "var(--font-weight-bold)",
        color: "var(--color-black)",
        lineHeight: "var(--line-height-md)",
        fontFamily: "var(--font-family-primary)",
      };
      case "heading-md":
        return {
          fontSize: "var(--font-size-xl)",
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--color-black)",
          lineHeight: "var(--line-height-md)",
          fontFamily: "var(--font-family-primary)",
        };
        case "heading-sm":
          return {
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-black)",
            lineHeight: "var(--line-height-md)",
            fontFamily: "var(--font-family-primary)",
          };
      case "text-lg":
      return {
        fontSize: "var(--font-size-lg)",
        fontWeight: "var(--font-weight-normal)",
        color: "var(--color-black)",
        lineHeight: "var(--line-height-md)",
        fontFamily: "var(--font-family-primary)",
      };
      case "text-md":
        return {
          fontSize: "var(--font-size-md-1)",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--color-grey-main)",
          lineHeight: "var(--line-height-md)",
          fontFamily: "var(--font-family-primary)",
        };
        case "text-sm":
          return {
            fontSize: "var(--font-size-md)",
            fontWeight: "var(--font-weight-normal)",
            color: "var(--color-grey-main)",
            lineHeight: "var(--line-height-md)",
            fontFamily: "var(--font-family-primary)",
          };
    default:
      return {};
  }
};
