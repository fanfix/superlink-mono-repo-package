import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

export interface FinancialSummaryProps {
  /**
   * Total amount value
   */
  totalAmount: string;
  /**
   * Filtered amount value
   */
  filteredAmount: string;
  /**
   * Start date for the date range
   */
  startDate: string;
  /**
   * End date for the date range
   */
  endDate: string;
  /**
   * Callback when date range changes
   */
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Currency symbol
   */
  currency?: string;
  /**
   * System props for styling
   */
  sx?: SxProps<Theme>;
}

export const FinancialSummary: FC<FinancialSummaryProps> = ({
  totalAmount,
  filteredAmount,
  startDate,
  endDate,
  onDateRangeChange,
  className,
  currency = "$",
  sx,
}) => {
  const handleDateRangeClick = () => {
    // Handle date range picker opening
    console.log("Date range picker clicked");
    // You can integrate with a date picker library here
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--financial-summary-padding)",
        backgroundColor: "var(--financial-summary-background)",
        borderRadius: "var(--financial-summary-border-radius)",
        boxShadow: "var(--financial-summary-shadow)",
        width: "var(--financial-summary-width)",
        height: "var(--financial-summary-height)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxSizing: "border-box",
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "var(--financial-summary-gap)",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Typography
            sx={{
              fontSize: "var(--financial-amount-label-size)",
              fontWeight: "var(--financial-amount-label-weight)",
              color: "var(--financial-amount-label-color)",
              lineHeight: "1.2",
            }}
          >
            Total
          </Typography>
          <Typography
            sx={{
              fontSize: "var(--financial-amount-value-size)",
              fontWeight: "var(--financial-amount-value-weight)",
              color: "var(--financial-amount-value-color)",
              lineHeight: "1.2",
              letterSpacing: "var(--financial-amount-value-spacing)",
            }}
          >
            {totalAmount}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Typography
            sx={{
              fontSize: "var(--financial-amount-label-size)",
              fontWeight: "var(--financial-amount-label-weight)",
              color: "var(--financial-amount-label-color)",
              lineHeight: "1.2",
            }}
          >
            Filtered
          </Typography>
          <Typography
            sx={{
              fontSize: "var(--financial-amount-value-size)",
              fontWeight: "var(--financial-amount-value-weight)",
              color: "var(--financial-amount-value-color)",
              lineHeight: "1.2",
              letterSpacing: "var(--financial-amount-value-spacing)",
            }}
          >
            {filteredAmount}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Box
          onClick={handleDateRangeClick}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "var(--financial-date-padding)",
            backgroundColor: "var(--financial-date-background)",
            borderRadius: "var(--financial-date-border-radius)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <Typography
            sx={{
              fontSize: "var(--financial-date-text-size)",
              fontWeight: "var(--financial-date-text-weight)",
              color: "var(--financial-date-text-color)",
              lineHeight: "1.2",
            }}
          >
            {formatDate(startDate)} - {formatDate(endDate)}
          </Typography>
          <Box
            sx={{
              width: "var(--financial-icon-size)",
              height: "var(--financial-icon-size)",
              backgroundColor: "var(--financial-icon-color)",
              mask: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/%3e%3c/svg%3e\") no-repeat center",
              maskSize: "contain",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
