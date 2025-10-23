# Production Deployment Guide: React + Vite + Supabase PWA

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Vite Build Optimization](#vite-build-optimization)
4. [PWA Production Setup](#pwa-production-setup)
5. [Supabase Production Configuration](#supabase-production-configuration)
6. [Domain & DNS Configuration](#domain--dns-configuration)
7. [Deployment Workflow](#deployment-workflow)
8. [Performance Optimization](#performance-optimization)
9. [Error Monitoring & Logging](#error-monitoring--logging)
10. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
11. [Recommended Hosting Platforms](#recommended-hosting-platforms)

---

## Pre-Deployment Checklist

### Must Have (Before Going Live)

- [ ] **HTTPS enabled** - Service workers require HTTPS (localhost exempted for testing)
- [ ] **Environment variables secured** - Never commit `.env` files to Git
- [ ] **Supabase production project created** - Separate from development
- [ ] **Production API keys obtained** - From Supabase production dashboard
- [ ] **Service worker tested** - Build and test with `npm run build` + `npm run preview`
- [ ] **Cache-Control headers configured** - Especially for index.html and service-worker.js
- [ ] **Error boundary implemented** - Graceful error handling in production
- [ ] **Source maps configured** - For production debugging (conditionally enabled)
- [ ] **Manifest.json validated** - Correct paths, icons, and metadata
- [ ] **Icons optimized** - All PWA icon sizes generated (192x192, 512x512, maskable)
- [ ] **Build tested locally** - Use `npm run preview` to test production build

### Recommended

- [ ] **Analytics configured** - Google Analytics, Plausible, or similar
- [ ] **Error monitoring setup** - Sentry, LogRocket, or similar
- [ ] **CDN configured** - CloudFront, Cloudflare, or hosting platform CDN
- [ ] **Database backups enabled** - Automatic Supabase backups configured
- [ ] **Performance baseline established** - Lighthouse score before deployment
- [ ] **Security headers configured** - CSP, X-Frame-Options, etc.
- [ ] **Redirect rules set** - www to non-www or vice versa
- [ ] **404 page customized** - Better UX for broken links
- [ ] **Robots.txt and sitemap.xml** - For SEO if applicable
- [ ] **Rate limiting implemented** - On Supabase functions/API routes

### Optional (Nice to Have)

- [ ] **Progressive image loading** - Lazy loading, blur placeholders
- [ ] **Code splitting reviewed** - Route-based lazy loading implemented
- [ ] **Bundle size analyzed** - Using `vite-bundle-visualizer`
- [ ] **Accessibility audit** - WCAG compliance checked
- [ ] **Performance budget set** - Maximum bundle sizes defined
- [ ] **Staging environment** - Test deployment before production
- [ ] **CI/CD pipeline** - Automated testing and deployment
- [ ] **Monitoring dashboard** - Uptime monitoring (UptimeRobot, etc.)

---

## Environment Configuration

### Environment File Structure

Create three environment files:

```bash
.env.local           # Local development (not committed)
.env.production      # Production values (not committed)
.env.example         # Template (committed to Git)
```

### .env.example (Commit this to Git)

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Analytics
VITE_GA_MEASUREMENT_ID=your_google_analytics_id

# Optional: Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_INTERCOM=false

# Optional: Error Monitoring
VITE_SENTRY_DSN=your_sentry_dsn
```

### .env.production (Do NOT commit)

```bash
# Production Supabase (from Supabase dashboard)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Production Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true

# Production Error Monitoring
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_SENTRY_ENVIRONMENT=production
```

### Update .gitignore (Already Done)

Your `.gitignore` already includes `.env`, but ensure these are also present:

```bash
.env
.env.local
.env.production
.env.development
*.local
```

### Best Practices for Environment Variables

1. **Always prefix with `VITE_`** - Only `VITE_` prefixed variables are exposed to client
2. **Never expose sensitive keys** - Service role keys should NEVER be in frontend code
3. **Use platform environment variables** - Set on hosting platform (Vercel, Netlify, etc.)
4. **Document all variables** - Keep `.env.example` up to date
5. **Avoid dynamic access** - Use `import.meta.env.VITE_API_KEY` not `import.meta.env[key]`

### Using Environment Variables in Code

```typescript
// ✅ Correct - Static reference
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// ❌ Wrong - Dynamic access won't work in production
const key = 'VITE_SUPABASE_URL';
const supabaseUrl = import.meta.env[key];
```

---

## Vite Build Optimization

### Recommended vite.config.ts Configuration

Update `/home/jeremyw/dobeunet/dobeunet/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  // Production Build Optimizations
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2015',

    // Enable minification
    minify: 'esbuild', // Faster than terser

    // Source maps for production debugging (optional)
    sourcemap: false, // Set to 'hidden' if you want source maps for error tracking

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,

    // Manual chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js', '@tanstack/react-query'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-select',
            '@radix-ui/react-avatar',
            '@radix-ui/react-label',
          ],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'animation-vendor': ['framer-motion'],
        },
        // Clean file naming
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },

    // Optimize CSS
    cssCodeSplit: true,
    cssMinify: true,
  },

  // Preview server configuration (for testing builds)
  preview: {
    port: 4173,
    strictPort: true,
  },
});
```

### Key Optimization Strategies

1. **Code Splitting by Vendor** - Separates React, Supabase, and UI libraries for better caching
2. **Target Modern Browsers** - If you don't need IE11 support, use `es2015` or higher
3. **Disable Source Maps** - Or use `sourcemap: 'hidden'` for Sentry-only debugging
4. **Manual Chunks** - Reduces bundle size by 40-60% through strategic splitting
5. **CSS Code Splitting** - Splits CSS by route for faster initial load

### Bundle Analysis

Add bundle analyzer to check your build:

```bash
npm install -D rollup-plugin-visualizer
```

Update `vite.config.ts`:

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, filename: 'dist/stats.html' })
  ],
  // ... rest of config
});
```

Run build to see bundle analysis:

```bash
npm run build
# Opens stats.html showing bundle composition
```

---

## PWA Production Setup

### Current Service Worker Issues

Your current service worker (`/home/jeremyw/dobeunet/dobeunet/public/service-worker.js`) is manually written. For production, consider migrating to **vite-plugin-pwa** with Workbox for better cache management.

### Option 1: Use vite-plugin-pwa (Recommended)

Install the plugin:

```bash
npm install -D vite-plugin-pwa
```

Update `vite.config.ts`:

```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg'],

      manifest: {
        name: 'Jeremy Williams - Supply Chain & Technology Consultant',
        short_name: 'Jeremy Williams',
        description: '15+ years transforming supply chains through strategic operations management',
        theme_color: '#2563EB',
        background_color: '#0B1437',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/icons/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: '/icons/maskable-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        // Cache all static assets
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,woff,woff2}'],

        // Runtime caching strategies
        runtimeCaching: [
          {
            // Cache Supabase API requests
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache image assets
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ],

        // Clean up old caches
        cleanupOutdatedCaches: true,

        // Claim clients immediately
        clientsClaim: true,

        // Skip waiting for new service worker
        skipWaiting: true
      },

      devOptions: {
        enabled: false // Disable in development to avoid confusion
      }
    })
  ],
  // ... rest of config
});
```

Update `src/main.tsx` to remove manual service worker registration:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// vite-plugin-pwa handles service worker registration automatically
// Remove manual registration code

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Option 2: Improve Current Service Worker

If you prefer to keep your manual service worker, improve it:

```javascript
const CACHE_VERSION = 'v2'; // Increment when updating
const CACHE_NAME = `jeremy-williams-pwa-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

// Critical assets to cache immediately
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
  // Don't pre-cache large assets - use runtime caching instead
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => console.error('Cache installation failed:', error))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName.startsWith('jeremy-williams-pwa-'))
          .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first for API, cache first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network first for API requests
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clonedResponse = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clonedResponse));
          return response;
        })
        .catch(() => caches.match(request)) // Fallback to cache
    );
    return;
  }

  // Cache first for static assets
  if (request.destination === 'image' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) return response;

          return fetch(request).then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => cache.put(request, responseToCache));
            return response;
          });
        })
        .catch(() => {
          // Return offline fallback for documents
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        })
    );
    return;
  }

  // Network first for everything else
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then(response => response || caches.match('/index.html')))
  );
});

// Message event for manual updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

### PWA Manifest Best Practices

Your manifest is already well-configured! Minor improvements:

```json
{
  "name": "Jeremy Williams - Supply Chain & Technology Consultant",
  "short_name": "Jeremy Williams",
  "description": "15+ years transforming supply chains through strategic operations management, cutting-edge technology consulting, and innovative brand development solutions.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0B1437",
  "theme_color": "#2563EB",
  "orientation": "portrait-primary",
  "categories": ["business", "productivity", "consulting"],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/maskable-icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Contact",
      "short_name": "Contact",
      "description": "Get in touch with Jeremy Williams",
      "url": "/#contact",
      "icons": [{"src": "/icons/icon-192x192.png", "sizes": "192x192"}]
    },
    {
      "name": "Portfolio",
      "short_name": "Portfolio",
      "description": "View portfolio and case studies",
      "url": "/#portfolio",
      "icons": [{"src": "/icons/icon-192x192.png", "sizes": "192x192"}]
    }
  ],
  "prefer_related_applications": false,
  "lang": "en-US",
  "dir": "ltr"
}
```

**Note**: Generate PNG versions of your icons for better compatibility. SVG icons work but PNG is more widely supported:

```bash
# Use an online converter or imagemagick
convert icon-192x192.svg icon-192x192.png
```

### PWA Testing Before Deployment

```bash
# 1. Build for production
npm run build

# 2. Preview the build
npm run preview

# 3. Test in incognito window at http://localhost:4173

# 4. Open Chrome DevTools > Application
# - Check Manifest loads correctly
# - Check Service Worker registers
# - Test offline mode (Network tab > Offline)
# - Check Cache Storage for expected files

# 5. Run Lighthouse audit
# Chrome DevTools > Lighthouse > Progressive Web App
```

---

## Supabase Production Configuration

### 1. Create Production Project

1. Go to https://app.supabase.com
2. Create new project (separate from development)
3. Note your production credentials:
   - Project URL: `https://xxxxx.supabase.co`
   - Anon/Public Key (safe for client)
   - Service Role Key (NEVER use in frontend)

### 2. Database Setup

Run your migrations on production:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to production project
supabase link --project-ref your-production-ref

# Push migrations
supabase db push

# Alternatively, copy migration SQL from supabase/migrations/
# and run in Supabase SQL Editor
```

### 3. Row Level Security (RLS) Policies

Ensure RLS is enabled on all tables:

```sql
-- Example: Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Review ALL tables and enable RLS
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

### 4. Authentication Configuration

Configure in Supabase Dashboard > Authentication:

- **Site URL**: `https://dobeu.net`
- **Redirect URLs**:
  - `https://dobeu.net/auth/callback`
  - `https://dobeu.net/*` (wildcard for all routes)
- **Email Templates**: Customize confirmation and reset emails
- **Rate Limiting**: Enable to prevent abuse
- **SMTP Settings**: Use custom SMTP for better deliverability (optional)

### 5. Storage Configuration

If using Supabase Storage:

```sql
-- Example: Public bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Policy: Users can upload their own avatar
CREATE POLICY "Users can upload avatar" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy: Anyone can view avatars
CREATE POLICY "Public avatar access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');
```

### 6. Security Best Practices

```typescript
// ✅ SAFE - Anon key in frontend (client.ts)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ❌ NEVER DO THIS - Service role key in frontend
// const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE; // NEVER!
```

**Critical Security Rules**:

1. **Never use service role key in frontend code**
2. **Always enable RLS on all tables**
3. **Validate all user input** - Use Zod schemas
4. **Use parameterized queries** - Supabase does this automatically
5. **Rotate keys regularly** - Annually or after suspected breach
6. **Monitor usage** - Set up alerts for unusual activity
7. **Limit API rate** - Use Supabase built-in rate limiting

### 7. Production Database Backups

Enable automatic backups in Supabase Dashboard:

- **Settings > Database > Backups**
- Enable daily backups (free on Pro plan)
- Test restore procedure periodically

### 8. Environment-Specific Configuration

Update `/home/jeremyw/dobeunet/dobeunet/src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
  // Production-specific options
  global: {
    headers: {
      'X-Client-Info': 'dobeu-net-pwa',
    },
  },
  db: {
    schema: 'public',
  },
  // Optional: Log errors in development only
  ...(import.meta.env.DEV && {
    auth: {
      debug: true,
    },
  }),
});

// Optional: Add error logging for production
if (import.meta.env.PROD) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
      // Clear any cached data
      localStorage.clear();
    }
  });
}
```

---

## Domain & DNS Configuration

### For dobeu.net

#### Option A: Using A Record (If Static IP Available)

```
Type: A
Name: @
Value: YOUR_SERVER_IP
TTL: 3600
```

```
Type: A
Name: www
Value: YOUR_SERVER_IP
TTL: 3600
```

#### Option B: Using CNAME (Recommended for Platforms)

Most hosting platforms (Vercel, Netlify, Cloudflare Pages) provide a CNAME target:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com (or platform-specific)
TTL: 3600
```

For apex domain (dobeu.net), use platform-specific instructions:
- **Vercel**: Add A records pointing to Vercel's IPs
- **Netlify**: Use Netlify DNS or ALIAS record
- **Cloudflare Pages**: Add CNAME with name `@` (flattened automatically)

#### DNS Records Checklist

- [ ] A or CNAME record for apex domain (`dobeu.net`)
- [ ] CNAME record for www subdomain (`www.dobeu.net`)
- [ ] Redirect from www to non-www (or vice versa) configured on hosting platform
- [ ] DNS propagation complete (check with https://dnschecker.org)

#### SSL/TLS Configuration

Most platforms provide free SSL via Let's Encrypt:

- **Vercel**: Automatic SSL for custom domains
- **Netlify**: Automatic SSL with Let's Encrypt
- **Cloudflare Pages**: Automatic with Cloudflare SSL
- **AWS Amplify**: Free SSL via AWS Certificate Manager

**Force HTTPS**: Configure on platform or via redirect rules:

```
# Netlify _redirects file
http://dobeu.net/* https://dobeu.net/:splat 301!
http://www.dobeu.net/* https://dobeu.net/:splat 301!
https://www.dobeu.net/* https://dobeu.net/:splat 301!
```

---

## Deployment Workflow

### Recommended: Git-Based Deployment

Most modern platforms auto-deploy from Git pushes.

#### 1. Prepare Repository

```bash
# Ensure clean build
npm run build

# Test production build locally
npm run preview

# Commit and push
git add .
git commit -m "Production ready"
git push origin main
```

#### 2. Platform-Specific Setup

##### Vercel (Recommended for React + Vite)

1. Import repository at https://vercel.com/new
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Install Command: `npm install`
6. Environment Variables:
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_key
   ```
7. Deploy

**vercel.json** (optional optimization):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

##### Netlify

1. Import repository at https://app.netlify.com/start
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Add environment variables
5. Deploy

**netlify.toml**:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

##### Cloudflare Pages

1. Import repository at https://dash.cloudflare.com/pages
2. Build Command: `npm run build`
3. Build Output Directory: `dist`
4. Environment Variables: Add Supabase variables
5. Deploy

**Cloudflare automatically handles**:
- Global CDN distribution
- Automatic SSL
- DDoS protection
- Edge caching

#### 3. Post-Deployment Verification

```bash
# Check deployment
curl -I https://dobeu.net

# Should return 200 OK with HTTPS

# Test PWA installation
# Open https://dobeu.net in mobile browser
# Check for "Add to Home Screen" prompt

# Run Lighthouse audit
# Chrome DevTools > Lighthouse > Generate Report
# Aim for scores >90 in all categories
```

---

## Performance Optimization

### 1. Code Splitting & Lazy Loading

Implement route-based code splitting in `/home/jeremyw/dobeunet/dobeunet/src/App.tsx`:

```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Eagerly load critical routes
import Index from './pages/Index';
import Auth from './pages/Auth';

// Lazy load secondary routes
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/TOS" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
```

### 2. Image Optimization

```typescript
// Use native lazy loading
<img src="/image.jpg" loading="lazy" alt="Description" />

// Add responsive images
<img
  srcSet="/image-400w.jpg 400w, /image-800w.jpg 800w"
  sizes="(max-width: 400px) 400px, 800px"
  src="/image-800w.jpg"
  loading="lazy"
  alt="Description"
/>

// Consider WebP format with fallback
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <source srcSet="/image.jpg" type="image/jpeg" />
  <img src="/image.jpg" loading="lazy" alt="Description" />
</picture>
```

### 3. Font Optimization

Update `/home/jeremyw/dobeunet/dobeunet/index.html`:

```html
<head>
  <!-- Preconnect to font sources -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Load fonts with display=swap to prevent FOIT -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Or use local fonts for better performance -->
  <style>
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/inter-v12-latin-regular.woff2') format('woff2');
    }
  </style>
</head>
```

### 4. Preloading Critical Assets

```html
<head>
  <!-- Preload critical CSS -->
  <link rel="preload" href="/assets/main.css" as="style">

  <!-- Preload critical JavaScript -->
  <link rel="preload" href="/assets/main.js" as="script">

  <!-- Preload hero image -->
  <link rel="preload" href="/hero.jpg" as="image">
</head>
```

### 5. Cache-Control Headers

Configure on your hosting platform:

```
# Static assets (hashed filenames) - Cache forever
/assets/*.js          Cache-Control: public, max-age=31536000, immutable
/assets/*.css         Cache-Control: public, max-age=31536000, immutable

# HTML - Never cache (always revalidate)
/*.html               Cache-Control: public, max-age=0, must-revalidate

# Service Worker - Never cache
/service-worker.js    Cache-Control: public, max-age=0, must-revalidate

# Manifest - Short cache
/manifest.json        Cache-Control: public, max-age=86400

# Images - Cache for 1 week
/icons/*              Cache-Control: public, max-age=604800
```

### 6. Compression

Most hosting platforms enable gzip/brotli automatically. Verify:

```bash
curl -H "Accept-Encoding: br,gzip" -I https://dobeu.net

# Should return:
# content-encoding: br (or gzip)
```

### 7. Critical CSS Extraction

For further optimization, extract critical CSS:

```bash
npm install -D vite-plugin-critical
```

```typescript
// vite.config.ts
import { criticalCss } from 'vite-plugin-critical';

export default defineConfig({
  plugins: [
    react(),
    criticalCss({
      base: 'dist/',
      inline: true,
      dimensions: [
        { width: 375, height: 667 },
        { width: 1920, height: 1080 }
      ]
    })
  ]
});
```

---

## Error Monitoring & Logging

### Option 1: Sentry (Recommended)

Install Sentry SDK:

```bash
npm install @sentry/react
```

Create `/home/jeremyw/dobeunet/dobeunet/src/lib/sentry.ts`:

```typescript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production';

export const initSentry = () => {
  // Only initialize in production
  if (!import.meta.env.PROD || !SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    integrations: [
      new BrowserTracing(),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Performance monitoring
    tracesSampleRate: 1.0, // Capture 100% of transactions (adjust in production)

    // Session replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Filter sensitive data
    beforeSend(event, hint) {
      // Don't send events from development
      if (window.location.hostname === 'localhost') {
        return null;
      }

      // Remove sensitive data
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }

      return event;
    },

    // Ignore common non-critical errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Network request failed', // Handle network errors gracefully
    ],
  });
};
```

Update `/home/jeremyw/dobeunet/dobeunet/src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { initSentry } from './lib/sentry';
import App from './App.tsx';
import './index.css';

// Initialize Sentry
initSentry();

// Wrap App with Sentry ErrorBoundary
const SentryApp = Sentry.withErrorBoundary(App, {
  fallback: ({ error, resetError }) => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p className="text-slate-400 mb-4">{error.message}</p>
      <button
        onClick={resetError}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  ),
  showDialog: false,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SentryApp />
  </React.StrictMode>
);
```

Add environment variables:

```bash
# .env.production
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_SENTRY_ENVIRONMENT=production
```

### Option 2: LogRocket

```bash
npm install logrocket
```

```typescript
import LogRocket from 'logrocket';

if (import.meta.env.PROD) {
  LogRocket.init('your-app/your-project');

  // Identify users after login
  LogRocket.identify(user.id, {
    name: user.name,
    email: user.email,
  });
}
```

### Custom Error Logger

Create `/home/jeremyw/dobeunet/dobeunet/src/lib/errorLogger.ts`:

```typescript
import { supabase } from '@/integrations/supabase/client';

interface ErrorLog {
  message: string;
  stack?: string;
  userAgent: string;
  url: string;
  timestamp: string;
  userId?: string;
}

export const logError = async (error: Error, additionalInfo?: Record<string, any>) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('Error:', error, additionalInfo);
    return;
  }

  try {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      ...additionalInfo,
    };

    // Log to Supabase table (create error_logs table first)
    await supabase.from('error_logs').insert(errorLog);
  } catch (loggingError) {
    // Fail silently - don't block user experience
    console.error('Failed to log error:', loggingError);
  }
};

// Global error handler
if (import.meta.env.PROD) {
  window.addEventListener('error', (event) => {
    logError(event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError(new Error(event.reason));
  });
}
```

---

## Common Pitfalls & Solutions

### 1. Service Worker Not Updating

**Problem**: Users see old version after deployment.

**Solution**:
```javascript
// In service-worker.js, increment version
const CACHE_VERSION = 'v2'; // Change this on every deployment

// Or use vite-plugin-pwa with autoUpdate
VitePWA({ registerType: 'autoUpdate' })
```

**Testing**:
```bash
# After deployment, force refresh in browser
# Chrome: DevTools > Application > Service Workers > Update
```

### 2. Environment Variables Not Working

**Problem**: `import.meta.env.VITE_XXX` is undefined in production.

**Solution**:
- Ensure variables are prefixed with `VITE_`
- Set variables on hosting platform (Vercel, Netlify, etc.)
- Never use dynamic access: `import.meta.env[key]` won't work
- Rebuild after changing `.env.production`

### 3. Manifest Not Loading

**Problem**: Console error: "Failed to load manifest"

**Solution**:
```html
<!-- Ensure manifest link in index.html -->
<link rel="manifest" href="/manifest.json">
```

```
# Configure server to serve with correct MIME type
Content-Type: application/manifest+json
```

### 4. Icons Not Showing in PWA

**Problem**: Default browser icon shows instead of custom icon.

**Solution**:
- Generate PNG versions (SVG support is limited)
- Provide multiple sizes: 72, 96, 128, 144, 192, 512
- Use https://realfavicongenerator.net/ to generate all sizes
- Clear browser cache and reinstall PWA

### 5. Routing Breaks on Refresh

**Problem**: 404 error when refreshing on `/admin-dashboard` route.

**Solution**:

**Vercel**: Add `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify**: Add `_redirects` file in `/public`:
```
/*    /index.html   200
```

**Cloudflare Pages**: Automatic SPA routing (no config needed)

### 6. Slow Initial Load

**Problem**: Large bundle size causing slow first load.

**Solution**:
- Implement code splitting (see Performance Optimization)
- Lazy load non-critical routes
- Optimize images (WebP, responsive sizes)
- Enable compression (gzip/brotli)
- Use CDN for static assets

### 7. CORS Errors with Supabase

**Problem**: CORS errors when calling Supabase from production domain.

**Solution**:
- Add `https://dobeu.net` to Supabase allowed origins
- Settings > API > CORS allowed origins
- Include trailing slash: `https://dobeu.net/`

### 8. Authentication Redirects Failing

**Problem**: OAuth redirect goes to localhost after successful login.

**Solution**:
- Update Supabase Site URL to `https://dobeu.net`
- Add redirect URLs: `https://dobeu.net/**`
- Clear browser cache and test in incognito
- Check redirect URL in OAuth provider settings (Google, GitHub)

### 9. Cache Headers Too Aggressive

**Problem**: Users don't see updates even after cache version bump.

**Solution**:
```
# NEVER cache HTML or service worker
index.html         Cache-Control: no-cache
service-worker.js  Cache-Control: no-cache

# Only cache hashed assets forever
/assets/*.js       Cache-Control: public, max-age=31536000, immutable
```

### 10. Build Fails on Hosting Platform

**Problem**: Build succeeds locally but fails on Vercel/Netlify.

**Solution**:
- Check Node version matches locally and on platform
- Ensure all dependencies are in `dependencies`, not `devDependencies`
- Check build logs for TypeScript errors
- Test with `npm ci` (clean install) locally
- Verify environment variables are set on platform

---

## Recommended Hosting Platforms

### 1. Vercel (Best for React + Vite)

**Pros**:
- Automatic deployments from Git
- Zero-config Vite support
- Global edge network
- Free SSL
- Generous free tier
- Excellent DX (developer experience)
- Built-in analytics

**Cons**:
- Serverless functions limited on free tier
- Some features require Pro plan

**Best For**: Your use case (React + Vite + Supabase PWA)

**Pricing**: Free for personal projects

### 2. Netlify

**Pros**:
- Similar features to Vercel
- Better free tier for bandwidth
- Netlify Forms (useful for contact forms)
- Split testing built-in
- Deploy previews

**Cons**:
- Slightly slower build times
- Less optimized for Vite vs Next.js

**Best For**: Static sites, Jamstack apps

**Pricing**: Free for personal projects

### 3. Cloudflare Pages

**Pros**:
- Part of Cloudflare's global network
- Unlimited bandwidth on free tier
- Best DDoS protection
- Very fast edge network
- Direct Supabase integration

**Cons**:
- Less mature than Vercel/Netlify
- Fewer integrations

**Best For**: Projects needing global CDN and unlimited bandwidth

**Pricing**: Free with generous limits

### 4. AWS Amplify

**Pros**:
- Full AWS ecosystem integration
- More control over infrastructure
- Good for enterprise

**Cons**:
- More complex setup
- More expensive
- Steeper learning curve

**Best For**: Enterprise projects, AWS-heavy stacks

**Pricing**: Pay per build minute + hosting

### 5. Firebase Hosting

**Pros**:
- Google infrastructure
- Tight Firebase integration
- Good for Google ecosystem

**Cons**:
- Less optimized for modern frameworks
- Firebase ecosystem lock-in

**Best For**: Firebase-based projects

**Pricing**: Free tier available

### Recommendation for dobeu.net

**Use Vercel** because:
1. Zero-config Vite support
2. Automatic Git deployments
3. Free SSL and global CDN
4. Best performance for React SPAs
5. Easy environment variable management
6. Deploy previews for every PR
7. Free tier sufficient for your needs

---

## Quick Start Deployment Guide

### Step-by-Step: Deploy to Vercel

1. **Prepare Your Project**
   ```bash
   cd /home/jeremyw/dobeunet/dobeunet

   # Ensure clean build
   npm run build

   # Test locally
   npm run preview

   # Commit latest changes
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Create Vercel Account & Import**
   - Go to https://vercel.com/signup
   - Sign up with GitHub
   - Click "Add New" > "Project"
   - Import `dobeunet` repository
   - Vercel auto-detects Vite

3. **Configure Build Settings**
   - Framework Preset: **Vite** (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_SUPABASE_URL = https://xxx.supabase.co
     VITE_SUPABASE_ANON_KEY = your_production_anon_key
     ```
   - Apply to: **Production**

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Get deployment URL: `https://dobeunet.vercel.app`

6. **Add Custom Domain**
   - Go to project settings > Domains
   - Add `dobeu.net`
   - Follow DNS instructions
   - Add DNS records at your domain registrar:
     ```
     A     @     76.76.21.21
     CNAME www   cname.vercel-dns.com
     ```
   - Wait for DNS propagation (5-60 minutes)
   - Vercel automatically provisions SSL

7. **Verify Deployment**
   ```bash
   # Test site loads
   curl -I https://dobeu.net

   # Should return 200 OK with HTTPS
   ```

8. **Test PWA**
   - Open https://dobeu.net on mobile
   - Check for "Add to Home Screen" prompt
   - Install and test offline functionality
   - Verify manifest and service worker in DevTools

9. **Run Lighthouse Audit**
   - Open https://dobeu.net in Chrome
   - DevTools > Lighthouse
   - Generate report
   - Aim for:
     - Performance: >90
     - Accessibility: >95
     - Best Practices: >95
     - SEO: >90
     - PWA: 100

10. **Setup Continuous Deployment**
    - Every push to `main` branch auto-deploys
    - Pull requests get preview deployments
    - Monitor deployments at https://vercel.com/dashboard

---

## Post-Deployment Tasks

### Immediate (Do Now)

- [ ] Test all routes on production URL
- [ ] Verify authentication works (sign up, sign in, sign out)
- [ ] Test PWA installation on mobile device
- [ ] Run Lighthouse audit and address issues
- [ ] Submit sitemap to Google Search Console (if applicable)
- [ ] Test offline functionality
- [ ] Monitor error logs for first 24 hours

### Within First Week

- [ ] Setup error monitoring (Sentry)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Setup analytics (Google Analytics, Plausible)
- [ ] Test on multiple browsers (Chrome, Safari, Firefox, Edge)
- [ ] Test on multiple devices (iOS, Android, Desktop)
- [ ] Review Supabase usage and set up alerts
- [ ] Enable Supabase backups
- [ ] Document deployment process

### Ongoing Maintenance

- [ ] Monitor performance metrics weekly
- [ ] Review error logs regularly
- [ ] Update dependencies monthly
- [ ] Test PWA updates work correctly
- [ ] Rotate Supabase keys annually
- [ ] Review and optimize bundle size quarterly
- [ ] Test backup restoration procedure quarterly
- [ ] Update SSL certificates (auto-renewed, but verify)

---

## Monitoring Checklist

### Performance Monitoring

- **Vercel Analytics**: Built-in Web Vitals tracking
- **Lighthouse CI**: Automate performance testing
- **WebPageTest**: Deep performance analysis
- **Chrome User Experience Report**: Real user metrics

### Uptime Monitoring

- **UptimeRobot**: Free uptime monitoring (https://uptimerobot.com)
- **Pingdom**: Uptime + performance monitoring
- **Better Uptime**: Modern uptime monitoring with statuspage

### Error Tracking

- **Sentry**: Application error tracking
- **LogRocket**: Session replay + error tracking
- **Supabase Logs**: Database query monitoring

### Usage Analytics

- **Plausible**: Privacy-friendly analytics (recommended)
- **Google Analytics 4**: Comprehensive analytics
- **Vercel Analytics**: Web Vitals + visitor stats

---

## Additional Resources

### Official Documentation
- **Vite**: https://vitejs.dev/guide/build.html
- **Vite PWA Plugin**: https://vite-pwa-org.netlify.app/
- **Supabase**: https://supabase.com/docs/guides/deployment
- **PWA Best Practices**: https://web.dev/progressive-web-apps/

### Tools & Services
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **Can I Use**: https://caniuse.com/ (browser compatibility)
- **Favicon Generator**: https://realfavicongenerator.net/
- **DNS Checker**: https://dnschecker.org/
- **SSL Test**: https://www.ssllabs.com/ssltest/
- **WebPageTest**: https://www.webpagetest.org/

### Testing PWAs
- **PWA Builder**: https://www.pwabuilder.com/
- **Workbox**: https://developers.google.com/web/tools/workbox
- **Service Worker Cookbook**: https://serviceworke.rs/

---

## Final Production Checklist

Before going live, verify:

### Security
- [ ] HTTPS enabled and enforced
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] No service role keys in frontend code
- [ ] RLS enabled on all Supabase tables
- [ ] CORS configured correctly
- [ ] Environment variables never committed to Git
- [ ] Rate limiting enabled on Supabase

### Performance
- [ ] Bundle size < 500KB (gzipped)
- [ ] Lighthouse score >90 in all categories
- [ ] Images optimized and lazy loaded
- [ ] Code splitting implemented
- [ ] CDN enabled
- [ ] Compression enabled (gzip/brotli)
- [ ] Cache headers configured correctly

### PWA
- [ ] Service worker registers correctly
- [ ] Manifest.json loads without errors
- [ ] Icons display correctly
- [ ] Offline functionality works
- [ ] Install prompt appears
- [ ] Updates apply correctly
- [ ] Tested on iOS and Android

### Functionality
- [ ] All routes work after refresh
- [ ] Authentication flow works
- [ ] Forms submit correctly
- [ ] Supabase queries work
- [ ] Error boundaries catch errors gracefully
- [ ] Loading states display correctly
- [ ] Dark mode works

### Monitoring
- [ ] Error monitoring configured
- [ ] Analytics configured
- [ ] Uptime monitoring setup
- [ ] Supabase usage alerts enabled
- [ ] Build notifications configured
- [ ] Deployment pipeline tested

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] Semantic HTML used

### SEO (if applicable)
- [ ] Meta tags configured
- [ ] Open Graph tags added
- [ ] Sitemap generated
- [ ] Robots.txt present
- [ ] Structured data added
- [ ] Page titles unique

---

## Troubleshooting Contact

If you encounter issues during deployment:

1. **Check Vercel Logs**: Vercel dashboard > Deployments > Function Logs
2. **Check Browser Console**: Look for JavaScript errors
3. **Check Network Tab**: Look for failed requests
4. **Check Supabase Logs**: Supabase dashboard > Logs
5. **Test Locally**: `npm run build && npm run preview`

Common support resources:
- **Vite Discord**: https://chat.vitejs.dev/
- **Supabase Discord**: https://discord.supabase.com/
- **Vercel Support**: https://vercel.com/support
- **Stack Overflow**: Tag questions with `vite`, `supabase`, `pwa`

---

**Deployment Version**: 1.0
**Last Updated**: 2025-10-23
**Next Review**: After first production deployment
