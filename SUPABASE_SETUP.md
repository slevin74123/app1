# Configurarea Autentificării Supabase

## Pași pentru configurarea autentificării cu Gmail, Facebook și Instagram

### 1. Creează un proiect Supabase

1. Mergi la [supabase.com](https://supabase.com)
2. Creează un cont nou sau autentifică-te
3. Creează un proiect nou
4. Notează URL-ul proiectului și cheia anonimă

### 2. Configurează Supabase în fișierul de configurare

Editează fișierul `src/config/supabase.ts` și înlocuiește valorile cu cele reale:

```typescript
export const SUPABASE_CONFIG = {
  // URL-ul proiectului Supabase
  URL: 'https://your-actual-project.supabase.co',
  
  // Cheia anonimă pentru client-side
  ANON_KEY: 'your-actual-supabase-anon-key',
  
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
        APP_ID: 'your-facebook-app-id',
        APP_SECRET: 'your-facebook-app-secret'
      }
    }
  }
};
```

### 3. Configurează Google Maps API

Editează fișierul `src/config/api.ts` și actualizează cheia Google Maps:

```typescript
GOOGLE_MAPS: {
  API_KEY: 'your-actual-google-maps-api-key',
  // ... restul configurației
}
```

### 4. Configurează autentificarea OAuth în Supabase

#### Pentru Google:
1. Mergi la **Authentication** > **Providers** în dashboard-ul Supabase
2. Activează **Google**
3. Creează un proiect în [Google Cloud Console](https://console.cloud.google.com)
4. Configurează OAuth 2.0 și obține Client ID și Client Secret
5. Adaugă în Supabase:
   - **Client ID**: ID-ul din Google Cloud Console
   - **Client Secret**: Secret-ul din Google Cloud Console
   - **Redirect URL**: `https://your-project.supabase.co/auth/v1/callback`

#### Pentru Facebook:
1. Mergi la **Authentication** > **Providers** în dashboard-ul Supabase
2. Activează **Facebook**
3. Creează o aplicație în [Facebook Developers](https://developers.facebook.com)
4. Configurează Facebook Login și obține App ID și App Secret
5. Adaugă în Supabase:
   - **Client ID**: App ID-ul din Facebook
   - **Client Secret**: App Secret-ul din Facebook
   - **Redirect URL**: `https://your-project.supabase.co/auth/v1/callback`

#### Pentru Instagram:
1. Instagram folosește Facebook OAuth pentru autentificare
2. În aplicația Facebook, adaugă produsul **Instagram Basic Display**
3. Configurează permisiunile pentru Instagram
4. Folosește aceleași credențiale ca pentru Facebook

### 5. Configurează URL-urile de redirect

În dashboard-ul Supabase, mergi la **Authentication** > **URL Configuration** și adaugă:

```
http://localhost:3000/dashboard
http://localhost:3001/dashboard
http://localhost:3002/dashboard
https://your-domain.com/dashboard
```

### 6. Validează configurațiile

Aplicația include o funcție de validare pentru configurații. Poți verifica dacă totul este configurat corect:

```typescript
import { validateConfigs } from '@/config';

const validation = validateConfigs();
if (!validation.isValid) {
  console.error('Erori de configurare:', validation.errors);
}
```

### 7. Testează autentificarea

1. Pornește aplicația: `npm run dev`
2. Mergi la pagina principală
3. Apasă pe "Autentificare" sau "Înregistrare"
4. Testează autentificarea cu fiecare provider

### 8. Configurare pentru producție

Pentru producție, asigură-te că:

1. Folosești un domeniu HTTPS
2. Configurezi URL-urile de redirect pentru domeniul tău
3. Actualizezi configurațiile în fișierele din `src/config/`
4. Configurezi CORS în Supabase dacă este necesar

### 9. Securitate

- Nu expune niciodată cheile private în codul client
- Folosește doar cheile publice în configurațiile client-side
- Configurează RLS (Row Level Security) în Supabase pentru a proteja datele
- Validează configurațiile înainte de deploy

### 10. Structura fișierelor de configurare

```
src/config/
├── index.ts              # Export toate configurațiile
├── supabase.ts           # Configurarea Supabase
├── api.ts                # Configurarea API-urilor
├── maps.ts               # Configurarea Google Maps
└── app.ts                # Configurarea aplicației
```

### 11. Funcționalități implementate

✅ Autentificare cu Google  
✅ Autentificare cu Facebook  
✅ Autentificare cu Instagram (prin Facebook)  
✅ Autentificare cu email/parolă  
✅ Înregistrare cu email/parolă  
✅ Deconectare  
✅ Persistența sesiunii  
✅ Interfață responsivă  
✅ Notificări de succes/eroare  
✅ Protecție pentru rutele autentificate  
✅ Configurare centralizată  
✅ Validare configurații  

### 12. Utilizare

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { getApiConfig } from '@/config/api';
import { isFeatureEnabled } from '@/config/app';

function MyComponent() {
  const { user, signInWithGoogle, signOut } = useAuth();
  
  // Verifică dacă o funcționalitate este activată
  if (isFeatureEnabled('AUTHENTICATION')) {
    // Logica pentru autentificare
  }
  
  // Obține configurarea pentru un API
  const mapsConfig = getApiConfig('GOOGLE_MAPS');
  
  if (user) {
    return <div>Bună, {user.email}!</div>;
  }
  
  return <button onClick={signInWithGoogle}>Autentificare cu Google</button>;
}
``` 