import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Production-Optimized Vite Configuration
 *
 * This configuration is optimized for production builds with:
 * - Code splitting for better caching
 * - Modern browser targeting
 * - Optimized minification
 * - Manual chunk splitting for vendor libraries
 *
 * To use this config:
 * 1. Rename to vite.config.ts (backup your current config first)
 * 2. Run: npm run build
 * 3. Test: npm run preview
 *
 * For development, you can keep a separate vite.config.dev.ts
 */

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for React components
      fastRefresh: true,

      // Babel options for production
      babel: {
        plugins: [
          // Remove console logs in production (optional)
          // ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }]
        ],
      },
    }),

    // Uncomment to add PWA support with vite-plugin-pwa
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.svg', 'icons/*.svg'],
    //   manifest: {
    //     name: 'Jeremy Williams - Supply Chain & Technology Consultant',
    //     short_name: 'Jeremy Williams',
    //     theme_color: '#2563EB',
    //     background_color: '#0B1437',
    //     display: 'standalone',
    //     icons: [
    //       { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    //       { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    //     ]
    //   },
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,woff,woff2}'],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
    //         handler: 'NetworkFirst',
    //         options: {
    //           cacheName: 'supabase-api-cache',
    //           expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 }
    //         }
    //       }
    //     ]
    //   }
    // })

    // Uncomment to visualize bundle size
    // visualizer({
    //   open: true,
    //   filename: 'dist/stats.html',
    //   gzipSize: true,
    //   brotliSize: true,
    // })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  optimizeDeps: {
    // Exclude packages that don't need pre-bundling
    exclude: ['lucide-react'],

    // Include packages that need pre-bundling
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
    ],
  },

  // Production Build Optimizations
  build: {
    // Target modern browsers for smaller bundles
    // Options: 'modules' | 'es2015' | 'es2016' | 'es2017' | 'es2018' | 'es2019' | 'es2020'
    target: 'es2015',

    // Output directory
    outDir: 'dist',

    // Generate manifest.json for asset mapping
    manifest: true,

    // Enable minification using esbuild (faster than terser)
    minify: 'esbuild',

    // Source maps for production debugging
    // Options: false | true | 'inline' | 'hidden'
    // - false: No source maps (smallest size)
    // - true: Separate .map files (for debugging)
    // - 'hidden': Source maps without reference in files (for Sentry)
    sourcemap: false, // Set to 'hidden' if using error monitoring like Sentry

    // Chunk size warning limit (in KB)
    chunkSizeWarningLimit: 1000,

    // Rollup-specific options
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React core libraries (least likely to change)
          'react-vendor': [
            'react',
            'react-dom',
            'react-router-dom',
          ],

          // Supabase and data fetching
          'supabase-vendor': [
            '@supabase/supabase-js',
            '@tanstack/react-query',
          ],

          // UI component libraries (Radix UI)
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-select',
            '@radix-ui/react-avatar',
            '@radix-ui/react-label',
            '@radix-ui/react-slot',
            '@radix-ui/react-separator',
            '@radix-ui/react-switch',
            '@radix-ui/react-accordion',
            '@radix-ui/react-popover',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-alert-dialog',
          ],

          // Form handling libraries
          'form-vendor': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
          ],

          // Animation libraries
          'animation-vendor': [
            'framer-motion',
          ],

          // Utility libraries
          'utils-vendor': [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
            'date-fns',
          ],

          // Icons (if large)
          // 'icons-vendor': ['lucide-react'],
        },

        // Consistent file naming with content hashes
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',

        // Advanced chunking strategy (alternative to manualChunks)
        // This automatically splits vendors and common code
        // manualChunks: (id) => {
        //   if (id.includes('node_modules')) {
        //     if (id.includes('react') || id.includes('react-dom')) {
        //       return 'react-vendor';
        //     }
        //     if (id.includes('@radix-ui')) {
        //       return 'ui-vendor';
        //     }
        //     if (id.includes('@supabase')) {
        //       return 'supabase-vendor';
        //     }
        //     return 'vendor';
        //   }
        // },
      },

      // External dependencies (if any should not be bundled)
      // external: [],

      // Preserve module structure for tree shaking
      treeshake: {
        moduleSideEffects: false,
      },
    },

    // CSS code splitting
    cssCodeSplit: true,

    // CSS minification
    cssMinify: true,

    // Report compressed size (adds slight build time)
    reportCompressedSize: true,

    // Write bundle to disk even if build fails (for debugging)
    emptyOutDir: true,
  },

  // Preview server configuration (for testing production builds locally)
  preview: {
    port: 4173,
    strictPort: true,
    host: true, // Listen on all network interfaces
    cors: true,
  },

  // Development server configuration
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: false, // Auto-open browser on dev start
  },

  // Environment variable handling
  envPrefix: 'VITE_', // Only expose variables starting with VITE_

  // Dependency optimization
  esbuild: {
    // Drop console and debugger in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],

    // Minify identifiers in production
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,

    // Tree shaking
    treeShaking: true,
  },
});
