-- Script pentru resetarea statusului locurilor de parcare
-- Acest script actualizează toate locurile de parcare cu statusuri realiste

-- 1. Actualizează toate locurile de parcare cu statusuri realiste
UPDATE public.parking_locations 
SET 
  available_spots = CASE 
    -- Parcări mari (mall-uri, gări) - mai multe locuri disponibile
    WHEN total_spots >= 200 THEN FLOOR(total_spots * 0.6 + (RANDOM() * 0.2 * total_spots))
    -- Parcări medii - status mixt
    WHEN total_spots >= 100 THEN FLOOR(total_spots * 0.5 + (RANDOM() * 0.3 * total_spots))
    -- Parcări mici - mai puține locuri disponibile
    ELSE FLOOR(total_spots * 0.4 + (RANDOM() * 0.3 * total_spots))
  END,
  
  reserved_spots = CASE 
    -- Parcări mari - mai multe rezervări
    WHEN total_spots >= 200 THEN FLOOR(total_spots * 0.1 + (RANDOM() * 0.1 * total_spots))
    -- Parcări medii - rezervări moderate
    WHEN total_spots >= 100 THEN FLOOR(total_spots * 0.15 + (RANDOM() * 0.1 * total_spots))
    -- Parcări mici - puține rezervări
    ELSE FLOOR(total_spots * 0.2 + (RANDOM() * 0.1 * total_spots))
  END,
  
  occupied_spots = CASE 
    -- Parcări mari - mai multe locuri ocupate
    WHEN total_spots >= 200 THEN FLOOR(total_spots * 0.25 + (RANDOM() * 0.15 * total_spots))
    -- Parcări medii - ocupare moderată
    WHEN total_spots >= 100 THEN FLOOR(total_spots * 0.3 + (RANDOM() * 0.2 * total_spots))
    -- Parcări mici - ocupare mare
    ELSE FLOOR(total_spots * 0.35 + (RANDOM() * 0.2 * total_spots))
  END,
  
  updated_at = NOW()
WHERE total_spots > 0;

-- 2. Asigură-te că suma locurilor nu depășește totalul
UPDATE public.parking_locations 
SET 
  available_spots = GREATEST(0, total_spots - reserved_spots - occupied_spots),
  updated_at = NOW()
WHERE (available_spots + reserved_spots + occupied_spots) > total_spots;

-- 3. Verifică și corectează cazurile extreme
UPDATE public.parking_locations 
SET 
  available_spots = GREATEST(1, available_spots),
  reserved_spots = GREATEST(0, LEAST(reserved_spots, total_spots - 1)),
  occupied_spots = GREATEST(0, LEAST(occupied_spots, total_spots - available_spots - reserved_spots)),
  updated_at = NOW()
WHERE available_spots < 1 OR (available_spots + reserved_spots + occupied_spots) > total_spots;

-- 4. Afișează rezultatul pentru verificare
SELECT 
  name,
  address,
  total_spots,
  available_spots,
  reserved_spots,
  occupied_spots,
  (available_spots + reserved_spots + occupied_spots) as total_calculated,
  CASE 
    WHEN (available_spots + reserved_spots + occupied_spots) = total_spots THEN '✅ Corect'
    ELSE '❌ Eroare'
  END as status
FROM public.parking_locations 
ORDER BY total_spots DESC;

-- 5. Afișează statistici generale
SELECT 
  COUNT(*) as total_parking_locations,
  SUM(total_spots) as total_spots_available,
  SUM(available_spots) as total_available_spots,
  SUM(reserved_spots) as total_reserved_spots,
  SUM(occupied_spots) as total_occupied_spots,
  ROUND(AVG(available_spots::numeric / total_spots * 100), 2) as avg_availability_percent
FROM public.parking_locations; 