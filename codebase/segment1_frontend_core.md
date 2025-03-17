# Segment 1: Application Overview and Frontend Core

## Purpose
This segment represents the user-facing components of the binary option agent application. It contains the main pages, layout structures, and UI components that users interact with directly. This segment focuses on the presentation layer and user experience.

## Relationship to Other Segments
- **Consumes from Segment 2**: Utilizes frontend utilities, hooks, and styling defined in Segment 2
- **Consumes from Segment 3**: Interfaces with the API routes and endpoints from Segment 3
- **Consumes from Segment 4**: Leverages services and utilities from Segment 4 for authentication, data processing, etc.

## Key Files and Their Functions

### Pages and Routes
- `./src/app/page.tsx`: The main landing page of the application, handles both authenticated and unauthenticated views
- `./src/app/layout.tsx`: The root layout component that wraps all pages, providing consistent structure
- `./src/app/auth/signin/page.tsx`: Handles user authentication through the sign-in process
- `./src/app/auth/signout/page.tsx`: Manages the user sign-out flow
- `./src/app/auth/error/page.tsx`: Displays authentication errors to users
- `./src/app/auth/verify/page.tsx`: Verifies user email during authentication process

### Components
- `./src/components/Button.tsx`: Reusable button component with standardized styling
- `./src/components/ClientProvider.tsx`: Provides client-side context and state management
- `./src/components/SpeechToTextArea.tsx`: Component for voice input conversion to text
- `./src/components/theme/ThemeProvider.tsx`: Manages theme context and theme switching functionality
- `./src/components/theme/ThemeAwareToast.tsx`: Toast notifications that respect the current theme
- `./src/components/ui/button.tsx`: Low-level button UI component with Tailwind styling
- `./src/stories/Button.stories.tsx`: Storybook stories for button component showcasing various states
- `./src/stories/Button.tsx`: Button component specifically for Storybook demonstrations

## Critical Dependencies
- **Next.js App Router**: The foundation for the frontend routing and page structure
- **React**: Core library for all UI components
- **NextAuth.js**: Authentication system integrated into the page structure
- **Tailwind CSS**: Styling system used throughout the components
- **Lucide React**: Icon library used for UI elements
- **Storybook**: For component visualization and documentation

## Design Principles
- **Single Responsibility**: Each component handles one specific UI concern
- **Open/Closed**: Components are designed to be extended through props without modification
- **Liskov Substitution**: UI components maintain consistent interfaces for interchangeability
- **Interface Segregation**: Component props are specific to their needs
- **Dependency Inversion**: High-level components don't depend on low-level implementations
