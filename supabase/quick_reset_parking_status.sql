-- Resetare rapidă a statusului locurilor de parcare
-- Script simplu pentru actualizarea statusului

-- 1. Resetare completă - toate locurile disponibile
UPDATE public.parking_locations 
SET 
  available_spots = total_spots,
  reserved_spots = 0,
  occupied_spots = 0,
  updated_at = NOW();

-- 2. Verificare rezultat
SELECT 
  name,
  total_spots,
  available_spots,
  reserved_spots,
  occupied_spots
FROM public.parking_locations 
ORDER BY name;

-- 3. Statistici
SELECT 
  'Status Resetat' as action,
  COUNT(*) as total_locations,
  SUM(total_spots) as total_spots,
  SUM(available_spots) as available_spots,
  SUM(reserved_spots) as reserved_spots,
  SUM(occupied_spots) as occupied_spots
FROM public.parking_locations; 