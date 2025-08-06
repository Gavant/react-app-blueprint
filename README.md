# React App Blueprint

A modern, production-ready React application blueprint built with TypeScript, Vite, Material-UI, and comprehensive tooling for enterprise-grade development.

## Code Coverage

| Statements                                                                         | Branches                                                                       | Functions                                                                        | Lines                                                                    |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ![Statements](https://img.shields.io/badge/statements-74.44%25-red.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-79.93%25-red.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-71.53%25-red.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-74.44%25-red.svg?style=flat) |

## Overview

This React app blueprint provides a robust foundation for building modern web applications with enterprise-grade tooling and best practices. It includes authentication flows, GraphQL integration, comprehensive testing setup, and automated documentation generation.

### Key Features

- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Material-UI (MUI)** with styled-components integration
- **Apollo GraphQL** client with code generation
- **Authentication system** with login/forgot password flows
- **Vitest** testing framework with comprehensive setup
- **ESLint & Prettier** for code quality and formatting
- **Docusaurus** for documentation
- **Docker** support for containerization
- **Plop.js** templates for code generation
- **Feature-based architecture** for scalability

## Project Structure

```
├── app/                    # Main React application
│   ├── src/
│   │   ├── core/          # Reusable components, hooks, utilities
│   │   ├── features/      # Feature-specific modules
│   │   │   ├── authentication/
│   │   │   ├── app/
│   │   │   └── 404/
│   │   └── vitest/        # Test configuration
│   ├── templates/         # Plop.js code generation templates
│   └── vite.config.js     # Vite configuration
├── docs/                  # Docusaurus documentation site
├── deployment/            # Deployment scripts and utilities
├── Dockerfile            # Container configuration
└── .github/              # CI/CD workflows
```

## Requirements

- **Node.js** 18+ (LTS recommended)
- **Yarn** 4+ (configured with `.yarnrc.yml`)
- **Docker** (optional, for containerized development)

## Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd react-app-blueprint
yarn install
```

### 2. Development

Start the development server:

```bash
cd app
yarn dev
```

The application will be available at `http://localhost:5173`

### 3. Environment Configuration

Copy and configure environment variables:

```bash
cd app
cp .env.example .env
# Edit .env with your configuration
```

## Available Scripts

### Application (`/app`)

```bash
# Development
yarn dev                 # Start development server
yarn build              # Build for production
yarn preview            # Preview production build

# Testing
yarn test               # Run tests
yarn test:ui            # Run tests with UI interface
yarn test:coverage      # Generate coverage report

# Code Quality
yarn lint               # Run ESLint
yarn lint:fix           # Fix ESLint issues
yarn format             # Format code with Prettier

# Code Generation
yarn codegen            # Generate GraphQL types (local)
yarn codegen:remote     # Generate GraphQL types (remote)
yarn generate           # Run Plop.js generators
```

### Documentation (`/docs`)

```bash
yarn start              # Start documentation server
yarn build              # Build documentation
yarn serve              # Serve built documentation
```

### Root Level

```bash
yarn install            # Install all dependencies
yarn workspace app dev  # Run app development server
yarn workspace docs start  # Run documentation server
```

## Testing

The project uses **Vitest** with a comprehensive testing setup including:

- Unit tests for components and utilities
- Integration tests for features
- Code coverage reporting
- Custom test utilities and setup

```bash
# Run all tests
yarn test

# Watch mode
yarn test --watch

# UI interface
yarn test:ui

# Coverage report
yarn test:coverage
```

Test files are co-located with source files using `.test.ts` or `.test.tsx` extensions.

## GraphQL Integration

The app includes Apollo GraphQL client with automated code generation:

1. **Configure your GraphQL endpoint** in `codegen.ts` or `codegen-remote.ts`
2. **Add your queries/mutations** in `.graphql` files
3. **Generate types**: `yarn codegen`
4. **Use generated hooks** in your components

## Code Generation

### GraphQL Types

```bash
yarn codegen          # Generate from local schema
yarn codegen:remote   # Generate from remote endpoint
```

### Component/Feature Templates

```bash
yarn generate         # Interactive Plop.js generator
```

Templates available:

- React components with tests
- Complete features with routing

## Authentication

The blueprint includes a complete authentication system:

- **Login page** with email/password
- **Forgot password flow** with email reset
- **Protected routes** and navigation
- **Apollo GraphQL** integration for auth APIs
- **Form validation** with proper error handling

## Styling & UI

- **Material-UI (MUI)** components with custom theme
- **Styled-components** integration via `@mui/styled-engine-sc`
- **Responsive design** with theme breakpoints
- **Dark/light mode** support
- **Custom icons** and animations

## Docker Support

Build and run with Docker:

```bash
# Build the image
docker build -t react-app-blueprint .

# Run the container
docker run -p 3000:3000 react-app-blueprint
```

The Dockerfile uses multi-stage builds for optimized production images.

## Documentation

Documentation is built with **Docusaurus** and includes:

- Getting started guides
- API documentation
- Component documentation
- Architecture decisions

```bash
cd docs
yarn start            # Development server at http://localhost:3000
yarn build            # Build static documentation
```

## Deployment

### Production Build

```bash
cd app
yarn build
yarn preview          # Test production build locally
```

### Deployment Utilities

```bash
cd deployment
./utilities.sh        # Available deployment commands
```

### CI/CD

GitHub Actions workflows handle:

- Automated testing on pull requests
- Build verification
- Dependency updates via Dependabot

## Contributing

### Development Workflow

1. **Create a feature branch**: `git checkout -b feature/your-feature`
2. **Make your changes** following the coding standards
3. **Add tests** for new functionality
4. **Run quality checks**: `yarn lint && yarn test`
5. **Update documentation** if needed
6. **Submit a pull request**

### Code Standards

- **TypeScript** strict mode enabled
- **ESLint** with React and TypeScript rules
- **Prettier** for consistent formatting
- **Conventional commits** for clear history
- **Test coverage** for new features

### Adding New Features

1. Use the **feature generator**: `yarn generate`
2. Follow the **feature-based architecture**
3. Include **tests** and **documentation**
4. Update **fence.json** for feature boundaries

## Architecture

### Feature-Based Structure

```
src/
├── core/              # Shared utilities
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── stores/        # Global state management
│   └── utils/         # Utility functions
└── features/          # Feature modules
    ├── authentication/
    ├── app/
    └── 404/
```

### Key Architectural Decisions

- **Feature isolation** with fence.json boundaries
- **Apollo GraphQL** for data fetching
- **Material-UI** for consistent design system
- **Vite** for fast development experience
- **Vitest** for modern testing approach

## Troubleshooting

### Common Issues

1. **Styled components not working in tests**: Ensure `@mui/styled-engine-sc` is properly configured
2. **GraphQL codegen fails**: Check your schema URL and authentication
3. **Build failures**: Clear node_modules and yarn cache, then reinstall

### Getting Help

- Check the [documentation](./docs)
- Review existing [issues](https://github.com/Gavant/react-app-blueprint/issues)
- Create a new issue with detailed reproduction steps

## License

[Add your license information here]

---

## Blueprint Usage

When using this blueprint for a new project:

### Initial Setup

1. **Clone** this repository
2. **Replace** `{{APP_NAME}}` with your actual app name in:
    - This README.md
    - app/index.html
    - docs/docusaurus.config.js
    - Any other template files
3. **Update** repository URLs and project-specific information
4. **Configure** environment variables and API endpoints
5. **Customize** branding, themes, and styling
6. **Delete** this "Blueprint Usage" section

### Blueprint Development

To contribute to the blueprint itself:

1. **Test changes** across different scenarios
2. **Maintain** template placeholders using `{{}}` format
3. **Update documentation** for new features
4. **Ensure backward compatibility** when possible
5. **Add comprehensive tests** for new functionality
