-- Script de test pentru funcțiile RPC
-- Rulează acest script în Supabase SQL Editor pentru a verifica funcțiile

-- 1. Verifică dacă funcțiile RPC există
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'report_free_parking_spot',
  'update_parking_spot_status', 
  'get_parking_location_stats'
);

-- 2. Verifică dacă tabelele există
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'parking_spots',
  'parking_spot_status_history',
  'parking_locations'
);

-- 3. Verifică dacă view-ul există
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'parking_locations_with_stats';

-- 4. Testează funcția report_free_parking_spot cu un ID valid
-- Înlocuiește UUID-ul cu unul valid din parking_locations
SELECT report_free_parking_spot(
  (SELECT id FROM parking_locations LIMIT 1),
  'TEST1',
  (SELECT id FROM auth.users LIMIT 1),
  'Test function call'
);

-- 5. Verifică datele din tabele
SELECT COUNT(*) as total_parking_locations FROM parking_locations;
SELECT COUNT(*) as total_parking_spots FROM parking_spots;
SELECT COUNT(*) as total_history FROM parking_spot_status_history;

-- 6. Testează view-ul
SELECT * FROM parking_locations_with_stats LIMIT 3;

-- 7. Verifică permisiunile
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_name IN (
  'parking_spots',
  'parking_spot_status_history',
  'parking_locations'
) AND grantee IN ('authenticated', 'anon'); 