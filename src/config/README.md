# Configurarea Aplicației

Acest director conține toate configurațiile pentru aplicația de parcare.

## Structura Fișierelor

```
src/config/
├── index.ts              # Export toate configurațiile
├── supabase.ts           # Configurarea Supabase
├── api.ts                # Configurarea API-urilor
├── maps.ts               # Configurarea Google Maps
├── app.ts                # Configurarea aplicației
└── README.md             # Acest fișier
```

## Fișiere de Configurare

### `index.ts`
Export toate configurațiile și funcții utilitare:
- `getAllConfigs()` - Obține toate configurațiile
- `validateConfigs()` - Validează configurațiile

### `supabase.ts`
Configurarea pentru autentificare și baza de date:
- URL și chei pentru Supabase
- Configurare OAuth (Google, Facebook, Instagram)
- Tabele pentru baza de date

### `api.ts`
Configurarea pentru toate API-urile externe:
- Google Maps API
- API-uri pentru parcare
- Configurare AI
- Analytics și notificări

### `maps.ts`
Configurarea specifică pentru Google Maps:
- Cheia API
- Librării necesare
- Centrul implicit (București)
- Zoom implicit

### `app.ts`
Configurarea generală a aplicației:
- Informații despre aplicație
- Configurare UI/UX
- Funcționalități
- Securitate și performanță

## Utilizare

### Import configurații
```typescript
import { SUPABASE_CONFIG } from '@/config/supabase';
import { API_CONFIG } from '@/config/api';
import { APP_CONFIG } from '@/config/app';
```

### Verificare funcționalități
```typescript
import { isFeatureEnabled } from '@/config/app';

if (isFeatureEnabled('AUTHENTICATION')) {
  // Logica pentru autentificare
}
```

### Obținere configurare API
```typescript
import { getApiConfig } from '@/config/api';

const mapsConfig = getApiConfig('GOOGLE_MAPS');
```

### Validare configurații
```typescript
import { validateConfigs } from '@/config';

const validation = validateConfigs();
if (!validation.isValid) {
  console.error('Erori:', validation.errors);
}
```

## Configurare pentru Dezvoltare

1. **Supabase**: Editează `supabase.ts` cu credențialele tale
2. **Google Maps**: Actualizează cheia API în `api.ts`
3. **Funcționalități**: Activează/dezactivează în `app.ts`

## Configurare pentru Producție

1. Actualizează toate URL-urile pentru domeniul de producție
2. Configurează cheile API pentru producție
3. Activează funcționalitățile necesare
4. Validează configurațiile înainte de deploy

## Securitate

- Nu expune cheile private în configurațiile client-side
- Folosește doar cheile publice în browser
- Validează configurațiile înainte de deploy
- Configurează RLS în Supabase pentru protecția datelor

## Debugging

Pentru debugging, poți activa log-urile în `app.ts`:

```typescript
DEBUG: {
  ENABLED: true,
  LOG_LEVEL: 'debug',
  SHOW_ERROR_DETAILS: true
}
``` 