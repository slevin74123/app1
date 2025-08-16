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
        ELSE '❌ Tabela user_activities NU EXISTĂ - Rulează create_activity_table_simple.sql'
    END as table_status;

-- 2. Dacă tabela există, verifică structura
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_activities'
ORDER BY ordinal_position;

-- 3. Verifică numărul de activități
SELECT COUNT(*) as total_activities FROM public.user_activities;

-- 4. Verifică RLS policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'user_activities'; 