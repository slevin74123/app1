-- Script de test complet pentru verificarea structurii bazei de date
-- Rulează acest script în Supabase SQL Editor pentru a identifica problemele

-- 1. Verifică că tabelele există și au structura corectă
SELECT 
  table_name,
  table_type,
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'parking_spots',
  'parking_spot_status_history',
  'parking_locations'
)
ORDER BY table_name;

-- 2. Verifică structura detaliată a tabelei parking_spots
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'parking_spots' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verifică permisiunile pentru utilizatorul authenticated
SELECT 
  grantee,
  table_name,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name IN (
  'parking_spots',
  'parking_spot_status_history',
  'parking_locations'
)
AND grantee IN ('authenticated', 'anon')
ORDER BY table_name, grantee, privilege_type;

-- 4. Verifică că există date în parking_locations
SELECT COUNT(*) as total_parking_locations FROM parking_locations;
SELECT id, name FROM parking_locations LIMIT 3;

-- 5. Verifică că există utilizatori autentificați
SELECT COUNT(*) as total_users FROM auth.users;
SELECT id FROM auth.users LIMIT 1;

-- 6. Testează accesul la parking_spots cu un query simplu
SELECT COUNT(*) as total_parking_spots FROM parking_spots;

-- 7. Verifică dacă există locuri de parcare pentru o locație specifică
SELECT 
  ps.id,
  ps.spot_number,
  ps.status,
  pl.name as parking_location_name
FROM parking_spots ps
JOIN parking_locations pl ON ps.parking_location_id = pl.id
LIMIT 5;

-- 8. Verifică dacă RLS este activat și ce politici există
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
AND tablename IN (
  'parking_spots',
  'parking_spot_status_history',
  'parking_locations'
);

-- 9. Verifică dacă există constrângeri care pot cauza probleme
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = (
  SELECT oid FROM pg_class 
  WHERE relname = 'parking_spots' 
  AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
);

-- 10. Testează inserarea cu o metodă simplă
-- Înlocuiește UUID-urile cu valori valide din baza ta de date
INSERT INTO parking_spots (
  parking_location_id,
  spot_number,
  status,
  last_reported_by
) VALUES (
  (SELECT id FROM parking_locations LIMIT 1),
  'TEST_STRUCTURE_001',
  'available',
  (SELECT id FROM auth.users LIMIT 1)
) ON CONFLICT (parking_location_id, spot_number) DO NOTHING;

-- 11. Verifică că inserarea a reușit
SELECT * FROM parking_spots WHERE spot_number = 'TEST_STRUCTURE_001';

-- 12. Curăță datele de test
DELETE FROM parking_spots WHERE spot_number = 'TEST_STRUCTURE_001';

-- 13. Verifică că curățarea a reușit
SELECT COUNT(*) as remaining_test_spots 
FROM parking_spots 
WHERE spot_number = 'TEST_STRUCTURE_001'; 