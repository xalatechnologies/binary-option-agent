# Binary Option Agent - Codebase Segments

## Segment 1: Application Overview and Frontend Core
### Pages and Routes
- `./src/app/page.tsx`
- `./src/app/layout.tsx`
- `./src/app/auth/error/page.tsx`
- `./src/app/auth/signin/page.tsx`
- `./src/app/auth/signout/page.tsx`
- `./src/app/auth/verify/page.tsx`

### Components
- `./src/components/Button.tsx`
- `./src/components/ClientProvider.tsx`
- `./src/components/SpeechToTextArea.tsx`
- `./src/components/theme/ThemeAwareToast.tsx`
- `./src/components/theme/ThemeProvider.tsx`
- `./src/components/ui/button.tsx`
- `./src/stories/Button.stories.tsx`
- `./src/stories/Button.tsx`

## Segment 2: Frontend Utilities, Context, and Styles
### Hooks and Client Utilities
- `./src/hooks/useQueryHooks.ts`
- `./src/lib/trpc/client.ts`
- `./src/lib/trpc/client.tsx`
- `./src/lib/trpc/react.tsx`
- `./src/lib/utils.ts`

### Configuration and Styling
- `./.storybook/main.ts`
- `./.storybook/preview.ts`
- `./tailwind.config.ts`
- `./postcss.config.mjs`
- `./styling-guide.md`

## Segment 3: Backend Core (Controllers, Models, and Routes)
### API Routes
- `./src/app/api/auth/[...nextauth]/route.ts`
- `./src/app/api/transcribe/route.ts`
- `./src/app/api/trpc/[trpc]/route.ts`
- `./src/app/api/upload/route.ts`
- `./src/app/api/inngest/handler.ts`

### API Definitions and Models
- `./src/lib/api/root.ts`
- `./src/lib/api/trpc.ts`
- `./src/lib/types.ts`
- `./src/lib/zod/userSchemas.ts`

## Segment 4: Backend Services, Middleware, and Utils
### Services
- `./src/lib/aiClient.ts`
- `./src/lib/auth/index.ts`
- `./src/lib/email/sendEmail.ts`
- `./src/lib/email/templates/WelcomeEmail.tsx`
- `./src/lib/storage.ts`
- `./src/lib/inngest.ts`
- `./src/lib/trpc/server.ts`

### Configuration
- `./next.config.ts`
- `./inngest.config.ts`

## Segment 5: Database, Tests, and Config
### Database
- `./src/lib/db.ts`
- `./prisma/`

### Project Configuration
- `./package.json`
- `./package-lock.json`
- `./tsconfig.json`
- `./vercel.json`
- `./components.json`

### Documentation
- `./README.md`
- `./codebase-overview.md`
- `./project-overview.md`
- `./LICENSE`
- `./prompt.md`
- `./screenshots/`
- `./scripts/`
- `./public/`
