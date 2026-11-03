/**
 * Dedicated Supabase Client Instance
 * 
 * Initialized with Supabase Project URL and Publishable (anon) Key.
 * Resilient initialization with environment variable lookup and fallback defaults.
 * Exposes window.supabaseClient and window.getSupabaseClient().
 */

(function (global) {
  const DEFAULT_URL = 'https://ibrtpfesjjerjyexdcyr.supabase.co';
  const DEFAULT_KEY = 'sb_publishable_IWXKP9PYiflQlIfGOVKktg_BDOBfHI3';

  function getCredentials() {
    const url =
      (typeof window !== 'undefined' && window.ENV && window.ENV.SUPABASE_URL) ||
      (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL)) ||
      (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)) ||
      DEFAULT_URL;

    const key =
      (typeof window !== 'undefined' && window.ENV && window.ENV.SUPABASE_PUBLISHABLE_KEY) ||
      (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.SUPABASE_PUBLISHABLE_KEY)) ||
      (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY)) ||
      DEFAULT_KEY;

    return { url, key };
  }

  function initClient() {
    if (typeof window === 'undefined') return null;
    if (window.supabaseClient) return window.supabaseClient;

    const clientCreator =
      (window.supabase && typeof window.supabase.createClient === 'function')
        ? window.supabase.createClient
        : (typeof createClient === 'function' ? createClient : null);

    if (!clientCreator) {
      return null;
    }

    const { url, key } = getCredentials();
    if (!url || !key) return null;

    try {
      const client = clientCreator(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      });

      client.checkConnection = async function () {
        try {
          const { data, error } = await client.auth.getSession();
          if (error) {
            console.error('❌ [Supabase] Connection test note:', error.message);
            return { success: false, error };
          }
          console.log('✅ [Supabase] Client connected successfully.');
          return { success: true, data };
        } catch (err) {
          console.error('❌ [Supabase] Connection check error:', err);
          return { success: false, error: err };
        }
      };

      /**
       * Fetch and aggregate past traffic records from Supabase
       */
      client.getHistoricalMetrics = async function (limit = 50) {
        try {
          const { data, error } = await client
            .from('traffic_simulation_logs')
            .select('*')
            .order('id', { ascending: false })
            .limit(limit);

          if (error) {
            console.warn('⚠️ [Supabase] Failed to fetch historical records:', error.message);
            return { success: false, error };
          }

          if (!data || data.length === 0) {
            return {
              success: true,
              count: 0,
              records: [],
              road1AvgPressure: 0,
              road2AvgPressure: 0,
              road1AvgCars: 0,
              road2AvgCars: 0,
              road1GreenCount: 0,
              road2GreenCount: 0,
              road1DemandRatio: 0.5,
              road2DemandRatio: 0.5,
            };
          }

          const count = data.length;
          let r1P_sum = 0, r2P_sum = 0;
          let r1C_sum = 0, r2C_sum = 0;
          let r1Green = 0, r2Green = 0;

          data.forEach((row) => {
            r1P_sum += parseFloat(row.road1_pressure) || 0;
            r2P_sum += parseFloat(row.road2_pressure) || 0;
            r1C_sum += parseInt(row.road1_cars, 10) || 0;
            r2C_sum += parseInt(row.road2_cars, 10) || 0;
            if (row.road1_signal === 'GREEN') r1Green++;
            if (row.road2_signal === 'GREEN') r2Green++;
          });

          const r1AvgP = r1P_sum / count;
          const r2AvgP = r2P_sum / count;
          const totalAvgP = r1AvgP + r2AvgP;
          const r1DemandRatio = totalAvgP > 0 ? (r1AvgP / totalAvgP) : 0.5;
          const r2DemandRatio = totalAvgP > 0 ? (r2AvgP / totalAvgP) : 0.5;

          return {
            success: true,
            count,
            records: data,
            road1AvgPressure: r1AvgP,
            road2AvgPressure: r2AvgP,
            road1AvgCars: Math.round(r1C_sum / count),
            road2AvgCars: Math.round(r2C_sum / count),
            road1GreenCount: r1Green,
            road2GreenCount: r2Green,
            road1DemandRatio: r1DemandRatio,
            road2DemandRatio: r2DemandRatio,
          };
        } catch (err) {
          console.error('❌ [Supabase] Exception fetching historical metrics:', err);
          return { success: false, error: err };
        }
      };

      window.supabaseClient = client;
      console.log('🚀 [Supabase] Client initialized successfully.');
      client.checkConnection();
      return client;
    } catch (e) {
      console.error('❌ [Supabase] Error creating client:', e);
      return null;
    }
  }

  // Attempt immediate initialization
  initClient();

  // Retry on DOMContentLoaded and load in case scripts finish parsing asynchronously
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => initClient());
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => initClient());
  }

  // Export helper to ensure client is ready for async callers
  global.getSupabaseClient = async function (maxWaitMs = 4000) {
    if (global.supabaseClient) return global.supabaseClient;

    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      const client = initClient();
      if (client) return client;
      await new Promise((resolve) => setTimeout(resolve, 60));
    }

    return initClient();
  };

  // Node / CommonJS export support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      getSupabaseClient: global.getSupabaseClient,
      get supabaseClient() { return global.supabaseClient; },
    };
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this);
