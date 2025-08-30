-- 🔧 Script pentru corectarea permisiunilor RLS în Supabase
-- Rulează acest script în Supabase SQL Editor pentru a rezolva eroarea 406

-- ========================================
-- 1. VERIFICĂ STAREA ACTUALĂ
-- ========================================

-- Verifică dacă RLS este activat pe tabele
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('parking_spots', 'parking_spot_status_history', 'parking_locations')
ORDER BY tablename;

-- Verifică politicile RLS existente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('parking_spots', 'parking_spot_status_history', 'parking_locations')
ORDER BY tablename, policyname;

-- Verifică permisiunile actuale
SELECT 
  table_name,
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name IN ('parking_spots', 'parking_spot_status_history', 'parking_locations')
AND grantee IN ('authenticated', 'anon')
ORDER BY table_name, grantee, privilege_type;

-- ========================================
-- 2. CONFIGUREAZĂ PERMISIUNILE CORECTE
-- ========================================

-- Acordă permisiuni complete utilizatorilor autentificați
GRANT ALL ON parking_spots TO authenticated;
GRANT ALL ON parking_spot_status_history TO authenticated;
GRANT ALL ON parking_locations TO authenticated;

-- Acordă permisiuni de citire utilizatorilor anonimi (dacă este necesar)
GRANT SELECT ON parking_locations TO anon;
GRANT SELECT ON parking_spots TO anon;

-- ========================================
-- 3. CONFIGUREAZĂ RLS CORECT
-- ========================================

-- Dezactivează temporar RLS pentru a putea configura politicile
ALTER TABLE parking_spots DISABLE ROW LEVEL SECURITY;
ALTER TABLE parking_spot_status_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE parking_locations DISABLE ROW LEVEL SECURITY;

-- Șterge politicile RLS existente (dacă există)
DROP POLICY IF EXISTS "Enable read access for all users" ON parking_spots;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON parking_spots;
DROP POLICY IF EXISTS "Enable update for users based on email" ON parking_spots;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON parking_spots;

-- Creează politicile RLS corecte pentru parking_spots
CREATE POLICY "Allow authenticated users full access to parking spots" ON parking_spots
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Creează politicile RLS corecte pentru parking_spot_status_history
CREATE POLICY "Allow authenticated users full access to parking history" ON parking_spot_status_history
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Creează politicile RLS corecte pentru parking_locations
CREATE POLICY "Allow authenticated users full access to parking locations" ON parking_locations
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Creează politicile pentru utilizatorii anonimi (doar citire)
CREATE POLICY "Allow anonymous users to read parking locations" ON parking_locations
FOR SELECT TO anon
USING (true);

CREATE POLICY "Allow anonymous users to read parking spots" ON parking_spots
FOR SELECT TO anon
USING (true);

-- ========================================
-- 4. ACTIVEAZĂ RLS CU NOILE POLITICI
-- ========================================

-- Activează RLS cu noile politici
ALTER TABLE parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_spot_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_locations ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 5. VERIFICĂ CONFIGURAREA
-- ========================================

-- Verifică că RLS este activat
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('parking_spots', 'parking_spot_status_history', 'parking_locations')
ORDER BY tablename;

-- Verifică noile politici RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('parking_spots', 'parking_spot_status_history', 'parking_locations')
ORDER BY tablename, policyname;

-- Verifică permisiunile finale
SELECT 
  table_name,
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name IN ('parking_spots', 'parking_spot_status_history', 'parking_locations')
AND grantee IN ('authenticated', 'anon')
ORDER BY table_name, grantee, privilege_type;

-- ========================================
-- 6. TESTEAZĂ ACCESUL
-- ========================================

-- Testează accesul la parking_spots (ar trebui să funcționeze)
SELECT COUNT(*) as total_spots FROM parking_spots;

-- Testează accesul la parking_locations (ar trebui să funcționeze)
SELECT COUNT(*) as total_locations FROM parking_locations;

-- Testează accesul la parking_spot_status_history (ar trebui să funcționeze)
SELECT COUNT(*) as total_history FROM parking_spot_status_history;

-- ========================================
-- 7. MESAJ DE CONFIRMARE
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '✅ Configurarea RLS a fost completată cu succes!';
  RAISE NOTICE '🔓 Utilizatorii autentificați au acces complet la tabelele de parcare';
  RAISE NOTICE '👁️ Utilizatorii anonimi pot citi datele de parcare';
  RAISE NOTICE '🚗 Funcția "Raportează Loc Liber" ar trebui să funcționeze acum!';
END $$; 