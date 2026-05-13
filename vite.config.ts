/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

// Deployed to GitHub Pages project site at https://crazygang-ai.github.io/tools/
// so all asset URLs and the PWA scope must live under /tools/. Override with
// VITE_BASE=/ when serving from a custom domain root.
const base = process.env.VITE_BASE ?? '/tools/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: false },
      includeAssets: ['favicon.svg'],
      workbox: {
        // Heavy lazy-loaded chunks (shiki WASM, language grammars, themes,
        // figlet fonts, etc.) shouldn't sit in the precache — that bloats
        // the initial install. They're route-level lazy imports, so caching
        // them at runtime when the user actually opens the corresponding
        // tool is the right shape.
        globIgnores: [
          '**/wasm-*.js',
          '**/{cpp,go,java,javascript,typescript,tsx,jsx,python,rust,sql,bash,json,yaml,markdown,html,css}-*.js',
          '**/{github-dark,github-light,one-dark-pro,dracula,night-owl,nord,solarized-light,vitesse-light}-*.js',
        ],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/.*-[A-Za-z0-9_-]{6,}\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tools-lazy-chunks',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      manifest: {
        name: 'Tools',
        short_name: 'Tools',
        description: 'Free developer tools running locally in your browser.',
        theme_color: '#0b0b0d',
        background_color: '#0b0b0d',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
