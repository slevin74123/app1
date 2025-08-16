// Configurarea VAPID pentru Push Notifications
export const VAPID_CONFIG = {
  // VAPID Public Key - vizibilă în browser
  PUBLIC_KEY: 'BO7UemLrwuoFLc6d0xNBIhugiy7V5Cyp2YUdFJT96szfnLuehEC0x107eNFOmCYLbWj6xdmV35p-QMhCb2bS9cw',
  
  // VAPID Private Key - secretă, doar pe server
  PRIVATE_KEY: '_c8wcp59ervvCQ20w-6jXWHKwY4K8mTPXNJy8jmuu-0',
  
  // Configurare suplimentară
  SUBJECT: 'mailto:your-email@example.com', // Email-ul tău pentru contact
  AUDIENCE: 'https://your-domain.com', // Domeniul tău
  
  // Setări de securitate
  TTL: 86400, // Time to live în secunde (24 ore)
  URGENCY: 'normal' as 'very-low' | 'low' | 'normal' | 'high'
} as const;

// Funcție pentru a obține VAPID public key
export const getVapidPublicKey = (): string => {
  return VAPID_CONFIG.PUBLIC_KEY;
};

// Funcție pentru a obține VAPID private key
export const getVapidPrivateKey = (): string => {
  return VAPID_CONFIG.PRIVATE_KEY;
};

// Funcție pentru a obține configurația completă VAPID
export const getVapidConfig = () => {
  return VAPID_CONFIG;
};

// Tipul pentru configurația VAPID
export type VapidConfig = typeof VAPID_CONFIG; 