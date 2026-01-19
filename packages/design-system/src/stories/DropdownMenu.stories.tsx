import { DropdownMenu } from "../ui/DropdownMenu";

const meta = {
  title: "Components/Navigation/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    items: {
      description: "Array of menu items to display",
    },
    isOpen: {
      description: "Whether the menu is visible",
      control: "boolean",
    },
    className: {
      description: "Custom CSS class name",
    },
  },
};

export default meta;

const defaultItems = [
  {
    id: "delete",
    label: "Delete",
    icon: "delete",
    isDanger: true,
    onClick: () => console.log("Delete clicked"),
  },
  {
    id: "login",
    label: "Log In",
    icon: "login",
    onClick: () => console.log("Log In clicked"),
  },
  {
    id: "account-claim",
    label: "Account Claim Link",
    icon: "account-claim",
    onClick: () => console.log("Account Claim Link clicked"),
  },
  {
    id: "stripe",
    label: "Connect Stripe Link",
    icon: "stripe",
    onClick: () => console.log("Connect Stripe Link clicked"),
  },
  {
    id: "duplicate",
    label: "Duplicate Profile",
    icon: "duplicate",
    onClick: () => console.log("Duplicate Profile clicked"),
  },
  {
    id: "edit",
    label: "Edit Profile",
    icon: "edit",
    onClick: () => console.log("Edit Profile clicked"),
  },
];

export const Default = {
  args: {
    items: defaultItems,
    isOpen: true,
  },
};

export const WithFewItems = {
  args: {
    items: [
      {
        id: "delete",
        label: "Delete",
        icon: "delete",
        isDanger: true,
        onClick: () => console.log("Delete clicked"),
      },
      {
        id: "edit",
        label: "Edit Profile",
        icon: "edit",
        onClick: () => console.log("Edit Profile clicked"),
      },
    ],
    isOpen: true,
  },
};

export const OnlyDangerousItems = {
  args: {
    items: [
      {
        id: "delete",
        label: "Delete",
        icon: "delete",
        isDanger: true,
        onClick: () => console.log("Delete clicked"),
      },
    ],
    isOpen: true,
  },
};

export const Hidden = {
  args: {
    items: defaultItems,
    isOpen: false,
  },
};
