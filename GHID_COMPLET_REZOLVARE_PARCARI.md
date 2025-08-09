# 🚨 GHID COMPLET - Rezolvarea problemei cu actualizarea parcărilor

## 📋 **PROBLEMA IDENTIFICATĂ**

Când folosești funcția "Raportează Loc Liber" și selectezi "Parcare parlament":
- ❌ Nu se actualizează pe tooltip
- ❌ Nu se actualizează în baza de date
- ❌ Câmpurile noi (`locuri_disponibile`, `locuri_indisponibile`, `locuri_total`) nu există în baza de date

## 🔧 **SOLUȚIA COMPLETĂ**

### **PASUL 1: Rulează scriptul SQL**

1. **Deschide Supabase Dashboard**
2. **Mergi la SQL Editor**
3. **Copiază și rulează scriptul `SCRIPT_COMPLET_REZOLVARE_PARCARI.sql`**

**SAU rulează comenzile manual:**

```sql
-- 1. Adaugă câmpurile noi
ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_disponibile INTEGER DEFAULT 0;

ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_indisponibile INTEGER DEFAULT 0;

ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_total INTEGER DEFAULT 0;

-- 2. Actualizează parcările existente
UPDATE parcari_raportate 
SET 
    locuri_disponibile = CASE WHEN disponibilitate = true THEN 5 ELSE 0 END,
    locuri_indisponibile = CASE WHEN disponibilitate = false THEN 5 ELSE 0 END,
    locuri_total = 5,
    updated_at = NOW()
WHERE locuri_total IS NULL OR locuri_total = 0;
```

### **PASUL 2: Verifică că funcționează**

Rulează această verificare în SQL Editor:

```sql
-- Verifică că câmpurile au fost adăugate
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'parcari_raportate' 
AND column_name IN ('locuri_disponibile', 'locuri_indisponibile', 'locuri_total');

-- Verifică datele
SELECT 
    nume,
    disponibilitate,
    locuri_disponibile,
    locuri_indisponibile,
    locuri_total
FROM parcari_raportate 
LIMIT 5;
```

### **PASUL 3: Testează aplicația**

1. **Pornește aplicația:** `npm run dev`
2. **Testează funcționalitatea:**
   - Caută "Parcare parlament" în "Raportează Loc Liber"
   - Selectează parcarea
   - Dă click pe "Actualizează Harta"
   - Verifică că se actualizează pe tooltip

## 🎯 **CUM FUNCȚIONEAZĂ ACUM**

### **Formula pentru locuri:**
```
locuri_total = locuri_disponibile + locuri_indisponibile
```

### **Logica de actualizare:**
- **Când parcarea devine DISPONIBILĂ:**
  - `locuri_disponibile = locuri_total`
  - `locuri_indisponibile = 0`

- **Când parcarea devine INDISPONIBILĂ:**
  - `locuri_disponibile = 0`
  - `locuri_indisponibile = locuri_total`

### **Exemplu practic:**
```
Parcare cu 5 locuri totale:
- Disponibilă: 5 libere, 0 ocupate, 5 total
- Indisponibilă: 0 libere, 5 ocupate, 5 total
```

## 🔍 **VERIFICĂRI IMPORTANTE**

### **1. Verifică că câmpurile există:**
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'parcari_raportate' 
AND column_name LIKE 'locuri_%';
```

### **2. Verifică că formula este corectă:**
```sql
SELECT 
    nume,
    locuri_disponibile,
    locuri_indisponibile,
    locuri_total,
    (locuri_disponibile + locuri_indisponibile) as calculated_total
FROM parcari_raportate 
WHERE locuri_total != (locuri_disponibile + locuri_indisponibile);
```

### **3. Testează o actualizare manuală:**
```sql
-- Testează cu "Parcare parlament"
UPDATE parcari_raportate 
SET 
    disponibilitate = false,
    locuri_disponibile = 0,
    locuri_indisponibile = 5,
    locuri_total = 5,
    updated_at = NOW()
WHERE nume ILIKE '%parlament%';
```

## 🚀 **DUPĂ REZOLVARE**

Când câmpurile sunt adăugate și actualizate:

### **În aplicație:**
- ✅ Autocomplete-ul afișează numărul de locuri
- ✅ "Actualizează Harta" funcționează corect
- ✅ Tooltip-urile se actualizează în timp real
- ✅ Formula `total = libere + ocupate` este respectată

### **În baza de date:**
- ✅ Toate parcările au valorile corecte
- ✅ Actualizările se salvează corect
- ✅ Timestamp-ul se actualizează

## ⚠️ **IMPORTANT**

- **Rulează scriptul SQL** înainte de a testa aplicația
- **Verifică că nu există erori** în consolă
- **Testează cu parcări diferite** pentru a te asigura că funcționează

## 🔧 **TROUBLESHOOTING**

### **Dacă încă nu funcționează:**

1. **Verifică că câmpurile au fost adăugate:**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'parcari_raportate' 
AND column_name IN ('locuri_disponibile', 'locuri_indisponibile', 'locuri_total');
```

2. **Verifică că parcările au valori:**
```sql
SELECT nume, locuri_disponibile, locuri_indisponibile, locuri_total 
FROM parcari_raportate 
LIMIT 5;
```

3. **Testează o actualizare manuală:**
```sql
UPDATE parcari_raportate 
SET locuri_disponibile = 3, locuri_indisponibile = 2, locuri_total = 5 
WHERE id = 1;
```

## 📁 **FIȘIERELE MODIFICATE**

- ✅ `src/components/AppFunctionsSidebar.tsx` - Logică de actualizare îmbunătățită
- ✅ `src/components/MapWithParkingPins.tsx` - Tooltip-uri cu informații complete
- ✅ `src/components/ParkingAutocomplete.tsx` - Compatibil cu câmpurile noi
- ✅ `SCRIPT_COMPLET_REZOLVARE_PARCARI.sql` - Script SQL complet
- ✅ `GHID_COMPLET_REZOLVARE_PARCARI.md` - Acest ghid

## 🎯 **TESTARE RAPIDĂ**

După ce rulezi scriptul SQL, testează rapid cu:

```sql
-- Verifică o parcare specifică
SELECT 
    nume,
    disponibilitate,
    locuri_disponibile,
    locuri_indisponibile,
    locuri_total
FROM parcari_raportate 
WHERE nume ILIKE '%parlament%';

-- Testează o actualizare
UPDATE parcari_raportate 
SET 
    disponibilitate = true,
    locuri_disponibile = 5,
    locuri_indisponibile = 0,
    locuri_total = 5
WHERE nume ILIKE '%parlament%';
```

---

**💡 După ce rulezi scriptul SQL, aplicația va funcționa perfect!** 