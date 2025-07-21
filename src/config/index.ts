// Export toate configurațiile din directorul config

import { SUPABASE_CONFIG } from './supabase';
import { API_CONFIG } from './api';

// Configurarea Supabase
export * from './supabase';

// Configurarea API-urilor
export * from './api';

// Configurarea Google Maps
export * from './maps';

// Configurarea aplicației
export * from './app';

// Funcție pentru a obține toate configurațiile
export const getAllConfigs = () => {
  return {
    supabase: import('./supabase'),
    api: import('./api'),
    maps: import('./maps'),
    app: import('./app')
  };
};

// Funcție pentru a valida configurațiile
export const validateConfigs = () => {
  const errors: string[] = [];
  
  // Verifică configurarea Supabase
  const supabaseConfig = SUPABASE_CONFIG;
  if (!supabaseConfig.URL || supabaseConfig.URL === 'https://your-project.supabase.co') {
    errors.push('Supabase URL nu este configurat');
  }
  if (!supabaseConfig.ANON_KEY || supabaseConfig.ANON_KEY === 'your-supabase-anon-key') {
    errors.push('Supabase Anon Key nu este configurat');
  }
  
  // Verifică configurarea Google Maps
  const mapsConfig = API_CONFIG.GOOGLE_MAPS;
  if (!mapsConfig.API_KEY || mapsConfig.API_KEY === 'your-google-maps-api-key') {
    errors.push('Google Maps API Key nu este configurat');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 