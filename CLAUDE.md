# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**dobeunet** is a React + TypeScript Progressive Web App (PWA) built with Vite, using Supabase for backend services, shadcn/ui for the component library, and TailwindCSS for styling. The application features authentication, admin dashboard, and PWA capabilities with service worker support.

## Development Commands

### Running the Application
```bash
npm run dev           # Start development server (Vite)
npm run build         # Build for production
npm run preview       # Preview production build locally
```

### Code Quality
```bash
npm run lint          # Run ESLint on all .ts/.tsx files
npm run typecheck     # Type-check without emitting files
```

## Architecture

### Application Entry Points
- `src/main.tsx` - Application root that sets up PWA service worker registration and renders the App component
- `src/App.tsx` - Main app component that configures all providers and routing

### Core Provider Hierarchy
The application wraps components in this provider structure (from outermost to innermost):
```
QueryClientProvider (@tanstack/react-query)
  └─ ThemeProvider (next-themes, default: dark mode)
      └─ AuthProvider (Supabase auth context)
          └─ TooltipProvider (Radix UI)
              └─ BrowserRouter (react-router-dom)
```

### Authentication Architecture
- **AuthContext** (`src/contexts/AuthContext.tsx`) provides centralized authentication state
- Supports email/password and OAuth (Google, GitHub, Apple) via Supabase
- Auth state listener is set up BEFORE checking existing session to prevent race conditions
- Uses localStorage for session persistence with auto-refresh tokens

### Supabase Integration
- Client configuration: `src/integrations/supabase/client.ts`
- TypeScript types: `src/integrations/supabase/types.ts`
- Environment variables required:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### Routing Structure
All routes defined in `src/App.tsx`:
- `/` - Index/landing page
- `/auth` - Authentication page
- `/admin`, `/admin-login` - Admin login
- `/admin-dashboard`, `/admin-dash` - Admin dashboard
- `/privacy` - Privacy Policy
- `/TOS` - Terms of Service
- `*` - 404 Not Found

### Component Organization
- `src/components/ui/` - shadcn/ui components (Radix UI primitives with Tailwind styling)
- `src/components/layout/` - Layout components
- `src/components/sections/` - Page section components
- `src/components/auth/` - Authentication-related components
- `src/pages/` - Page-level components corresponding to routes

### Utility Structure
- `src/lib/utils.ts` - General utility functions (includes `cn()` for className merging)
- `src/utils/pwaUtils.ts` - PWA-specific utilities (service worker, install prompt)
- `src/hooks/` - Custom React hooks:
  - `use-toast.ts` - Toast notification hook (sonner)
  - `use-mobile.tsx` - Mobile viewport detection
  - `useActiveSection.ts` - Track active section for navigation
  - `useAnalytics.ts` - Analytics tracking utilities

### shadcn/ui Configuration
The project uses shadcn/ui with the following configuration (`components.json`):
- Style: default
- Base color: slate
- CSS variables enabled
- Path aliases configured for `@/components`, `@/lib`, `@/hooks`
- Tailwind config: `tailwind.config.ts`
- Global styles: `src/index.css`

### Path Aliases
Vite is configured with `@` alias pointing to `src/`:
```typescript
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
```

### PWA Features
- Service worker registered in production mode only (`src/main.tsx`)
- Install prompt handling via `setupPWAInstallPrompt()`
- PWA manifest: `public/manifest.json`
- Icons stored in `public/icons/`

## Key Technical Decisions

### State Management
- React Query (@tanstack/react-query) for server state
- React Context for global state (Auth, Theme)
- Local component state with useState/useReducer

### Styling Approach
- TailwindCSS utility-first styling
- CSS variables for theming (defined in `src/index.css`)
- Class variance authority (CVA) for component variants
- Dark mode via next-themes with localStorage persistence

### Form Handling
- react-hook-form with @hookform/resolvers
- Zod for schema validation
- Form components from shadcn/ui (built on Radix UI)

### TypeScript Configuration
- Strict mode enabled
- Separate configs for app (`tsconfig.app.json`) and node (`tsconfig.node.json`)
- Path aliases configured to match Vite configuration

## Component Documentation Standards

The project follows comprehensive documentation standards outlined in `docs/DOCUMENTATION_GUIDE.md`. When creating or updating components:

1. Document in `docs/components/[component-name].md` using the template from `docs/templates/component-template.md`
2. Include: metadata, API reference, usage examples, accessibility, testing
3. All code examples must be complete and runnable with proper imports
4. Use descriptive function names (e.g., `LoadingButtonExample` not `Example1`)
5. Document keyboard navigation, ARIA attributes, and screen reader support
6. Include edge cases and limitations

## Development Workflow Notes

### Adding New Components
When adding shadcn/ui components, they are automatically configured to use:
- Tailwind utility classes
- CSS variables for theming
- Proper TypeScript types
- Radix UI primitives where applicable

### Working with Supabase
- Always import from `@/integrations/supabase/client`
- Type definitions are generated in `src/integrations/supabase/types.ts`
- Migrations stored in `supabase/migrations/`

### Authentication Flow
1. User interacts with auth form on `/auth` or `/admin-login`
2. AuthContext methods (`signIn`, `signUp`, `signInWithOAuth`) handle Supabase calls
3. Auth state changes trigger `onAuthStateChange` listener
4. Session persists in localStorage
5. Protected routes check `user` state from `useAuth()` hook

### Theme Support
- Default theme: dark
- Storage key: `vite-ui-theme`
- Toggle component: `src/components/ThemeToggle.tsx`
- CSS variables defined in `src/index.css` for both light and dark modes

## Important Conventions

- Use `@/` path alias for all imports from `src/`
- Follow shadcn/ui component patterns for consistency
- Always include proper TypeScript types
- Handle loading and error states in async operations
- Use React Query for data fetching (not raw fetch/axios in components)
- Maintain the provider hierarchy when adding new global state
- Set up auth listener BEFORE checking session to avoid race conditions

## Production Deployment

### Critical Issues to Address Before Production
This codebase has undergone comprehensive production readiness analysis. See `PRODUCTION_READINESS_REPORT.md` for full details.

**Known Critical Issues:**
1. **Hardcoded Supabase URL** in `src/pages/AdminDashboard.tsx:343` - Must use `import.meta.env.VITE_SUPABASE_URL`
2. **Hardcoded Intercom App IDs** in 3 locations - Must use `import.meta.env.VITE_INTERCOM_APP_ID`
3. **SecurityTest component** in `src/App.tsx:51` - Must be removed from production builds
4. **Missing environment validation** in `src/integrations/supabase/client.ts` - Must validate env vars exist
5. **Missing security headers** - Must configure CSP, X-Frame-Options, HSTS in deployment config

### Environment Variables Required
```env
# Critical (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Integration (Required for features)
VITE_INTERCOM_APP_ID=xu0gfiqb
VITE_APP_URL=https://dobeu.net

# Optional
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

See `.env.example` for complete list and documentation.

### Build Optimization
Current bundle size: **877 KB** (exceeds 500 KB threshold)

Optimizations needed:
- Implement route-based code splitting (estimated -40% bundle size)
- Configure manual vendor chunks in `vite.config.ts`
- Use dynamic imports for routes with `React.lazy()`
- See `vite.config.production.ts` for optimized production configuration

### Deployment Configuration Files
- `vercel.json` - Vercel deployment with security headers
- `netlify.toml` - Netlify deployment with security headers
- `public/_redirects` - SPA routing for static hosts

### Pre-Deployment Checklist
Reference `DEPLOYMENT_CHECKLIST_PRINTABLE.md` for comprehensive checklist.

**Must complete before deploying to https://dobeu.net:**
- [ ] Fix all 5 critical issues listed above
- [ ] Create `.env.production` with production values
- [ ] Configure Supabase production project with RLS policies
- [ ] Set up DNS for dobeu.net
- [ ] Verify SSL certificate
- [ ] Test OAuth flows with production redirect URLs
- [ ] Test PWA installation on iOS and Android

## Known Issues and Technical Debt

### Bundle Size
- Main bundle: 877 KB (257 KB gzipped) - needs code splitting
- No route-based lazy loading implemented
- All vendor libraries bundled together

### Security Considerations
- 27 console.log statements in production code (should use logger utility)
- No error boundary implemented at app level
- Weak password policy (6 char minimum, no complexity requirements)
- 7 npm vulnerabilities (1 high) - run `npm audit fix`

### Performance Concerns
- AdminDashboard component is 1,065 lines (consider refactoring)
- No memoization in expensive filter operations
- Missing loading skeleton states in some components

### PWA Configuration
- Only SVG icons provided (iOS requires PNG fallbacks)
- Service worker cache version is static (should auto-increment)
- Uses native `confirm()` for update prompts (should use custom UI)

## Deployment Documentation
Comprehensive deployment guides available:
- `DEPLOYMENT_QUICK_START.md` - Fast deployment guide (30 minutes)
- `PRODUCTION_DEPLOYMENT_GUIDE.md` - Complete reference
- `SECURITY_CHECKLIST.md` - Security audit and requirements
- `DEPLOYMENT_README.md` - Documentation index

## Intercom Integration
Intercom is integrated in multiple locations:
- `src/components/IntercomManager.tsx` - Global Intercom initialization
- `src/pages/Index.tsx` - Home page specific initialization (duplicate - should be removed)
- Uses app ID: `xu0gfiqb` (move to environment variable)

When working with Intercom:
- Only keep initialization in IntercomManager (remove from Index.tsx)
- Automatically identifies authenticated users
- Conditionally loads based on environment
