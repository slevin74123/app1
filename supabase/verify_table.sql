-- Verificare pentru tabela user_activities
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

-- 2. Dacă tabela există, afișează structura
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
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'user_activities';

-- 5. Testează inserarea unei activități de test
-- (doar dacă tabela există și ai utilizatori)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_activities'
    ) THEN
        -- Verifică dacă ai utilizatori
        IF EXISTS (SELECT FROM auth.users LIMIT 1) THEN
            -- Inserează o activitate de test
            INSERT INTO public.user_activities (user_id, action_type, location, details)
            SELECT 
                id, 
                'community_update', 
                'Test Location', 
                'Activitate de test pentru verificare'
            FROM auth.users 
            LIMIT 1;
            
            RAISE NOTICE '✅ Activitate de test inserată cu succes!';
        ELSE
            RAISE NOTICE '⚠️ Nu ai utilizatori în sistem pentru a testa inserarea';
        END IF;
    ELSE
        RAISE NOTICE '❌ Tabela user_activities nu există!';
    END IF;
END $$; 