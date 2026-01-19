import { FC, useState, useRef } from "react";
import { Box, Popover, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { FilterList } from "@mui/icons-material";

export interface FilterMenuItem {
  /**
   * Filter option identifier
   */
  id: string;
  /**
   * Filter option label
   */
  label: string;
  /**
   * Click handler for the filter option
   */
  onClick?: () => void;
}

export interface AddFilterDropdownProps {
  /**
   * Filter menu items to display
   */
  items?: FilterMenuItem[];
  /**
   * Button text
   */
  buttonText?: string;
  /**
   * Custom className
   */
  className?: string;
  /**
   * System props for styling
   */
  sx?: SxProps<Theme>;
}

const FilterButton = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  userSelect: "none",
  padding: "8px 12px",
  borderRadius: "var(--border-radius-md)",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "var(--color-gray-100)",
  },
});

const FilterIcon = styled(FilterList)({
  fontSize: "18px",
  color: "var(--color-black)",
});

const FilterText = styled(Typography)({
  fontSize: "var(--font-size-md)",
  fontWeight: "var(--font-weight-medium)",
  color: "var(--color-black)",
});

const FilterMenu = styled(Box)({
  backgroundColor: "var(--color-white)",
  borderRadius: "var(--border-radius-md)",
  boxShadow: "var(--shadow-lg)",
  padding: "8px 0",
  minWidth: "200px",
  maxWidth: "300px",
  display: "flex",
  flexDirection: "column",
});

const FilterMenuItem = styled(Box)({
  padding: "12px 16px",
  fontSize: "var(--font-size-md)",
  fontWeight: "var(--font-weight-normal)",
  color: "var(--color-text-primary)",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "var(--color-gray-100)",
  },
});

export const AddFilterDropdown: FC<AddFilterDropdownProps> = ({
  items = [],
  buttonText = "ADD FILTER",
  className,
  sx,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setAnchorEl(buttonRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item: FilterMenuItem) => {
    item.onClick?.();
    handleClose();
  };

  const open = Boolean(anchorEl);

  const defaultItems: FilterMenuItem[] = [
    { id: "lead-type", label: "Lead Type", onClick: () => console.log("Lead Type clicked") },
    { id: "utm-source", label: "UTM Source", onClick: () => console.log("UTM Source clicked") },
    { id: "utm-campaign", label: "UTM Campaign", onClick: () => console.log("UTM Campaign clicked") },
    { id: "utm-medium", label: "UTM Medium", onClick: () => console.log("UTM Medium clicked") },
    { id: "status-deleted", label: "Status: Deleted", onClick: () => console.log("Status: Deleted clicked") },
  ];

  const filterItems = items.length > 0 ? items : defaultItems;

  return (
    <Box className={className} sx={sx}>
      <FilterButton ref={buttonRef} onClick={handleClick}>
        <FilterIcon />
        <FilterText>{buttonText}</FilterText>
      </FilterButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            boxShadow: "var(--shadow-lg)",
            borderRadius: "var(--border-radius-md)",
            marginTop: "4px",
          },
        }}
      >
        <FilterMenu>
          {filterItems.map((item) => (
            <FilterMenuItem
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
            >
              {item.label}
            </FilterMenuItem>
          ))}
        </FilterMenu>
      </Popover>
    </Box>
  );
};

