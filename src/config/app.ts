// Configurarea generală a aplicației
export const APP_CONFIG = {
  // Informații despre aplicație
  APP_INFO: {
    NAME: 'Unde Parchez?',
    DESCRIPTION: 'Aplicația de parcare în timp real',
    VERSION: '1.0.0',
    AUTHOR: 'Your Company',
    WEBSITE: 'https://undeparchez.ro'
  },

  // Configurare pentru UI/UX
  UI: {
    THEME: {
      PRIMARY_COLOR: '#3B82F6',
      SECONDARY_COLOR: '#8B5CF6',
      SUCCESS_COLOR: '#10B981',
      WARNING_COLOR: '#F59E0B',
      ERROR_COLOR: '#EF4444'
    },
    ANIMATIONS: {
      ENABLED: true,
      DURATION: 300,
      EASING: 'ease-in-out'
    },
    RESPONSIVE: {
      MOBILE_BREAKPOINT: 768,
      TABLET_BREAKPOINT: 1024,
      DESKTOP_BREAKPOINT: 1280
    }
  },

  // Configurare pentru localizare
  LOCALIZATION: {
    DEFAULT_LANGUAGE: 'ro',
    SUPPORTED_LANGUAGES: ['ro', 'en'],
    DATE_FORMAT: 'DD/MM/YYYY',
    TIME_FORMAT: 'HH:mm',
    CURRENCY: 'RON',
    TIMEZONE: 'Europe/Bucharest'
  },

  // Configurare pentru funcționalități
  FEATURES: {
    AUTHENTICATION: {
      ENABLED: true,
      SOCIAL_LOGIN: true,
      EMAIL_VERIFICATION: true,
      PASSWORD_RESET: true
    },
    PARKING: {
      REAL_TIME_UPDATES: true,
      RESERVATIONS: true,
      PAYMENTS: true,
      NOTIFICATIONS: true
    },
    AI: {
      ENABLED: true,
      SMART_SUGGESTIONS: true,
      PREDICTIVE_ANALYTICS: true
    },
    COMMUNITY: {
      ENABLED: true,
      CHAT: true,
      RATINGS: true,
      REVIEWS: true
    }
  },

  // Configurare pentru securitate
  SECURITY: {
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 ore
    MAX_LOGIN_ATTEMPTS: 5,
    PASSWORD_MIN_LENGTH: 8,
    REQUIRE_STRONG_PASSWORD: true,
    ENABLE_2FA: false
  },

  // Configurare pentru performanță
  PERFORMANCE: {
    CACHE_ENABLED: true,
    LAZY_LOADING: true,
    IMAGE_OPTIMIZATION: true,
    BUNDLE_ANALYSIS: false
  },

  // Configurare pentru debugging
  DEBUG: {
    ENABLED: process.env.NODE_ENV === 'development',
    LOG_LEVEL: 'info',
    SHOW_ERROR_DETAILS: process.env.NODE_ENV === 'development'
  }
};

// Funcție pentru a obține configurarea pentru o funcționalitate specifică
export const getFeatureConfig = (featureName: keyof typeof APP_CONFIG.FEATURES) => {
  return APP_CONFIG.FEATURES[featureName];
};

// Funcție pentru a verifica dacă o funcționalitate este activată
export const isFeatureEnabled = (featureName: keyof typeof APP_CONFIG.FEATURES) => {
  const feature = APP_CONFIG.FEATURES[featureName];
  return feature && typeof feature === 'object' && 'ENABLED' in feature 
    ? feature.ENABLED 
    : true;
};

// Funcție pentru a obține configurarea UI
export const getUIConfig = () => {
  return APP_CONFIG.UI;
};

// Funcție pentru a obține informațiile despre aplicație
export const getAppInfo = () => {
  return APP_CONFIG.APP_INFO;
}; 