-- Script pentru adăugarea manuală a câmpurilor noi
-- Rulează aceste comenzi una câte una în Supabase SQL Editor

-- 1. Adaugă câmpul pentru locuri disponibile
ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_disponibile INTEGER DEFAULT 0;

-- 2. Adaugă câmpul pentru locuri indisponibile
ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_indisponibile INTEGER DEFAULT 0;

-- 3. Adaugă câmpul pentru total locuri
ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_total INTEGER DEFAULT 0;

-- 4. Verifică că câmpurile au fost adăugate
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'parcari_raportate' 
AND column_name IN ('locuri_disponibile', 'locuri_indisponibile', 'locuri_total')
ORDER BY column_name;

-- 5. Actualizează parcările existente cu valori implicite
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
    locuri_total = 5
WHERE locuri_total IS NULL OR locuri_total = 0;

-- 6. Verifică rezultatul
SELECT 
    nume,
    disponibilitate,
    locuri_disponibile,
    locuri_indisponibile,
    locuri_total
FROM parcari_raportate 
LIMIT 5; 