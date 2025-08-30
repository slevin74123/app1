-- Script de test pentru inserarea în parking_spots
-- Rulează acest script în Supabase SQL Editor pentru a verifica că inserarea funcționează

-- 1. Verifică structura tabelei parking_spots
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'parking_spots' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verifică că există date în parking_locations
SELECT COUNT(*) as total_locations FROM parking_locations;
SELECT id, name FROM parking_locations LIMIT 3;

-- 3. Verifică că există utilizatori autentificați
SELECT COUNT(*) as total_users FROM auth.users;
SELECT id FROM auth.users LIMIT 1;

-- 4. Testează inserarea cu toate câmpurile necesare
INSERT INTO parking_spots (
  parking_location_id,
  spot_number,
  status,
  last_reported_by,
  last_status_change,
  is_premium
) VALUES (
  (SELECT id FROM parking_locations LIMIT 1),
  'TEST_INSERT_001',
  'available',
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  false
) ON CONFLICT (parking_location_id, spot_number) DO NOTHING;

-- 5. Verifică că inserarea a reușit
SELECT * FROM parking_spots WHERE spot_number = 'TEST_INSERT_001';

-- 6. Testează inserarea cu câmpurile minime (folosind default values)
INSERT INTO parking_spots (
  parking_location_id,
  spot_number,
  status,
  last_reported_by
) VALUES (
  (SELECT id FROM parking_locations LIMIT 1),
  'TEST_INSERT_002',
  'available',
  (SELECT id FROM auth.users LIMIT 1)
) ON CONFLICT (parking_location_id, spot_number) DO NOTHING;

-- 7. Verifică că a doua inserare a reușit
SELECT * FROM parking_spots WHERE spot_number = 'TEST_INSERT_002';

-- 8. Testează inserarea în istoric
INSERT INTO parking_spot_status_history (
  parking_spot_id,
  user_id,
  old_status,
  new_status,
  change_reason,
  notes
) VALUES (
  (SELECT id FROM parking_spots WHERE spot_number = 'TEST_INSERT_001'),
  (SELECT id FROM auth.users LIMIT 1),
  'unknown',
  'available',
  'test_insert',
  'Test pentru verificarea inserării'
);

-- 9. Verifică istoricul
SELECT * FROM parking_spot_status_history 
WHERE parking_spot_id = (SELECT id FROM parking_spots WHERE spot_number = 'TEST_INSERT_001');

-- 10. Curăță datele de test
DELETE FROM parking_spot_status_history 
WHERE parking_spot_id IN (
  SELECT id FROM parking_spots 
  WHERE spot_number IN ('TEST_INSERT_001', 'TEST_INSERT_002')
);

DELETE FROM parking_spots 
WHERE spot_number IN ('TEST_INSERT_001', 'TEST_INSERT_002');

-- 11. Verifică că curățarea a reușit
SELECT 'After cleanup - parking_spots' as table_name, COUNT(*) as count 
FROM parking_spots 
WHERE spot_number IN ('TEST_INSERT_001', 'TEST_INSERT_002')

UNION ALL

SELECT 'After cleanup - history' as table_name, COUNT(*) as count 
FROM parking_spot_status_history 
WHERE parking_spot_id IN (
  SELECT id FROM parking_spots 
  WHERE spot_number IN ('TEST_INSERT_001', 'TEST_INSERT_002')
); 