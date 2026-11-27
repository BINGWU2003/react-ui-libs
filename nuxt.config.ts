// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui"],

  css: ["~/assets/css/tailwind.css"],

  ui: {
    fonts: false,
  },

  // Work around vue-router@5.5.2 vue-router.node.mjs referencing __VUE_OPTIONS_API__ without defining it in Node SSR.
  build: {
    transpile: ["vue-router"],
  },

  runtimeConfig: {
    public: {
      siteUrl: "https://react-ui-libs.vercel.app",
    },
  },

  typescript: {
    shim: false,
    tsConfig: {
      compilerOptions: {
        moduleResolution: "bundler",
        paths: {
          "@": ["."],
          "@/*": ["./*"],
        },
      },
    },
  },

  devtools: { enabled: true },
  compatibilityDate: "2026-11-01",
})
