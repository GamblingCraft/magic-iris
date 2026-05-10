// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: '.',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxt/icon'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    adminLogin: process.env.ADMIN_LOGIN || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'magiciris2026',
    adminSessionSecret: process.env.ADMIN_SESSION_SECRET || 'magic-iris-local-session-secret'
  },

  vite: {
    optimizeDeps: {
      include: [
        'imask',
        'gsap',
        'gsap/ScrollTrigger'
      ]
    },
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
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Onest:wght@400;500;600;700&family=Rubik:wght@400;500;700&display=swap'
        }
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#120619' }
      ]
    }
  },

  experimental: {
    payloadExtraction: true,
    inlineRouteRules: true
  },

  nitro: {
    compressPublicAssets: true
  }
})

