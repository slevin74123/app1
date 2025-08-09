-- Script pentru actualizarea tabelului parcari_raportate cu câmpuri pentru gestionarea locurilor
-- Rulează aceste interogări în Supabase SQL Editor

-- 1. Adaugă câmpurile pentru numărul de locuri
ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_disponibile INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locuri_indisponibile INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locuri_total INTEGER DEFAULT 0;

-- 2. Actualizează parcările existente cu valori implicite
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

-- 3. Verifică structura actualizată
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'parcari_raportate' 
ORDER BY ordinal_position;

-- 4. Afișează parcările cu noile câmpuri
SELECT 
    nume,
    adresa,
    disponibilitate,
    locuri_disponibile,
    locuri_indisponibile,
    locuri_total,
    pret_pe_ora,
    rating
FROM parcari_raportate 
ORDER BY nume; 