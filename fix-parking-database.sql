-- SCRIPT COMPLET PENTRU REZOLVAREA PROBLEMEI CU CÂMPURILE LIPSĂ
-- Rulează aceste comenzi în Supabase SQL Editor

-- 1. Adaugă câmpurile noi dacă nu există
ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_disponibile INTEGER DEFAULT 0;

ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_indisponibile INTEGER DEFAULT 0;

ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_total INTEGER DEFAULT 0;

-- 2. Verifică că câmpurile au fost adăugate
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'parcari_raportate' 
AND column_name IN ('locuri_disponibile', 'locuri_indisponibile', 'locuri_total')
ORDER BY column_name;

-- 3. Actualizează toate parcările existente cu valori implicite
UPDATE parcari_raportate 
SET 
    locuri_disponibile = CASE 
        WHEN disponibilitate = true THEN 5 
        ELSE 0 
    END,
    locuri_indisponibile = CASE 
        WHEN disponibilitate = false THEN 5 
        ELSE 0 
    END,
    locuri_total = 5,
    updated_at = NOW()
WHERE locuri_total IS NULL OR locuri_total = 0;

-- 4. Verifică rezultatul actualizării
SELECT 
    id,
    nume,
    disponibilitate,
    locuri_disponibile,
    locuri_indisponibile,
    locuri_total,
    updated_at
FROM parcari_raportate 
ORDER BY updated_at DESC
LIMIT 10;

-- 5. Testează o actualizare manuală pentru "Parcare parlament"
-- (Înlocuiește ID-ul cu cel real al parcării "Parcare parlament")
UPDATE parcari_raportate 
SET 
    disponibilitate = false,
    locuri_disponibile = 0,
    locuri_indisponibile = 5,
    locuri_total = 5,
    updated_at = NOW()
WHERE nume ILIKE '%parlament%';

-- 6. Verifică că actualizarea a funcționat
SELECT 
    id,
    nume,
    disponibilitate,
    locuri_disponibile,
    locuri_indisponibile,
    locuri_total,
    updated_at
FROM parcari_raportate 
WHERE nume ILIKE '%parlament%';

-- 7. Verifică că formula este corectă: total = disponibile + indisponibile
SELECT 
    nume,
    locuri_disponibile,
    locuri_indisponibile,
    locuri_total,
    (locuri_disponibile + locuri_indisponibile) as calculated_total,
    CASE 
        WHEN locuri_total = (locuri_disponibile + locuri_indisponibile) 
        THEN '✅ Corect' 
        ELSE '❌ Incorect' 
    END as validation
FROM parcari_raportate 
LIMIT 10; 