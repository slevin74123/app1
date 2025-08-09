// Configurarea Supabase
export const SUPABASE_CONFIG = {
  // URL-ul proiectului Supabase
  // ⚠️ ATENȚIE: Acest proiect pare să nu mai existe sau să fie suspendat
  // Trebuie să creezi un proiect nou pe https://supabase.com
  URL: 'https://zugwcilkqqkyzloekddp.supabase.co',
  
  // Cheia anonimă pentru client-side
  // ⚠️ Această cheie nu va funcționa dacă proiectul nu există
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z3djaWxrcXFreXpsb2VrZGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDA3NDEsImV4cCI6MjA2Nzk3Njc0MX0.M0Qmw4NaI-1DXacU2N_eTP3YEKKEw52hmSyCAudf_fw',
  
  // Configurare pentru autentificare
  AUTH: {
    // URL-uri de redirect pentru autentificare
    REDIRECT_URLS: [
      'http://localhost:3000/dashboard',
      'http://localhost:3001/dashboard', 
      'http://localhost:3002/dashboard',
      'https://your-domain.com/dashboard'
    ],
    
    // Configurare pentru OAuth providers
    OAUTH: {
      GOOGLE: {
        ENABLED: true,
        CLIENT_ID: 'your-google-client-id',
        CLIENT_SECRET: 'your-google-client-secret'
      },
      FACEBOOK: {
        ENABLED: true,
        APP_ID: 'your-facebook-app-id',
        APP_SECRET: 'your-facebook-app-secret'
      },
      INSTAGRAM: {
        ENABLED: true,
        // Folosește aceleași credențiale ca Facebook
        APP_ID: 'your-facebook-app-id',
        APP_SECRET: 'your-facebook-app-secret'
      }
    }
  },
  
  // Configurare pentru baza de date
  DATABASE: {
    // Tabele pentru aplicația de parcare
    TABLES: {
      USERS: 'users',
      PARKING_SPOTS: 'parking_spots',
      RESERVATIONS: 'reservations',
      PAYMENTS: 'payments',
      NOTIFICATIONS: 'notifications'
    }
  }
};

// Funcție pentru a obține configurarea Supabase
export const getSupabaseConfig = () => {
  return {
    url: SUPABASE_CONFIG.URL,
    anonKey: SUPABASE_CONFIG.ANON_KEY,
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  };
}; 