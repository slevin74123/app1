// Configurarea de fallback pentru Supabase
export const SUPABASE_FALLBACK_CONFIG = {
  // URL-ul alternativ pentru testare
  URL: 'https://supabase.com',
  
  // Cheia anonimă temporară
  ANON_KEY: 'fallback-key',
  
  // Configurare pentru autentificare
  AUTH: {
    REDIRECT_URLS: [
      'http://localhost:3000/dashboard',
      'http://localhost:3001/dashboard', 
      'http://localhost:3002/dashboard'
    ]
  }
};

// Funcție pentru a obține configurarea de fallback
export const getSupabaseFallbackConfig = () => {
  return {
    url: SUPABASE_FALLBACK_CONFIG.URL,
    anonKey: SUPABASE_FALLBACK_CONFIG.ANON_KEY,
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  };
}; 