import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "../ui/Table";

const meta: Meta<typeof Table> = {
  title: "Components/Data Display/Table",
  component: Table,
  argTypes: {
    columns: {
      description: "Array of column definitions",
    },
    rows: {
      description: "Array of row data",
    },
    showPagination: {
      control: "boolean",
      description: "Whether to show pagination",
    },
    itemsPerPage: {
      control: "number",
      description: "Items per page",
    },
    variant: {
      control: "select",
      options: ["clean", "bordered", "shadowed"],
      description: "Table variant style",
    },
    paginationPosition: {
      control: "select",
      options: ["left", "center", "right"],
      description: "Pagination position",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data matching your screenshot
const sampleColumns = [
  { id: "name", label: "Name", minWidth: 200 },
  { id: "userId", label: "User ID", minWidth: 120 },
  { id: "status", label: "Status", minWidth: 150 },
  { id: "assignedTo", label: "Assigned To", minWidth: 120 },
];

const sampleRows = [
  {
    name: "Robert Fox",
    userId: "4915500c",
    status: "Added on 17 July, 2023",
    assignedTo: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    assignedAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
  },
  {
    name: "Robert Fox",
    userId: "4915500c",
    status: "Added on 17 July, 2023",
    assignedTo: "Jane Smith",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    assignedAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  },
  {
    name: "Robert Fox",
    userId: "4915500c",
    status: "Added on 17 July, 2023",
    assignedTo: "Mike Johnson",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    assignedAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  },
  {
    name: "Robert Fox",
    userId: "4915500c",
    status: "Added on 17 July, 2023",
    assignedTo: "Sarah Wilson",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    assignedAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
  },
  {
    name: "Robert Fox",
    userId: "4915500c",
    status: "Added on 17 July,2023",
    assignedTo: "David Brown",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    assignedAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  },
  {
    name: "Robert Fox",
    userId: "4915500c",
    status: "Added on 17 July,2023",
    assignedTo: "Emma Davis",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    assignedAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  },
];

// Container style for stories
const containerStyle = {
  padding: "var(--container-padding)",
  width: "100%",
  maxWidth: "1200px",
};

export const Default: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows,
        showPagination: true,
        itemsPerPage: 10,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
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

export const UserManagement: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows,
        showPagination: true,
        itemsPerPage: 5,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
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

export const WithoutPagination: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows.slice(0, 3),
        showPagination: false,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
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

export const CustomActions: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows,
        showPagination: true,
        itemsPerPage: 5,
        actions: (row: any) => (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                <button
                    style={{
                        background: "none",
                        border: "none",
                        padding: "var(--action-button-padding)",
                        margin: "var(--action-button-margin)",
                        borderRadius: "var(--action-button-border-radius)",
                        cursor: "pointer",
                        color: "var(--table-action-icon-color)",
                        transition: "all 0.2s ease",
                    }}
                    title="Export"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10,17 15,12 10,7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                </button>
                <button
                    style={{
                        background: "none",
                        border: "none",
                        padding: "var(--action-button-padding)",
                        margin: "var(--action-button-margin)",
                        borderRadius: "var(--action-button-border-radius)",
                        cursor: "pointer",
                        color: "var(--table-action-icon-color)",
                        transition: "all 0.2s ease",
                    }}
                    title="View"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </button>
                <button
                    style={{
                        background: "none",
                        border: "none",
                        padding: "var(--action-button-padding)",
                        margin: "var(--action-button-margin)",
                        borderRadius: "var(--action-button-border-radius)",
                        cursor: "pointer",
                        color: "var(--table-action-icon-color)",
                        transition: "all 0.2s ease",
                    }}
                    title="Delete"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="3,6 5,6 21,6" />
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                </button>
            </div>
        ),
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
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

export const EmployeeTable: Story = {
    args: {
        columns: [
            { id: "name", label: "Employee Name", minWidth: 200 },
            { id: "employeeId", label: "Employee ID", minWidth: 120 },
            { id: "department", label: "Department", minWidth: 150 },
            { id: "role", label: "Role", minWidth: 150 },
            { id: "manager", label: "Manager", minWidth: 120 },
        ],
        rows: [
            {
                name: "Alice Johnson",
                employeeId: "EMP001",
                department: "Engineering",
                role: "Senior Developer",
                manager: "Bob Smith",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
                assignedAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            },
            {
                name: "John Davis",
                employeeId: "EMP002",
                department: "Design",
                role: "UI/UX Designer",
                manager: "Sarah Wilson",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
                assignedAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
            },
            {
                name: "Emma Brown",
                employeeId: "EMP003",
                department: "Marketing",
                role: "Marketing Manager",
                manager: "Mike Johnson",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
                assignedAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            },
        ],
        showPagination: false,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
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

export const ProjectTable: Story = {
    args: {
        columns: [
            { id: "name", label: "Project Name", minWidth: 200 },
            { id: "projectId", label: "Project ID", minWidth: 120 },
            { id: "status", label: "Status", minWidth: 150 },
            { id: "deadline", label: "Deadline", minWidth: 150 },
            { id: "assignedTo", label: "Project Manager", minWidth: 120 },
        ],
        rows: [
            {
                name: "Website Redesign",
                projectId: "PRJ001",
                status: "In Progress",
                deadline: "15 Oct, 2023",
                assignedTo: "Sarah Wilson",
                avatar: "https://via.placeholder.com/40/3b82f6/ffffff?text=WR",
                assignedAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
            },
            {
                name: "Mobile App Development",
                projectId: "PRJ002",
                status: "Planning",
                deadline: "30 Nov, 2023",
                assignedTo: "John Davis",
                avatar: "https://via.placeholder.com/40/10b981/ffffff?text=MA",
                assignedAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            },
            {
                name: "API Integration",
                projectId: "PRJ003",
                status: "Completed",
                deadline: "5 Sep, 2023",
                assignedTo: "Alice Johnson",
                avatar: "https://via.placeholder.com/40/22c55e/ffffff?text=AI",
                assignedAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
            },
        ],
        showPagination: false,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
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

export const LargeDataset: Story = {
    args: {
        columns: sampleColumns,
        rows: Array.from({ length: 50 }, (_, index) => ({
            name: `User ${index + 1}`,
            userId: `USER${String(index + 1).padStart(3, "0")}`,
            status: `Added on ${Math.floor(Math.random() * 30) + 1} July, 2023`,
            assignedTo: `Manager ${Math.floor(index / 5) + 1}`,
            avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&v=${index}`,
            assignedAvatar: `https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face&v=${index}`,
        })),
        showPagination: true,
        itemsPerPage: 10,
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
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

// Variant Stories
export const CleanVariant: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows,
        showPagination: true,
        itemsPerPage: 10,
        variant: "clean",
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Clean variant with no borders or shadows - perfect for minimal designs"
            }
        }
    }
};

export const BorderedVariant: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows,
        showPagination: true,
        itemsPerPage: 10,
        variant: "bordered",
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Bordered variant with borders but no shadow"
            }
        }
    }
};

export const ShadowedVariant: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows,
        showPagination: true,
        itemsPerPage: 10,
        variant: "shadowed",
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Shadowed variant with borders and box shadow - default style"
            }
        }
    }
};

// Pagination Position Stories
export const PaginationLeft: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows,
        showPagination: true,
        itemsPerPage: 10,
        variant: "clean",
        paginationPosition: "left",
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Pagination positioned on the left side"
            }
        }
    }
};

export const PaginationCenter: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows,
        showPagination: true,
        itemsPerPage: 10,
        variant: "clean",
        paginationPosition: "center",
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Pagination positioned in the center (default)"
            }
        }
    }
};

export const PaginationRight: Story = {
    args: {
        columns: sampleColumns,
        rows: sampleRows,
        showPagination: true,
        itemsPerPage: 10,
        variant: "clean",
        paginationPosition: "right",
    },
    render: (args) => (
        <div style={containerStyle}>
            <Table {...args} />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Pagination positioned on the right side"
            }
        }
    }
};
