import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Toggle } from "../ui/Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Forms/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    checked: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    size: {
      control: {
        type: "radio",
        options: ["sm", "md"],
      },
    },
    activeColor: {
      control: "color",
    },
    inactiveColor: {
      control: "color",
    },
  },
  args: {
    checked: true,
    disabled: false,
    size: "md",
    activeColor: "#22C55E",
    inactiveColor: "#E5E7EB",
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};

export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false);

    return (
      <Toggle
        {...args}
        checked={checked}
        onChange={(state) => {
          setChecked(state);
          args.onChange?.(state);
        }}
      />
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Toggle {...args} size="sm" />
      <Toggle {...args} size="md" />
    </div>
  ),
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const CustomColors: Story = {
  args: {
    checked: true,
    activeColor: "#2563EB",
    inactiveColor: "#CBD5F5",
  },
};

