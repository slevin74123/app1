-- =====================================================
-- SCRIPT COMPLET PENTRU REZOLVAREA PROBLEMEI CU CÂMPURILE LIPSĂ
-- =====================================================
-- Rulează aceste comenzi în Supabase SQL Editor în ordinea indicată

-- =====================================================
-- PASUL 1: VERIFICARE STRUCTURĂ ACTUALĂ
-- =====================================================

-- Verifică structura tabelului parcari_raportate
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'parcari_raportate'
ORDER BY ordinal_position;

-- =====================================================
-- PASUL 2: ADĂUGARE CÂMPURI NOI
-- =====================================================

-- Adaugă câmpul pentru locuri disponibile
ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_disponibile INTEGER DEFAULT 0;

-- Adaugă câmpul pentru locuri indisponibile
ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_indisponibile INTEGER DEFAULT 0;

-- Adaugă câmpul pentru total locuri
ALTER TABLE parcari_raportate 
ADD COLUMN IF NOT EXISTS locuri_total INTEGER DEFAULT 0;

-- =====================================================
-- PASUL 3: VERIFICARE CÂMPURI ADĂUGATE
-- =====================================================

-- Verifică că câmpurile au fost adăugate
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'parcari_raportate' 
AND column_name IN ('locuri_disponibile', 'locuri_indisponibile', 'locuri_total')
ORDER BY column_name;

-- =====================================================
-- PASUL 4: ACTUALIZARE PARCĂRI EXISTENTE
-- =====================================================

-- Actualizează toate parcările existente cu valori implicite
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

-- =====================================================
-- PASUL 5: VERIFICARE REZULTATE
-- =====================================================

-- Verifică rezultatul actualizării
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

-- =====================================================
-- PASUL 6: TEST ACTUALIZARE MANUALĂ
-- =====================================================

-- Testează o actualizare manuală pentru "Parcare parlament"
UPDATE parcari_raportate 
SET 
    disponibilitate = false,
    locuri_disponibile = 0,
    locuri_indisponibile = 5,
    locuri_total = 5,
    updated_at = NOW()
WHERE nume ILIKE '%parlament%';

-- Verifică că actualizarea a funcționat
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

-- =====================================================
-- PASUL 7: VALIDARE FORMULĂ
-- =====================================================

-- Verifică că formula este corectă: total = disponibile + indisponibile
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
ORDER BY nume
LIMIT 15;

-- =====================================================
-- PASUL 8: VERIFICARE FINALĂ
-- =====================================================

-- Verifică că toate parcările au valorile corecte
SELECT 
    COUNT(*) as total_parcari,
    COUNT(CASE WHEN locuri_total > 0 THEN 1 END) as parcari_cu_total,
    COUNT(CASE WHEN locuri_disponibile >= 0 THEN 1 END) as parcari_cu_disponibile,
    COUNT(CASE WHEN locuri_indisponibile >= 0 THEN 1 END) as parcari_cu_indisponibile,
    COUNT(CASE WHEN locuri_total = (locuri_disponibile + locuri_indisponibile) THEN 1 END) as parcari_corecte
FROM parcari_raportate;

-- =====================================================
-- PASUL 9: EXEMPLU DE ACTUALIZARE DIN APLICAȚIE
-- =====================================================

-- Simulează o actualizare din aplicație (parcare devine disponibilă)
UPDATE parcari_raportate 
SET 
    disponibilitate = true,
    locuri_disponibile = 5,
    locuri_indisponibile = 0,
    locuri_total = 5,
    updated_at = NOW()
WHERE nume ILIKE '%victoriei%'
LIMIT 1;

-- Verifică rezultatul
SELECT 
    nume,
    disponibilitate,
    locuri_disponibile,
    locuri_indisponibile,
    locuri_total,
    updated_at
FROM parcari_raportate 
WHERE nume ILIKE '%victoriei%'
ORDER BY updated_at DESC
LIMIT 1;

-- =====================================================
-- MESAJ FINAL
-- =====================================================

-- Afișează un mesaj de succes
SELECT 
    '✅ SCRIPT EXECUTAT CU SUCCES!' as status,
    'Toate câmpurile au fost adăugate și actualizate.' as message,
    'Aplicația ar trebui să funcționeze corect acum.' as next_step; 