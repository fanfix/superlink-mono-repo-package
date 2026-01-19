import { styled } from "@mui/material/styles";

export interface DropdownMenuItem {
  /**
   * Menu item identifier
   */
  id: string;
  /**
   * Menu item label
   */
  label: string;
  /**
   * Menu item icon name
   */
  icon: string;
  /**
   * Optional raw SVG markup used to render the icon (overrides built-ins)
   * Example: "<svg ...>...</svg>". Will be used as a mask so it inherits color.
   */
  iconSvg?: string;
  /**
   * Whether the item is dangerous/destructive
   */
  isDanger?: boolean;
  /**
   * Click handler
   */
  onClick?: () => void;
}

export interface DropdownMenuProps {
  /**
   * Menu items to display
   */
  items: DropdownMenuItem[];
  /**
   * Whether the menu is visible
   */
  isOpen?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

const CenteredWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100vh",
  padding: "20px",
  boxSizing: "border-box",
});

const MenuDropdown = styled("div")({
  position: "relative",
  backgroundColor: "var(--dropdown-menu-background)",
  border: "var(--dropdown-menu-border)",
  borderRadius: "var(--dropdown-menu-border-radius)",
  boxShadow: "var(--dropdown-menu-shadow)",
  width: "var(--dropdown-menu-width)",
  minHeight: "var(--dropdown-menu-height)",
  padding: "var(--dropdown-menu-padding)",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  boxSizing: "border-box",
});

const MenuItem = styled("div")(({ isDanger }: { isDanger?: boolean }) => ({
  display: "flex",
  alignItems: "center",
  gap: "var(--dropdown-menu-item-gap)",
  padding: "var(--dropdown-menu-item-padding)",
  fontSize: "var(--dropdown-menu-item-font-size)",
  fontWeight: isDanger ? 500 : "var(--dropdown-menu-item-font-weight)",
  color: isDanger
    ? "var(--dropdown-menu-item-color-danger)"
    : "var(--dropdown-menu-item-color)",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  flex: "0 0 auto",
  minHeight: "20px",
  whiteSpace: "nowrap",
  borderRadius: "var(--border-radius-md)",
  "&:hover": {
    backgroundColor: "var(--dropdown-menu-item-hover-background)",
  },
}));

const MenuIcon = styled("div")(
  ({
    iconName,
    isDanger,
    iconSvg,
  }: {
    iconName: string;
    isDanger?: boolean;
    iconSvg?: string;
  }) => {
    // If a raw SVG is provided, prefer it (data URL mask), so color comes from CSS tokens
    if (iconSvg) {
      const dataUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(
        iconSvg
      )}")`;
      return {
        width: "var(--dropdown-menu-icon-size)",
        height: "var(--dropdown-menu-icon-size)",
        backgroundColor: isDanger
          ? "var(--dropdown-menu-item-color-danger)"
          : "var(--dropdown-menu-item-color)",
        mask: `${dataUrl} no-repeat center`,
        WebkitMask: `${dataUrl} no-repeat center`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        flexShrink: 0,
      } as const;
    }
    const getIconMask = (name: string) => {
      switch (name) {
        case "delete":
          // Trash can
          return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='black' d='M7 3.5A1.5 1.5 0 018.5 2h3A1.5 1.5 0 0113 3.5V5h3a1 1 0 010 2h-1l-1 10a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7H4a1 1 0 110-2h3V3.5zM7 7l1 10h4L13 7H7zM9 9a1 1 0 011 1v6a1 1 0 11-2 0v-6a1 1 0 011-1zm3 0a1 1 0 011 1v6a1 1 0 11-2 0v-6a1 1 0 011-1zM9 5h4V3.5a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5V5z'/%3E%3C/svg%3E\")";
        case "login":
          // Arrow right into a bracket
          return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='black' d='M11 3a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1h-4a1 1 0 01-1-1v-1h2V4h-2V3z'/%3E%3Cpath fill='black' d='M10.293 12.707a1 1 0 010-1.414L11.586 10H4a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 111.414-1.414l3.001 3a1 1 0 010 1.414l-3.001 3a1 1 0 01-1.414 0z'/%3E%3C/svg%3E\")";
        case "account-claim":
          // Person with checkmark
          return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='black' d='M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c3.866 0 7 2.239 7 5v1H3v-1c0-2.761 3.134-5 7-5z'/%3E%3Cpath fill='black' d='M16.854 8.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0L11 9.707a.5.5 0 01.708-.708l1.146 1.147 2.646-2.646a.5.5 0 01.708 0z'/%3E%3C/svg%3E\")";
        case "stripe":
          // Stripe-like S inside rounded square
          return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Crect x='2' y='2' width='16' height='16' rx='3' ry='3' fill='black'/%3E%3Cpath fill='white' d='M10 5.5c-1.6 0-2.6.55-2.6 1.65 0 .82.7 1.35 1.8 1.5l1 .13c.9.12 1.3.35 1.3.73 0 .5-.7.88-1.8.88-.9 0-1.5-.22-1.9-.63l-.8.63c.5.7 1.3 1.07 2.7 1.07 1.9 0 3-1 3-2.2 0-1.06-.7-1.66-2-1.83l-.97-.13c-.7-.09-1.03-.26-1.03-.53 0-.35.45-.57 1.2-.57.7 0 1.2.2 1.5.5l.6-.6c-.5-.52-1.2-.82-2.3-.82z'/%3E%3C/svg%3E\")";
        case "duplicate":
          // Two overlapping squares
          return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Crect x='5' y='5' width='9' height='9' rx='2' ry='2' fill='black'/%3E%3Crect x='8' y='8' width='9' height='9' rx='2' ry='2' fill='black'/%3E%3C/svg%3E\")";
        case "edit":
          // Pencil
          return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='black' d='M12.586 3a2 2 0 012.828 0l1.586 1.586a2 2 0 010 2.828l-7.88 7.88a2 2 0 01-1.06.548l-3.084.617a.5.5 0 01-.588-.588l.617-3.084a2 2 0 01.548-1.06l7.88-7.88zM5.914 12.5l1.586 1.586'/%3E%3Cpath fill='black' d='M11.172 4.414l4.414 4.414'/%3E%3C/svg%3E\")";
        default:
          // Ellipsis vertical
          return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='black' d='M10 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z'/%3E%3C/svg%3E\")";
      }
    };

    // Stripe requires two-tone (square + white S), so render via background-image instead of mask
    if (iconName === "stripe") {
      const stripeSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Crect x='2' y='2' width='16' height='16' rx='3' ry='3' fill='%23727479'/%3E%3Cpath fill='white' d='M10 5.5c-1.6 0-2.6.55-2.6 1.65 0 .82.7 1.35 1.8 1.5l1 .13c.9.12 1.3.35 1.3.73 0 .5-.7.88-1.8.88-.9 0-1.5-.22-1.9-.63l-.8.63c.5.7 1.3 1.07 2.7 1.07 1.9 0 3-1 3-2.2 0-1.06-.7-1.66-2-1.83l-.97-.13c-.7-.09-1.03-.26-1.03-.53 0-.35.45-.57 1.2-.57.7 0 1.2.2 1.5.5l.6-.6c-.5-.52-1.2-.82-2.3-.82z'/%3E%3C/svg%3E")`;
      return {
        width: "var(--dropdown-menu-icon-size)",
        height: "var(--dropdown-menu-icon-size)",
        backgroundImage: stripeSvg,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
        flexShrink: 0,
      };
    }

    return {
      width: "var(--dropdown-menu-icon-size)",
      height: "var(--dropdown-menu-icon-size)",
      backgroundColor: isDanger
        ? "var(--dropdown-menu-item-color-danger)"
        : "var(--dropdown-menu-item-color)",
      mask: `${getIconMask(iconName)} no-repeat center`,
      WebkitMask: `${getIconMask(iconName)} no-repeat center`,
      maskSize: "contain",
      WebkitMaskSize: "contain",
      flexShrink: 0,
    };
  }
);

export const DropdownMenu = ({
  items,
  isOpen = true,
  className,
}: DropdownMenuProps) => {
  if (!isOpen) return null;

  return (
    <CenteredWrapper className={className}>
      <MenuDropdown role="menu" aria-label="Actions">
        {items.map((item) => (
          <MenuItem
            key={item.id}
            isDanger={item.isDanger}
            onClick={item.onClick}
            role="menuitem"
            aria-label={item.label}
          >
            <MenuIcon
              iconName={item.icon}
              isDanger={item.isDanger}
              iconSvg={item.iconSvg}
            />
            {item.label}
          </MenuItem>
        ))}
      </MenuDropdown>
    </CenteredWrapper>
  );
};

export default DropdownMenu;
