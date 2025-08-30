import { Loader, Library } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_CONFIG } from '@/config/maps';

if (!GOOGLE_MAPS_API_KEY) {
  // Fail fast for missing key in development
  // eslint-disable-next-line no-console
  console.error('Google Maps API key is missing in config. Set API_CONFIG.GOOGLE_MAPS.API_KEY in src/config/api.ts');
}

const libraries = [...(GOOGLE_MAPS_CONFIG.LIBRARIES || ['places'])] as unknown as Library[];

console.log('🔧 Google Maps Loader Configuration:', {
  apiKey: GOOGLE_MAPS_API_KEY ? '✅ Set' : '❌ Missing',
  libraries,
  version: 'weekly'
});

// Shared singleton Loader to avoid multiple script injections
export const googleMapsLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries
}); 