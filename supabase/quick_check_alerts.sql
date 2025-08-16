-- Verificare rapidă pentru tabela parking_alerts
-- Rulează acest script în Supabase SQL Editor

-- 1. Verifică dacă tabela există
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'parking_alerts'
        ) 
        THEN '✅ Tabela parking_alerts EXISTĂ'
        ELSE '❌ Tabela parking_alerts NU EXISTĂ - Rulează create_alerts_table_simple.sql'
    END as table_status;

-- 2. Dacă tabela există, afișează structura
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'parking_alerts'
ORDER BY ordinal_position;

-- 3. Verifică numărul de alerte
SELECT COUNT(*) as total_alerts FROM public.parking_alerts;

-- 4. Verifică RLS policies
SELECT 
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'parking_alerts'; 