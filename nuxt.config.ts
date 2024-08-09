// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-vuefire',
    '@invictus.codes/nuxt-vuetify',
    '@vueuse/nuxt',
  ],
  vuefire: {
    // ensures the auth module is enabled
    auth: true,
    config: {
      apiKey: "AIzaSyDicMR3nRrUkah2AXM6k9gHtmZrhjwQG8g",
      authDomain: "i-get-am.firebaseapp.com",
      projectId: "i-get-am",
      storageBucket: "i-get-am.appspot.com",
      messagingSenderId: "643431621926",
      appId: "1:643431621926:web:e738297b217a4036a2cde7",
      measurementId: "G-L33X26DC3F"
    },
  },
  ssr: false,
  runtimeConfig: {
    public: {
      appName: 'Finder'
    }
  },
  vuetify: {
    /* vuetify options */
    vuetifyOptions: {
      // @TODO: list all vuetify options
    }
  }
})
