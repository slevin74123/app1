# 🚀 Ghid Configurare Supabase - Proiect Nou

## ⚠️ Problema Actuală
Proiectul Supabase cu ID-ul `zugwcilkqqkyzloekddp` nu mai există sau nu este accesibil. Eroarea `ERR_NAME_NOT_RESOLVED` confirmă acest lucru.

## 📋 Pași pentru Crearea unui Proiect Nou Supabase

### 1. Accesează Supabase
- Mergi la [https://supabase.com](https://supabase.com)
- Fă click pe "Start your project" sau "Sign In"

### 2. Creează Proiectul
- Click pe "New Project"
- Alege organizația ta (sau creează una nouă)
- Completează:
  - **Name**: `parking-app` (sau numele dorit)
  - **Database Password**: o parolă sigură (salvează-o!)
  - **Region**: alege cea mai apropiată de România (ex: West Europe)

### 3. Obține Credențialele
După ce proiectul este creat:

1. **Settings** → **API**
2. Copiază:
   - **Project URL** (ex: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (începe cu `eyJ...`)

### 4. Actualizează Configurația
Înlocuiește în `src/config/supabase.ts`:

```typescript
export const SUPABASE_CONFIG = {
  URL: 'https://YOUR_NEW_PROJECT_ID.supabase.co', // URL-ul nou
  ANON_KEY: 'YOUR_NEW_ANON_KEY', // Cheia nouă
  // ... restul rămâne la fel
};
```

### 5. Creează Tabelele
În Supabase Dashboard → **SQL Editor**, rulează:

```sql
-- Tabela pentru parcări raportate
CREATE TABLE parcari_raportate (
  id BIGSERIAL PRIMARY KEY,
  nume VARCHAR(255) NOT NULL,
  adresa VARCHAR(500) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  numar_recenzii INTEGER DEFAULT 0,
  disponibilitate BOOLEAN DEFAULT true,
  garaj BOOLEAN DEFAULT false,
  acoperit BOOLEAN DEFAULT false,
  securitate BOOLEAN DEFAULT false,
  pret_pe_ora DECIMAL(10,2) DEFAULT 0,
  distanta_km DECIMAL(5,2) DEFAULT 0,
  timp_mers_minute INTEGER DEFAULT 0,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexuri pentru performanță
CREATE INDEX idx_parcari_raportate_location ON parcari_raportate(lat, lng);
CREATE INDEX idx_parcari_raportate_user ON parcari_raportate(user_id);
CREATE INDEX idx_parcari_raportate_created ON parcari_raportate(created_at);

-- Trigger pentru updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_parcari_raportate_updated_at 
    BEFORE UPDATE ON parcari_raportate 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE parcari_raportate ENABLE ROW LEVEL SECURITY;

-- Permite citirea pentru toți utilizatorii
CREATE POLICY "Allow public read access" ON parcari_raportate
    FOR SELECT USING (true);

-- Permite inserarea pentru utilizatorii autentificați
CREATE POLICY "Allow authenticated insert" ON parcari_raportate
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Permite actualizarea pentru proprietarul înregistrării
CREATE POLICY "Allow owner update" ON parcari_raportate
    FOR UPDATE USING (auth.uid() = user_id);

-- Permite ștergerea pentru proprietarul înregistrării
CREATE POLICY "Allow owner delete" ON parcari_raportate
    FOR DELETE USING (auth.uid() = user_id);
```

### 6. Configurează Autentificarea
În **Authentication** → **Settings**:

1. **Site URL**: `http://localhost:3000`
2. **Redirect URLs**: 
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/auth/callback`

### 7. Testează Conectivitatea
După actualizarea configurației:

```bash
npm run dev
```

Verifică în consolă că nu mai apar erorile `ERR_NAME_NOT_RESOLVED`.

## 🔧 Soluții Alternative

### Pentru Dezvoltare Locală (Fără Supabase)
Aplicația este configurată să funcționeze și fără Supabase în mod dezvoltare:

1. **Mod dezvoltare activat** în `ProtectedRoute.tsx`
2. **Mock user** creat automat în `AuthContext.tsx`
3. **Funcționalități de bază** disponibile fără backend

### Pentru Testare Rapidă
Poți testa aplicația fără să configurezi Supabase imediat:

1. Aplicația va funcționa în mod dezvoltare
2. Harta și funcționalitățile de bază vor merge
3. Când vei fi gata, configurează Supabase pentru funcționalități complete

## 📞 Suport
Dacă ai probleme cu configurarea:
1. Verifică că URL-ul și cheia sunt corecte
2. Asigură-te că tabelele sunt create
3. Verifică că RLS policies sunt active
4. Testează conectivitatea cu `ping YOUR_PROJECT_URL` 