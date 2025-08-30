-- Script de test pentru fallback-ul direct (fără RPC)
-- Rulează acest script în Supabase SQL Editor pentru a verifica că tabelele funcționează

-- 1. Verifică că tabelele există și au date
SELECT 'parking_locations' as table_name, COUNT(*) as count FROM parking_locations
UNION ALL
SELECT 'parking_spots' as table_name, COUNT(*) as count FROM parking_spots
UNION ALL
SELECT 'parking_spot_status_history' as table_name, COUNT(*) as count FROM parking_spot_status_history;

-- 2. Verifică că există utilizatori autentificați
SELECT COUNT(*) as authenticated_users FROM auth.users;

-- 3. Testează inserarea directă în parking_spots
-- Înlocuiește UUID-urile cu valori valide din baza ta de date
INSERT INTO parking_spots (
  parking_location_id, 
  spot_number, 
  status, 
  last_reported_by
) VALUES (
  (SELECT id FROM parking_locations LIMIT 1),
  'TEST_FALLBACK',
  'available',
  (SELECT id FROM auth.users LIMIT 1)
) ON CONFLICT (parking_location_id, spot_number) DO NOTHING;

-- 4. Verifică că inserarea a reușit
SELECT * FROM parking_spots WHERE spot_number = 'TEST_FALLBACK';

-- 5. Testează actualizarea directă
UPDATE parking_spots 
SET status = 'occupied', 
    last_status_change = NOW(),
    updated_at = NOW()
WHERE spot_number = 'TEST_FALLBACK';

-- 6. Verifică actualizarea
SELECT * FROM parking_spots WHERE spot_number = 'TEST_FALLBACK';

-- 7. Testează inserarea în istoric
INSERT INTO parking_spot_status_history (
  parking_spot_id,
  user_id,
  old_status,
  new_status,
  change_reason,
  notes
) VALUES (
  (SELECT id FROM parking_spots WHERE spot_number = 'TEST_FALLBACK'),
  (SELECT id FROM auth.users LIMIT 1),
  'available',
  'occupied',
  'test_fallback',
  'Test pentru verificarea fallback-ului'
);

-- 8. Verifică istoricul
SELECT * FROM parking_spot_status_history 
WHERE parking_spot_id = (SELECT id FROM parking_spots WHERE spot_number = 'TEST_FALLBACK');

-- 9. Curăță datele de test
DELETE FROM parking_spot_status_history 
WHERE parking_spot_id = (SELECT id FROM parking_spots WHERE spot_number = 'TEST_FALLBACK');

DELETE FROM parking_spots WHERE spot_number = 'TEST_FALLBACK';

-- 10. Verifică că curățarea a reușit
SELECT 'After cleanup - parking_spots' as table_name, COUNT(*) as count FROM parking_spots WHERE spot_number = 'TEST_FALLBACK'
UNION ALL
SELECT 'After cleanup - history' as table_name, COUNT(*) as count FROM parking_spot_status_history 
WHERE parking_spot_id = (SELECT id FROM parking_spots WHERE spot_number = 'TEST_FALLBACK'); 