// Configurarea generală pentru API-uri
export const API_CONFIG = {
  // Google Maps API
  GOOGLE_MAPS: {
    API_KEY: 'AIzaSyBFsPbt_ZLUiZFKQBOwTUIXUnDZdxF2f28',
    LIBRARIES: ['places', 'geometry'],
    DEFAULT_CENTER: {
      lat: 44.4268, // București
      lng: 26.1025
    },
    DEFAULT_ZOOM: 12
  },

  // Supabase (importat din config/supabase.ts)
  SUPABASE: {
    // Configurarea este în src/config/supabase.ts
  },

  // API-uri pentru parcare
  PARKING: {
    // API pentru informații despre parcări
    SPOTS_API: 'https://api.parking.example.com',
    // API pentru plăți
    PAYMENTS_API: 'https://api.payments.example.com',
    // API pentru notificări
    NOTIFICATIONS_API: 'https://api.notifications.example.com'
  },

  // Configurare pentru AI features
  AI: {
    ENABLED: true,
    API_KEY: 'your-ai-api-key',
    ENDPOINT: 'https://api.openai.com/v1',
    MODEL: 'gpt-3.5-turbo'
  },

  // Configurare pentru analytics
  ANALYTICS: {
    GOOGLE_ANALYTICS: {
      ENABLED: false,
      TRACKING_ID: 'your-ga-tracking-id'
    },
    MIXPANEL: {
      ENABLED: false,
      TOKEN: 'your-mixpanel-token'
    }
  },

  // Configurare pentru notificări push
  PUSH_NOTIFICATIONS: {
    ENABLED: true,
    VAPID_PUBLIC_KEY: 'your-vapid-public-key'
  },

  // Configurare pentru cache și storage
  STORAGE: {
    CACHE_DURATION: 5 * 60 * 1000, // 5 minute
    MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
    PERSISTENCE_KEY: 'parking-app-cache'
  },

  // Configurare pentru rate limiting
  RATE_LIMITING: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000
  }
} as const;

export type AppConfig = typeof API_CONFIG;
export type PushConfig = AppConfig['PUSH_NOTIFICATIONS'];

// Funcție pentru a obține configurarea pentru un API specific
export const getApiConfig = (apiName: keyof typeof API_CONFIG) => {
  return API_CONFIG[apiName];
};

export const getPushConfig = (): PushConfig => API_CONFIG.PUSH_NOTIFICATIONS;

// Funcție pentru a verifica dacă un API este activat
export const isApiEnabled = (apiName: keyof typeof API_CONFIG) => {
  const config = API_CONFIG[apiName];
  return config && typeof config === 'object' && 'ENABLED' in config 
    ? (config as any).ENABLED 
    : true;
}; 