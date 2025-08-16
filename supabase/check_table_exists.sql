-- Verificare rapidă pentru tabela user_activities
-- Rulează acest script în Supabase SQL Editor

-- 1. Verifică dacă tabela există
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user_activities'
        ) 
        THEN '✅ Tabela user_activities EXISTĂ'
        ELSE '❌ Tabela user_activities NU EXISTĂ'
    END as table_status;

-- 2. Dacă tabela NU există, rulează create_activity_table_simple.sql
-- 3. Dacă tabela există, verifică structura
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_activities'
ORDER BY ordinal_position; 