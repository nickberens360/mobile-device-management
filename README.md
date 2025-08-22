# NBC Universal Device Management System

A Vue.js web application with TypeScript that enables NBC Universal network engineers to remotely configure and manage networked devices (iPads, laptops, mobile phones) across various properties including movie sets, theme parks, and promotional events.

## Features

- **Dashboard**: Overview of devices, locations, and recent activities
- **Device Configuration**: Multi-step wizard for configuring multiple devices
- **Template Management**: Pre-defined configuration templates for different scenarios
- **Device Management**: View and manage all devices across locations
- **Configuration History**: Track all configuration changes with rollback capability
- **vue-atomic-docs**: Atomic design documentation and component library

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vuetify 3 (Material Design components)
- Pinia (state management)
- Vue Router 4
- Axios (HTTP client)
- Vite (build tool)

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── api/              # API service layer
├── assets/           # Static assets and styles
├── components/       # Vue components
│   ├── common/       # Shared components
│   ├── devices/      # Device-related components
│   └── forms/        # Form components
├── composables/      # Vue composables
├── layouts/          # Layout components
├── mocks/            # Mock data for development
├── plugins/          # Vue plugins (Vuetify)
├── router/           # Vue Router configuration
├── stores/           # Pinia stores
├── types/            # TypeScript type definitions
└── views/            # Page components
```

## Phase 1 Implementation

This Phase 1 implementation includes:
- ✅ Basic Vue 3 + TypeScript project setup
- ✅ Vuetify 3 integration with NBC Universal theming
- ✅ Type-safe Pinia stores for state management
- ✅ Mock API layer for development
- ✅ Dashboard with summary cards and quick actions
- ✅ Location selector with detailed information
- ✅ Device configuration wizard (3-step process)
- ✅ Template management with preview
- ✅ Device management table
- ✅ Configuration history timeline

## Environment Variables

- `VITE_API_BASE_URL`: Base URL for the API
- `VITE_APP_TITLE`: Application title
- `VITE_MOCK_API`: Enable mock API mode for development

## NBC Universal Branding

The application uses NBC Universal's brand colors:
- Primary: #5E2C91 (NBC Purple)
- Secondary: #F37021 (NBC Orange)  
- Accent: #0089D0 (NBC Blue)

## Next Steps (Phase 2 & 3)

- Real API integration
- Advanced device filtering and bulk operations
- Dynamic form generation based on device types
- Enhanced error handling and user feedback
- Configuration rollback functionality
- User authentication and role-based access
- Mobile responsiveness optimization