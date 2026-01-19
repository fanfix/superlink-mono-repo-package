import * as React from "react";
import { styled } from "@mui/material/styles";

export interface ToastProps {
  /**
   * Toast message text
   */
  message: string;
  /**
   * Toast type/variant
   */
  type?: "success" | "error" | "warning" | "info";
  /**
   * Whether the toast is visible
   */
  visible?: boolean;
  /**
   * Callback when toast is closed
   */
  onClose?: () => void;
  /**
   * Custom position
   */
  position?: "top" | "bottom" | "top-center" | "bottom-center";
  /**
   * Whether to show close button
   */
  showCloseButton?: boolean;
  /**
   * Custom styles
   */
  sx?: any;
}

const StyledToast = styled("div")<{ $type: string; $visible: boolean; $position: string }>(
  ({ $type, $visible, $position }) => ({
    position: "fixed",
    zIndex: "var(--toast-z-index)",
    padding: "var(--toast-padding-vertical) var(--toast-padding-horizontal)",
    borderRadius: "var(--toast-border-radius)",
    fontSize: "var(--toast-font-size)",
    fontWeight: "var(--toast-font-weight)",
    color: "var(--toast-text-color)",
    boxShadow: "var(--toast-box-shadow)",
    transition: "all 0.3s ease-in-out",
    textAlign: "center",
    opacity: $visible ? 1 : 0,
    transform: $visible ? "translateY(0)" : "translateY(-20px)",
    pointerEvents: $visible ? "auto" : "none",
   width:"359px",
    // Position styles
    ...($position === "top" && {
      top: "20px",
      left: "50%",
      transform: `translateX(-50%) ${
        $visible ? "translateY(0)" : "translateY(-20px)"
      }`,
    }),
    ...($position === "bottom" && {
      bottom: "var(--toast-position-offset)",
      left: "50%",
      transform: `translateX(-50%) ${
        $visible ? "translateY(0)" : "translateY(20px)"
      }`,
    }),
    ...($position === "top-center" && {
      top: "var(--toast-position-offset)",
      left: "50%",
      transform: `translateX(-50%) ${
        $visible ? "translateY(0)" : "translateY(-20px)"
      }`,
    }),
    ...($position === "bottom-center" && {
      bottom: "var(--toast-position-offset)",
      left: "50%",
      transform: `translateX(-50%) ${
        $visible ? "translateY(0)" : "translateY(20px)"
      }`,
    }),

    // Type styles - Green like in your screenshot
    ...($type === "success" && {
      backgroundColor: "var(--toast-success-background)", // Green background matching your screenshot
    }),
    ...($type === "error" && {
      backgroundColor: "var(--toast-error-background)", // Red background
    }),
    ...($type === "warning" && {
      backgroundColor: "var(--toast-warning-background)", // Orange background
    }),
    ...($type === "info" && {
      backgroundColor: "var(--toast-info-background)", // Blue background
    }),
  })
);

const CloseButton = styled("button")({
  background: "none",
  border: "none",
  color: "white",
  fontSize: "var(--toast-close-button-font-size)",
  cursor: "pointer",
  padding: "0",
  marginLeft: "var(--toast-close-button-margin-left)",
  lineHeight: "1",
  opacity: "var(--toast-close-button-opacity)",
  "&:hover": {
    opacity: 1,
  },
});

const ToastContent = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

const ToastMessage = styled("span")({
  flex: 1,
  lineHeight: "1.4",
});

export const Toast = ({
  message,
  type = "success",
  visible = true,
  onClose,
  position = "top-center",
  showCloseButton = true,
  sx,
  ...props
}: ToastProps) => {
  const handleClose = () => {
    onClose?.();
  };

  if (!visible) return null;

  return (
    <StyledToast
      $type={type}
      $visible={visible}
      $position={position}
      sx={sx}
      {...props}
    >
      <ToastContent>
        <ToastMessage>{message}</ToastMessage>
      </ToastContent>
    </StyledToast>
  );
};
