import { AgencyCount } from "../ui/AgencyCount";

const meta = {
  title: "Components/Widgets/AgencyCount",
  component: AgencyCount,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    label: {
      control: "text",
    },
    count: {
      control: "text",
    },
  },
};

export default meta;

export const Default = {
  args: {
    label: "Total Agencies",
    count: "594",
  },
};

export const TotalUsers = {
  args: {
    label: "Total Users",
    count: "1,234",
  },
};

export const ActiveProjects = {
  args: {
    label: "Active Projects",
    count: "87",
  },
};

export const LargeNumber = {
  args: {
    label: "Total Revenue",
    count: "45,678",
  },
};

export const Interactive = {
  args: {
    label: "Total Agencies",
    count: "594",
    onClick: () => console.log("Agency count clicked!"),
  },
};
