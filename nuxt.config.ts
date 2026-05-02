// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: '.',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxt/icon'],

  css: [
    '~/assets/css/main.css',
    '~/assets/css/ref-overrides.css',
    '~/assets/css/collection-landings.css',
    '~/assets/css/admin.css'
  ],

  runtimeConfig: {
    adminLogin: process.env.ADMIN_LOGIN || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'magiciris2026',
    adminSessionSecret: process.env.ADMIN_SESSION_SECRET || 'magic-iris-local-session-secret'
  },

  vite: {
    build: {
      sourcemap: false,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('gsap')) return 'gsap'
            if (id.includes('Reviews2GIS')) return 'reviews'
          }
        }
      }
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      titleTemplate: '%s · Magic Iris',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#120619' }
      ]
    }
  },

  // Оптимизации производительности
  experimental: {
    payloadExtraction: true,
    inlineRouteRules: true
  },

  nitro: {
    compressPublicAssets: true
  }
})