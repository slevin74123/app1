-- Script de verificare pentru tabela user_activities
-- Rulează acest script în Supabase SQL Editor pentru a verifica dacă tabela există

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

-- 2. Verifică structura tabelei (dacă există)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_activities'
    ) THEN
        RAISE NOTICE 'Structura tabelei user_activities:';
        RAISE NOTICE 'Coloane: %', (
            SELECT string_agg(column_name || ' (' || data_type || ')', ', ')
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_activities'
        );
    ELSE
        RAISE NOTICE 'Tabela user_activities nu există!';
    END IF;
END $$;

-- 3. Verifică RLS policies
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM pg_policies 
            WHERE tablename = 'user_activities'
        ) 
        THEN '✅ RLS policies EXISTĂ'
        ELSE '❌ RLS policies NU EXISTĂ'
    END as rls_status;

-- 4. Verifică indexurile
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM pg_indexes 
            WHERE tablename = 'user_activities'
        ) 
        THEN '✅ Indexuri EXISTĂ'
        ELSE '❌ Indexuri NU EXISTĂ'
    END as indexes_status;

-- 5. Verifică trigger-ele
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM pg_trigger 
            WHERE tgrelid = 'public.user_activities'::regclass
        ) 
        THEN '✅ Trigger-e EXISTĂ'
        ELSE '❌ Trigger-e NU EXISTĂ'
    END as triggers_status;

-- 6. Verifică dacă există utilizatori în sistem
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM auth.users 
            LIMIT 1
        ) 
        THEN '✅ Utilizatori EXISTĂ în sistem'
        ELSE '❌ NU EXISTĂ utilizatori în sistem'
    END as users_status;

-- 7. Afișează numărul de utilizatori
SELECT COUNT(*) as total_users FROM auth.users;

-- 8. Afișează numărul de activități (dacă tabela există)
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user_activities'
        ) 
        THEN (SELECT COUNT(*) FROM public.user_activities)::text
        ELSE 'Tabela nu există'
    END as total_activities; 