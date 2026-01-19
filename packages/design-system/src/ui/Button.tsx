import { Children, FC } from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { SxProps, Theme } from "@mui/material/styles";

export type CustomButtonVariant = "primary-dark"| "primary-dark-sm" | "primary-light"| "primary-danger-sm" | "blue-text"| "black-text" | "success-light-sm"| "danger-light-sm"| "outline-sm";

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  /**
   * Show loading spinner and disable the button
   * @default false
   */
  loading?: boolean;
  /**
   * Custom loading indicator element
   * @default <CircularProgress color="inherit" size={16} />
   */
  loadingIndicator?: React.ReactNode;
  /**
   * Position of the loading indicator
   * @default 'center'
   */
  loadingPosition?: "start" | "end" | "center";
  /**
   * Button variant - supports MUI variants and custom variants
   */
  variant?: MuiButtonProps['variant'] | CustomButtonVariant;
  /**
   * System props for styling
   */
  sx?: SxProps<Theme>;
}

export const Button: FC<ButtonProps> = ({
  children,
  loading = false,
  loadingIndicator = <CircularProgress color="inherit" size={16} />,
  loadingPosition = "center",
  disabled,
  variant = "contained",
  sx,
  ...props
}) => {
  const isDisabled = loading || disabled;

  const renderContent = () => {
    if (loading) {
      switch (loadingPosition) {
        case "start":
          return (
            <>
              {loadingIndicator}
              {children && <span style={{ marginLeft: 8 }}>{children}</span>}
            </>
          );
        case "end":
          return (
            <>
              {children && <span style={{ marginRight: 8 }}>{children}</span>}
              {loadingIndicator}
            </>
          );
        case "center":
        default:
          return (
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minWidth: children ? 'fit-content' : 'auto',
            }}>
             {loadingIndicator}
            </span>
          );
      }
    }
    return children;
  };

  // Custom variant styles
  const getCustomVariantStyles = (variant: CustomButtonVariant) => {
    const baseCustomStyles = {
      textTransform: "none" as const,
      // borderRadius: 2,
      // fontSize: "12px",
      // fontWeight: 600,
    };

    switch (variant) {
      case "primary-dark":
        return {
          ...baseCustomStyles,
          fontSize: "var(--font-size-sm)",
          backgroundColor: "var(--color-primary-main)",
          borderRadius: "var(--border-radius-md)",
          color: "var(--color-white)",
          // paddingLeft: "var(--padding-horizontal-xl)",
          // paddingRight: "var(--padding-horizontal-xl)",
          paddingTop: "var(--padding-vertical-md)",
          paddingBottom: "var(--padding-vertical-md)",
          border: "none",
          "&:disabled": {
            backgroundColor: "var(--button-disabled-bg)",
            color: "var(--button-disabled-text)",
          },
        };
        case "primary-dark-sm":
          return {
            ...baseCustomStyles,
            fontSize: "var(--font-size-md-1)",
            fontWeight: "var(--font-weight-medium)",
            backgroundColor: "var(--color-black-secondary)",
            borderRadius: "var(--border-radius-md)",
            color: "var(--color-white)",
            paddingLeft: "var(--padding-xl)",
            paddingRight: "var(--padding-xl)",
            paddingTop: "var(--padding-md)",
            paddingBottom: "var(--padding-md)",
            border: "none",
            "&:disabled": {
              backgroundColor: "var(--button-disabled-bg)",
              color: "var(--button-disabled-text)",
            },
          };
      case "primary-light":
        return {
          ...baseCustomStyles,
          backgroundColor: "var(--color-primary-light)",
          fontSize: "var(--font-size-sm)",
          color: "var(--color-white)",
          paddingLeft: "var(--padding-horizontal-xl)",
          borderRadius: "var(--border-radius-md)",
          paddingRight: "var(--padding-horizontal-xl)",
          paddingTop: "var(--padding-vertical-md)",
          paddingBottom: "var(--padding-vertical-md)",
          border: "none",
          "&:disabled": {
            backgroundColor: "var(--button-disabled-bg)",
            color: "var(--button-disabled-text)",
          },
        };
        case "success-light-sm":
        return {
          ...baseCustomStyles,
          backgroundColor: "var(--color-success-light)",
          fontSize: "var(--font-size-md)",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--color-success-main)",
          borderRadius: "var(--border-radius-full)",
          paddingLeft: "var(--padding-lg-2)",
          paddingRight: "var(--padding-lg-2)",
          paddingTop: "var(--padding-md)",
          paddingBottom: "var(--padding-md)",
          border: "none",
          "&:disabled": {
            backgroundColor: "var(--button-disabled-bg)",
            color: "var(--button-disabled-text)",
          },
        };
        case "danger-light-sm":
          return {
            ...baseCustomStyles,
            backgroundColor: "var(--color-error-light)",
            fontSize: "var(--font-size-md)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-error-main)",
            borderRadius: "var(--border-radius-full)",
            paddingLeft: "var(--padding-lg-2)",
            paddingRight: "var(--padding-lg-2)",
            paddingTop: "var(--padding-md)",
            paddingBottom: "var(--padding-md)",
            border: "none",
            "&:disabled": {
              backgroundColor: "var(--button-disabled-bg)",
              color: "var(--button-disabled-text)",
            },
          };
          case "primary-danger-sm":
          return {
            ...baseCustomStyles,
            fontSize: "var(--font-size-md)",
            fontWeight: "var(--font-weight-medium)",
            backgroundColor: "var(--color-error-primary)",
            color: "var(--color-error-secondary)",
            borderRadius: "var(--border-radius-md)",
            width: "var(--width-sm-1)",
            height: "var(--height-sm-1)",
          paddingLeft: "var(--padding-xl)",
          paddingRight: "var(--padding-xl)",
          paddingTop: "var(--padding-lg)",
          paddingBottom: "var(--padding-lg)",
            border: "none",
            "&:disabled": {
              backgroundColor: "var(--button-disabled-bg)",
              color: "var(--button-disabled-text)",
            },
          };
      case "blue-text":
        return {
          ...baseCustomStyles,
          backgroundColor: "transparent",
          fontSize: "var(--font-size-md)",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--color-blue-main)",
          border: "none",
          minHeight: "auto",
          "&:disabled": {
            color: "var(--button-disabled-text)",
          },
        };

        case "black-text":
          return {
            ...baseCustomStyles,
            backgroundColor: "transparent",
            fontSize: "var(--font-size-md)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-black-secondary)",
            border: "none",
            minHeight: "auto",
            "&:disabled": {
              color: "var(--button-disabled-text)",
            },
          };


          case "outline-sm":
            return {
              ...baseCustomStyles,
              backgroundColor: "transparent",
              fontSize: "var(--font-size-md)",
              fontWeight: "var(--font-weight-medium)",
              color: "var( --color-black-secondary)",
              border: "1px solid var(--color-white-light)",
              borderRadius: "var(--border-radius-md)",
              width: "var(--width-sm-1)",
              height: "var(--height-sm-1)",
            paddingLeft: "var(--padding-xl)",
            paddingRight: "var(--padding-xl)",
            paddingTop: "var(--padding-lg)",
            paddingBottom: "var(--padding-lg)",
              minHeight: "auto",
              "&:disabled": {
                color: "var(--button-disabled-text)",
              },
            };
          

      default:
        return {};
    }
  };

  // Check if it's a custom variant
  const isCustomVariant = ["primary-dark","primary-dark-sm","primary-danger-sm", "primary-light","success-light-sm", "blue-text","black-text", "danger-light-sm","outline-sm"].includes(variant as string);
  
  if (isCustomVariant) {
    const customStyles = getCustomVariantStyles(variant as CustomButtonVariant);
    return (
      <MuiButton
        disabled={isDisabled}
        variant="text" // Use text as base for custom variants
        sx={{
          ...customStyles,
          ...sx, // allow overrides
        }}
        {...props}
      >
        {renderContent()}
      </MuiButton>
    );
  }

  // Standard MUI variants
  return (
    <MuiButton
      disabled={isDisabled}
      variant={variant as MuiButtonProps['variant']}
      sx={{
        textTransform: "none",
        ...sx, // allow overrides
      }}
      {...props}
    >
      {renderContent()}
    </MuiButton>
  );
};
