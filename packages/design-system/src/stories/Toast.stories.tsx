import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "../ui/Toast";

const meta = {
  title: "Components/Feedback/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    message: {
      control: "text",
      description: "Toast message text",
    },
    type: {
      control: "select",
      options: ["success", "error", "warning", "info"],
      description: "Toast type/variant",
    },
    visible: {
      control: "boolean",
      description: "Whether the toast is visible",
    },
    position: {
      control: "select",
      options: ["top", "bottom", "top-center", "bottom-center"],
      description: "Toast position",
    },
    showCloseButton: {
      control: "boolean",
      description: "Whether to show close button",
    },
  },
} as Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof Toast>;

// Container style for all stories
const containerStyle = {
  padding: "40px",
  width: "500px",
  height: "200px",
  position: "relative",
};

export const Default: Story = {
    args: {
        message: "Reset password mail was sent successfully.",
        type: "success",
        visible: true,
        position: "top-center",
        showCloseButton: true,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};

export const Success: Story = {
    args: {
        message: "Operation completed successfully!",
        type: "success",
        visible: true,
        position: "top-center",
        showCloseButton: true,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};

export const Error: Story = {
    args: {
        message: "Something went wrong. Please try again.",
        type: "error",
        visible: true,
        position: "top-center",
        showCloseButton: true,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};

export const Warning: Story = {
    args: {
        message: "Please check your input and try again.",
        type: "warning",
        visible: true,
        position: "top-center",
        showCloseButton: true,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};

export const Info: Story = {
    args: {
        message: "Here is some helpful information.",
        type: "info",
        visible: true,
        position: "top-center",
        showCloseButton: true,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};

export const WithoutCloseButton: Story = {
    args: {
        message: "This toast will auto-hide after a few seconds.",
        type: "success",
        visible: true,
        position: "top-center",
        showCloseButton: false,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};

export const LongMessage: Story = {
    args: {
        message: "This is a longer message that demonstrates how the toast component handles text that might wrap to multiple lines.",
        type: "info",
        visible: true,
        position: "top-center",
        showCloseButton: true,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};

export const BottomPosition: Story = {
    args: {
        message: "This toast appears at the bottom.",
        type: "success",
        visible: true,
        position: "bottom-center",
        showCloseButton: true,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};

export const EmailSentSuccess: Story = {
    args: {
        message: "Reset password mail was sent successfully.",
        type: "success",
        visible: true,
        position: "top-center",
        showCloseButton: true,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};

export const FormSavedSuccess: Story = {
    args: {
        message: "Your changes have been saved successfully.",
        type: "success",
        visible: true,
        position: "top-center",
        showCloseButton: true,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};

export const LoginSuccess: Story = {
    args: {
        message: "Welcome back! You have successfully logged in.",
        type: "success",
        visible: true,
        position: "top-center",
        showCloseButton: true,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};

export const ProfileUpdated: Story = {
    args: {
        message: "Your profile has been updated successfully.",
        type: "success",
        visible: true,
        position: "top-center",
        showCloseButton: true,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};

export const FileUploaded: Story = {
    args: {
        message: "File uploaded successfully.",
        type: "success",
        visible: true,
        position: "top-center",
        showCloseButton: true,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Toast {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: ""
            }
        }
    }
};
