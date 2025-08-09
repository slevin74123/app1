# 🚗 Ghid Complet - Inserarea Parcărilor din București

## 📋 Opțiuni de Inserare

Ai **3 metode** pentru a adăuga parcările în baza de date:

### 1️⃣ **Metoda 1: SQL Direct în Supabase** (Recomandată)
**Pentru utilizatori avansați**

1. Deschide **Supabase Dashboard**
2. Mergi la **SQL Editor**
3. Copiază și rulează conținutul din `insert-bucharest-parkings.sql`

```sql
-- Exemplu din fișierul SQL:
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Piața Victoriei', 'Piața Victoriei, Sector 1', 4.2, 45, true, false, true, true, 8.0, 0.1, 2, 44.4268, 26.1025, 'admin-user', NOW(), NOW());
```

**Avantaje:**
- ✅ Control total asupra datelor
- ✅ Poți modifica valorile înainte de inserare
- ✅ Poți rula doar anumite zone
- ✅ Vedezi erorile imediat

### 2️⃣ **Metoda 2: Script Node.js** (Pentru dezvoltatori)
**Pentru utilizatori cu experiență în programare**

1. Deschide terminal în proiect
2. Rulează scriptul:

```bash
node insert-bucharest-parkings.js
```

**Avantaje:**
- ✅ Automatizare completă
- ✅ Gestionare erori avansată
- ✅ Logging detaliat
- ✅ Poți modifica datele în cod

### 3️⃣ **Metoda 3: Inserare Manuală** (Pentru începători)
**Pentru utilizatori fără experiență tehnică**

1. Deschide **Supabase Dashboard**
2. Mergi la **Table Editor**
3. Selectează tabelul `parcari_raportate`
4. Adaugă manual fiecare parcare

## 🗺️ Zonele Disponibile

Scriptul include **36 de parcări** din **12 zone**:

| Zona | Parcări | Preț Mediu | Rating Mediu |
|------|---------|------------|--------------|
| **Piața Victoriei** | 3 | 8.7 RON | 4.2/5 |
| **Piața Unirii** | 3 | 5.0 RON | 4.1/5 |
| **Centrul Vechi** | 3 | 7.0 RON | 4.2/5 |
| **Berceni** | 3 | 4.0 RON | 4.0/5 |
| **Drumul Taberei** | 3 | 4.0 RON | 4.0/5 |
| **Băneasa** | 3 | 5.7 RON | 4.3/5 |
| **Pantelimon** | 3 | 4.0 RON | 3.9/5 |
| **Cotroceni** | 3 | 6.3 RON | 4.3/5 |
| **Primăverii** | 3 | 9.0 RON | 4.4/5 |
| **Titan** | 3 | 4.7 RON | 4.0/5 |
| **Militari** | 3 | 4.0 RON | 4.0/5 |
| **Colentina** | 3 | 4.0 RON | 3.9/5 |

## 📊 Structura Datelor

Fiecare parcare conține:

```sql
{
  "nume": "Numele parcarei",
  "adresa": "Adresa completă",
  "rating": 4.2,                    -- Rating 1-5
  "numar_recenzii": 45,             -- Numărul de recenzii
  "disponibilitate": true,          -- Dacă este disponibilă
  "garaj": false,                   -- Dacă este garaj
  "acoperit": true,                 -- Dacă este acoperită
  "securitate": true,               -- Dacă are securitate
  "pret_pe_ora": 8.0,              -- Prețul per oră
  "distanta_km": 0.1,              -- Distanța în km
  "timp_mers_minute": 2,           -- Timpul de mers în minute
  "lat": 44.4268,                  -- Latitudine
  "lng": 26.1025,                  -- Longitudine
  "user_id": "admin-user",         -- ID-ul utilizatorului
  "created_at": "2025-01-20...",   -- Data creării
  "updated_at": "2025-01-20..."    -- Data actualizării
}
```

## ⚠️ Important - Verificări înainte de Inserare

### 1. Verifică Tabelul
```sql
-- Verifică dacă tabelul există
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'parcari_raportate'
);
```

### 2. Verifică Structura
```sql
-- Verifică structura tabelului
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'parcari_raportate'
ORDER BY ordinal_position;
```

### 3. Verifică RLS (Row Level Security)
```sql
-- Verifică politicile RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'parcari_raportate';
```

## 🔧 Comenzi Utile după Inserare

### Verificare Inserări
```sql
-- Numărul total de parcări
SELECT COUNT(*) as total_parcari FROM parcari_raportate;

-- Statistici generale
SELECT 
    COUNT(*) as total_parcari,
    AVG(rating) as rating_mediu,
    AVG(pret_pe_ora) as pret_mediu,
    MIN(pret_pe_ora) as pret_minim,
    MAX(pret_pe_ora) as pret_maxim
FROM parcari_raportate;
```

### Căutare după Zonă
```sql
-- Parcări din Piața Victoriei
SELECT * FROM parcari_raportate 
WHERE nume LIKE '%Victoriei%' OR nume LIKE '%Guvern%' OR nume LIKE '%Parlament%';

-- Parcări din Centrul Vechi
SELECT * FROM parcari_raportate 
WHERE nume LIKE '%Centrul Vechi%' OR nume LIKE '%Lipscani%' OR nume LIKE '%Hanul%';
```

### Căutare după Preț
```sql
-- Parcări sub 5 RON/oră
SELECT * FROM parcari_raportate WHERE pret_pe_ora < 5 ORDER BY pret_pe_ora;

-- Parcări peste 8 RON/oră
SELECT * FROM parcari_raportate WHERE pret_pe_ora > 8 ORDER BY pret_pe_ora DESC;
```

### Căutare după Rating
```sql
-- Parcări cu rating peste 4.5
SELECT * FROM parcari_raportate WHERE rating > 4.5 ORDER BY rating DESC;

-- Parcări cu rating sub 4.0
SELECT * FROM parcari_raportate WHERE rating < 4.0 ORDER BY rating;
```

## 🚨 Rezolvarea Problemelor

### Eroare: "new row violates row-level security policy"
**Cauza:** RLS blochează inserarea
**Soluția:**
```sql
-- Dezactivează temporar RLS pentru inserare
ALTER TABLE parcari_raportate DISABLE ROW LEVEL SECURITY;

-- Inseră datele

-- Reactivează RLS
ALTER TABLE parcari_raportate ENABLE ROW LEVEL SECURITY;
```

### Eroare: "duplicate key value violates unique constraint"
**Cauza:** Parcarea există deja
**Soluția:**
```sql
-- Șterge parcările existente înainte de inserare
DELETE FROM parcari_raportate WHERE nume LIKE '%Parcare%';

-- Apoi rulează inserarea din nou
```

### Eroare: "column does not exist"
**Cauza:** Structura tabelului nu corespunde
**Soluția:**
```sql
-- Verifică structura actuală
\d parcari_raportate

-- Modifică interogarea pentru a corespunde structurii
```

## 📈 După Inserare - Testare

### 1. Testează Aplicația
```bash
npm run dev
```
Verifică dacă parcările apar pe hartă și în listă.

### 2. Testează Căutarea
- Caută "Piața Victoriei"
- Caută "Centrul Vechi"
- Verifică dacă rezultatele apar corect

### 3. Testează Filtrele
- Filtrează după preț
- Filtrează după rating
- Verifică dacă filtrele funcționează

## 🎯 Recomandări

1. **Pentru începători:** Folosește Metoda 3 (inserare manuală)
2. **Pentru dezvoltatori:** Folosește Metoda 2 (script Node.js)
3. **Pentru avansați:** Folosește Metoda 1 (SQL direct)

4. **Backup înainte de inserare:**
```sql
-- Creează backup
CREATE TABLE parcari_raportate_backup AS 
SELECT * FROM parcari_raportate;
```

5. **Testează pe o bază de date de dezvoltare înainte de producție**

## 📞 Suport

Dacă întâmpini probleme:
1. Verifică log-urile din Supabase
2. Verifică consola browserului
3. Verifică terminalul pentru erori
4. Contactează echipa de dezvoltare

---

**🎉 Succes cu inserarea parcărilor din București!** 