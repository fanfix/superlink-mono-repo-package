# Superline Monorepo

A modern monorepo setup with Turborepo, Yarn workspaces, and a comprehensive design system.

## 🏗️ Architecture

### Design System Layer
- **Package**: 
- **Purpose**: Centralized UI components and theming
- **Tech Stack**: React, Material-UI, TypeScript, Storybook

### Applications Layer
- **Admin Portal**:  - Administrative interface
- **Agency Portal**:  - Agency management interface  
- **Client Portal**:  - Client-facing interface

## 📦 Package Structure

```
ProjectSetup/
├── apps/
│   ├── admin/          # Admin Portal (Next.js)
│   ├── agency/         # Agency Portal (Next.js)
│   └── client/         # Client Portal (Next.js)
├── packages/
│   └── design-system/  # Shared UI components
├── .storybook/         # Storybook configuration
├── turbo.json          # Turborepo configuration
├── package.json        # Root workspace configuration
└── tsconfig.base.json  # Shared TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Yarn 4.10.3+

### Installation
```bash
# Install all dependencies
yarn install

# Build the design system
yarn workspace @superline/design-system build
```

## 🛠️ Development

### Start Development Servers
```bash
# Start all apps in development mode
yarn dev

# Start individual apps
yarn workspace @superline/admin dev
yarn workspace @superline/agency dev
yarn workspace @superline/client dev

# Start Storybook (design system documentation)
yarn workspace @superline/design-system storybook --port 6007
```

### Build Commands
```bash
# Build all packages
yarn build

# Build individual packages
yarn workspace @superline/design-system build
yarn workspace @superline/admin build
yarn workspace @superline/agency build
yarn workspace @superline/client build
```

## 🎨 Design System

### Components Available
- **Button** - Primary and secondary variants
- **Label** - Form labels with proper accessibility
- **TextField** - Single-line text input
- **TextArea** - Multi-line text input
- **Select** - Dropdown selection
- **Checkbox** - Boolean input with label
- **Radio** - Single selection from options

### Theming
- **Light Theme** - Default theme with clean, modern styling
- **Dark Theme** - Dark mode support
- **Custom Tokens** - Consistent colors, typography, and spacing
- **Material-UI Integration** - Full MUI theming system

### Storybook
Access the design system documentation at `http://localhost:6006` when running:
```bash
yarn workspace @superline/design-system storybook --port 6007
```

## 🔧 Tooling & Configuration

### Turborepo
- **Pipeline Management** - Efficient build orchestration
- **Caching** - Smart caching for faster builds
- **Parallel Execution** - Concurrent task execution

### TypeScript
- **Shared Configuration** - `tsconfig.base.json` for consistency
- **Strict Mode** - Full type safety across the monorepo
- **Path Mapping** - Clean imports with workspace references

### ESLint & Prettier
- **Code Quality** - Consistent code formatting and linting
- **React Rules** - Optimized for React development
- **Import Organization** - Automatic import sorting

### Git Hooks
- **Husky** - Git hooks for code quality
- **Lint-staged** - Pre-commit linting and formatting
- **Commitlint** - Conventional commit message validation

## 📝 Scripts

### Root Level Scripts
```bash
yarn dev          # Start all development servers
yarn build        # Build all packages
yarn lint         # Lint all packages
yarn typecheck    # Type check all packages
yarn format       # Format code with Prettier
```

### Package Scripts
Each package has its own scripts:
- `dev` - Development server
- `build` - Production build
- `lint` - ESLint checking
- `typecheck` - TypeScript checking

## 🏢 Workspace Configuration

### Yarn Workspaces
- **Apps**: `apps/*` - Next.js applications
- **Packages**: `packages/*` - Shared libraries
- **Dependency Management** - Efficient package resolution

### Package Manager
- **Yarn 4.10.3** - Modern package management
- **PnP Mode** - Zero-install with Plug'n'Play
- **Workspace Protocol** - Internal package references

## 🎯 Usage in Apps

### Importing Design System Components
```tsx
import { 
  Button, 
  TextField, 
  TextArea, 
  Select, 
  Checkbox, 
  Radio 
} from '@superline/design-system';
import { MenuItem, Box, Stack, Typography } from '@mui/material';

export default function MyPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1">My App</Typography>
      <Stack spacing={2}>
        <TextField label="Email" placeholder="Enter email" />
        <Button variant="contained">Submit</Button>
      </Stack>
    </Box>
  );
}
```

## 🔄 Development Workflow

1. **Make Changes** - Edit components in `packages/design-system`
2. **Build Package** - `yarn workspace @superline/design-system build`
3. **Test in Apps** - Changes automatically available in all apps
4. **Document in Storybook** - Add stories for new components
5. **Commit Changes** - Use conventional commits with proper formatting

## 📚 Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Yarn Workspaces](https://yarnpkg.com/features/workspaces)
- [Material-UI](https://mui.com/)
- [Storybook](https://storybook.js.org/)
- [Next.js](https://nextjs.org/docs)

## 🤝 Contributing

1. Follow the established code style (ESLint + Prettier)
2. Add Storybook stories for new components
3. Use conventional commit messages
4. Ensure all TypeScript checks pass
5. Test changes across all applications

## 📄 License

Private project - All rights reserved.

## 🎨 Theming Architecture

### Semantic Color System
All colors are managed through CSS custom properties (CSS variables) with semantic names:

```css
:root {
  /* Primary Colors */
  --color-primary: #2563eb;
  --color-primary-light: #60a5fa;
  --color-primary-dark: #1d4ed8;
  
  /* Secondary Colors */
  --color-secondary: #64748b;
  --color-secondary-light: #94a3b8;
  --color-secondary-dark: #475569;
  
  /* Semantic Colors */
  --color-error: #dc2626;
  --color-warning: #d97706;
  --color-success: #059669;
  
  /* Background & Text */
  --color-background: #ffffff;
  --color-background-paper: #f8fafc;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
}
```

### MUI Theme Integration
- **No Direct Hex/RGB Values**: All colors use semantic CSS variables
- **Component-Level Theming**: MUI components styled through theme overrides
- **Consistent Styling**: All components inherit from the same design tokens
- **Dark Mode Support**: Automatic theme switching with CSS variable updates

### Theme Structure
```typescript
// All components use MUI theming, not hardcoded styles
const theme = createTheme({
  palette: {
    primary: { main: 'var(--color-primary)' },
    secondary: { main: 'var(--color-secondary)' },
    // ... other semantic colors
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: 'var(--color-primary)',
          '&:hover': { backgroundColor: 'var(--color-primary-dark)' }
        }
      }
    }
  }
});
```
