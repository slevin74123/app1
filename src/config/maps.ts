import { API_CONFIG } from './api';

// Configurarea Google Maps
export const GOOGLE_MAPS_CONFIG = API_CONFIG.GOOGLE_MAPS;

// Cheia API pentru Google Maps (pentru compatibilitate)
export const GOOGLE_MAPS_API_KEY: string = GOOGLE_MAPS_CONFIG.API_KEY;

// Funcție pentru a obține configurarea completă Google Maps
export const getGoogleMapsConfig = () => {
  return {
    apiKey: GOOGLE_MAPS_CONFIG.API_KEY,
    libraries: GOOGLE_MAPS_CONFIG.LIBRARIES,
    defaultCenter: GOOGLE_MAPS_CONFIG.DEFAULT_CENTER,
    defaultZoom: GOOGLE_MAPS_CONFIG.DEFAULT_ZOOM
  };
};