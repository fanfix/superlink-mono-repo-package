import { FinancialSummary } from "../ui/FinancialSummary";

const meta = {
  title: "Components/Widgets/FinancialSummary",
  component: FinancialSummary,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    totalAmount: { control: "text", description: "Total amount value" },
    filteredAmount: { control: "text", description: "Filtered amount value" },
    startDate: { control: "date", description: "Start date for the range" },
    endDate: { control: "date", description: "End date for the range" },
    currency: { control: "text", description: "Currency symbol" },
    className: { control: "text" },
    onDateRangeChange: { action: "dateRangeChange" },
  },
};

export default meta;

// Helper: convert Date or string to the string format the component expects
const toISODate = (d: string | number | Date) => {
  const date = new Date(d);
  // Component formats with toLocaleDateString, so any ISO-compatible string is fine
  return date.toISOString();
};

export const Default = {
  args: {
    totalAmount: "$1,234,567",
    filteredAmount: "$456,789",
    startDate: toISODate("2025-09-01"),
    endDate: toISODate("2025-09-30"),
    currency: "$",
  },
};

export const DifferentCurrency = {
  args: {
    totalAmount: "€1.234.567",
    filteredAmount: "€456.789",
    startDate: toISODate("2025-10-01"),
    endDate: toISODate("2025-10-07"),
    currency: "€",
  },
};

export const NarrowRange = {
  args: {
    totalAmount: "$12,345",
    filteredAmount: "$9,876",
    startDate: toISODate("2025-10-06"),
    endDate: toISODate("2025-10-07"),
  },
};

export const LongNumbers = {
  args: {
    totalAmount: "$12,345,678,901",
    filteredAmount: "$9,876,543,210",
    startDate: toISODate("2025-01-01"),
    endDate: toISODate("2025-12-31"),
  },
};

export const WithClassName = {
  args: {
    totalAmount: "$123,456",
    filteredAmount: "$78,900",
    startDate: toISODate("2025-10-01"),
    endDate: toISODate("2025-10-07"),
    className: "storybook-financial-summary",
  },
};
