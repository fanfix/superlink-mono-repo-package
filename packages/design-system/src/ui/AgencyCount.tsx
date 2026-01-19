import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

export interface AgencyCountProps {
  /**
   * Label for the count (e.g., "Total Agencies")
   */
  label: string;
  /**
   * Count value to display
   */
  count: string;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Callback when component is clicked
   */
  onClick?: () => void;
  /**
   * System props for styling
   */
  sx?: SxProps<Theme>;
}

export const AgencyCount: FC<AgencyCountProps> = ({
  label,
  count,
  className,
  onClick,
  sx,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    console.log(`${label} clicked: ${count}`);
  };

  return (
    <Box
      className={className}
      onClick={handleClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "var(--agency-count-padding)",
        backgroundColor: "var(--agency-count-background)",
        borderRadius: "var(--agency-count-border-radius)",
        boxShadow: "var(--agency-count-shadow)",
        width: "var(--agency-count-width)",
        height: "var(--agency-count-height)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxSizing: "border-box",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "var(--agency-count-background-hover)",
        },
        ...sx,
      }}
    >
      <Typography
        sx={{
          fontSize: "var(--agency-count-label-size)",
          fontWeight: "var(--agency-count-label-weight)",
          color: "var(--agency-count-label-color)",
          lineHeight: "1.2",
          marginBottom: "var(--agency-count-label-margin)",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "var(--agency-count-value-size)",
          fontWeight: "var(--agency-count-value-weight)",
          color: "var(--agency-count-value-color)",
          lineHeight: "1.1",
          letterSpacing: "var(--agency-count-value-spacing)",
        }}
      >
        {count}
      </Typography>
    </Box>
  );
};
