import { AddFilterDropdown } from "../ui/AddFilterDropdown";
import { Box, Typography } from "@mui/material";

const meta = {
  title: "Components/Forms/AddFilterDropdown",
  component: AddFilterDropdown,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    buttonText: {
      control: "text",
      description: "Button text",
    },
    items: {
      control: "object",
      description: "Filter menu items",
    },
  },
};

export default meta;

const defaultFilterItems = [
  { id: "lead-type", label: "Lead Type", onClick: () => console.log("Lead Type clicked") },
  { id: "utm-source", label: "UTM Source", onClick: () => console.log("UTM Source clicked") },
  { id: "utm-campaign", label: "UTM Campaign", onClick: () => console.log("UTM Campaign clicked") },
  { id: "utm-medium", label: "UTM Medium", onClick: () => console.log("UTM Medium clicked") },
  { id: "status-deleted", label: "Status: Deleted", onClick: () => console.log("Status: Deleted clicked") },
];

export const Default = {
  args: {
    buttonText: "ADD FILTER",
    items: defaultFilterItems,
  },
};

export const CustomItems = {
  args: {
    buttonText: "ADD FILTER",
    items: [
      { id: "status", label: "Status", onClick: () => console.log("Status clicked") },
      { id: "role", label: "Role", onClick: () => console.log("Role clicked") },
      { id: "date", label: "Date Range", onClick: () => console.log("Date Range clicked") },
      { id: "category", label: "Category", onClick: () => console.log("Category clicked") },
    ],
  },
};

export const CustomButtonText = {
  args: {
    buttonText: "FILTER OPTIONS",
    items: defaultFilterItems,
  },
};

export const SingleItem = {
  args: {
    buttonText: "ADD FILTER",
    items: [
      { id: "status", label: "Status", onClick: () => console.log("Status clicked") },
    ],
  },
};

export const ManyItems = {
  args: {
    buttonText: "ADD FILTER",
    items: [
      { id: "lead-type", label: "Lead Type", onClick: () => console.log("Lead Type clicked") },
      { id: "utm-source", label: "UTM Source", onClick: () => console.log("UTM Source clicked") },
      { id: "utm-campaign", label: "UTM Campaign", onClick: () => console.log("UTM Campaign clicked") },
      { id: "utm-medium", label: "UTM Medium", onClick: () => console.log("UTM Medium clicked") },
      { id: "status", label: "Status", onClick: () => console.log("Status clicked") },
      { id: "role", label: "Role", onClick: () => console.log("Role clicked") },
      { id: "date", label: "Date Range", onClick: () => console.log("Date Range clicked") },
      { id: "category", label: "Category", onClick: () => console.log("Category clicked") },
    ],
  },
};

export const InContainer = {
  render: () => (
    <Box sx={{ padding: "var(--padding-xl)", backgroundColor: "#f5f5f5", minWidth: 400 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--margin-lg)" }}>
        <Typography variant="h6">Filters</Typography>
        <AddFilterDropdown items={defaultFilterItems} />
      </Box>
      <Box sx={{ padding: "var(--padding-xl)", backgroundColor: "var(--color-white)", borderRadius: "var(--border-radius-md)" }}>
        <Typography variant="body2" sx={{ color: "var(--color-text-secondary)" }}>
          Click "ADD FILTER" button above to see the dropdown menu.
        </Typography>
      </Box>
    </Box>
  ),
};

export const Interactive = {
  args: {
    buttonText: "ADD FILTER",
    items: defaultFilterItems,
  },
};

