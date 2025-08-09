-- =====================================================
-- SCRIPT PENTRU ADĂUGAREA COLOANELOR LIPSĂ
-- =====================================================

-- Verifică dacă coloanele există și le adaugă dacă nu există
DO $$
BEGIN
    -- Adaugă coloana locuri_disponibile dacă nu există
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'parcari_raportate' 
        AND column_name = 'locuri_disponibile'
    ) THEN
        ALTER TABLE parcari_raportate ADD COLUMN locuri_disponibile INTEGER DEFAULT 0;
        RAISE NOTICE 'Coloana locuri_disponibile a fost adăugată';
    ELSE
        RAISE NOTICE 'Coloana locuri_disponibile există deja';
    END IF;

    -- Adaugă coloana locuri_indisponibile dacă nu există
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'parcari_raportate' 
        AND column_name = 'locuri_indisponibile'
    ) THEN
        ALTER TABLE parcari_raportate ADD COLUMN locuri_indisponibile INTEGER DEFAULT 0;
        RAISE NOTICE 'Coloana locuri_indisponibile a fost adăugată';
    ELSE
        RAISE NOTICE 'Coloana locuri_indisponibile există deja';
    END IF;

    -- Adaugă coloana locuri_total dacă nu există
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'parcari_raportate' 
        AND column_name = 'locuri_total'
    ) THEN
        ALTER TABLE parcari_raportate ADD COLUMN locuri_total INTEGER DEFAULT 0;
        RAISE NOTICE 'Coloana locuri_total a fost adăugată';
    ELSE
        RAISE NOTICE 'Coloana locuri_total există deja';
    END IF;
END $$;

-- Actualizează datele existente cu valori implicite
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

-- Verifică rezultatul
SELECT 
    nume,
    disponibilitate,
    locuri_disponibile,
    locuri_indisponibile,
    locuri_total
FROM parcari_raportate 
LIMIT 5;

-- Afișează structura tabelului actualizat
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'parcari_raportate'
ORDER BY ordinal_position; 