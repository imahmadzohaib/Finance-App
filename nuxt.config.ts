// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase"],
  css: ["~/assets/css/main.css"],
 supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/login","/confirm"],
    },
  },
});
