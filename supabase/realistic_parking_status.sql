-- Resetare cu statusuri realiste pentru locurile de parcare
-- Simulează situații reale: unele locuri ocupate, altele rezervate

-- 1. Resetare cu statusuri realiste
UPDATE public.parking_locations 
SET 
  available_spots = FLOOR(total_spots * (0.6 + (RANDOM() * 0.3))), -- 60-90% disponibile
  reserved_spots = FLOOR(total_spots * (0.05 + (RANDOM() * 0.1))), -- 5-15% rezervate
  occupied_spots = FLOOR(total_spots * (0.05 + (RANDOM() * 0.15))), -- 5-20% ocupate
  updated_at = NOW();

-- 2. Corectare pentru a asigura că suma nu depășește totalul
UPDATE public.parking_locations 
SET 
  available_spots = GREATEST(1, total_spots - reserved_spots - occupied_spots),
  updated_at = NOW()
WHERE (available_spots + reserved_spots + occupied_spots) > total_spots;

-- 3. Verificare rezultat
SELECT 
  name,
  total_spots,
  available_spots,
  reserved_spots,
  occupied_spots,
  (available_spots + reserved_spots + occupied_spots) as calculated_total,
  ROUND((available_spots::numeric / total_spots * 100), 1) as availability_percent
FROM public.parking_locations 
ORDER BY availability_percent DESC;

-- 4. Statistici generale
SELECT 
  'Status Realist' as action,
  COUNT(*) as total_locations,
  SUM(total_spots) as total_spots,
  SUM(available_spots) as available_spots,
  SUM(reserved_spots) as reserved_spots,
  SUM(occupied_spots) as occupied_spots,
  ROUND(AVG(available_spots::numeric / total_spots * 100), 1) as avg_availability_percent
FROM public.parking_locations; 