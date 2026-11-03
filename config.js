/**
 * Runtime Environment Configuration
 * 
 * In standard browser environments without a bundler, this file provides 
 * access to the environment variables defined in .env.
 * For bundler setups (Vite / Webpack / Next.js), variables are injected 
 * at build time via import.meta.env or process.env.
 */
(function (global) {
  global.ENV = Object.assign(
    {
      SUPABASE_URL: "https://ibrtpfesjjerjyexdcyr.supabase.co",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_IWXKP9PYiflQlIfGOVKktg_BDOBfHI3",
    },
    global.ENV || {}
  );
})(typeof window !== 'undefined' ? window : this);
