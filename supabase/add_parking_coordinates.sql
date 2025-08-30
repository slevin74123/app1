-- Adaugă coordonatele reale pentru parcările din București
-- Acest fișier trebuie rulat după ce parking_schema.sql a fost executat

-- Actualizează coordonatele pentru parcările existente
UPDATE public.parking_locations 
SET 
  latitude = 44.4268,
  longitude = 26.1025
WHERE name = 'Parcare Centru Comercial';

UPDATE public.parking_locations 
SET 
  latitude = 44.4268,
  longitude = 26.1025
WHERE name = 'Parcare Piața Unirii';

UPDATE public.parking_locations 
SET 
  latitude = 44.4479,
  longitude = 26.0847
WHERE name = 'Parcare Gara de Nord';

UPDATE public.parking_locations 
SET 
  latitude = 44.4358,
  longitude = 26.1038
WHERE name = 'Parcare Universitate';

UPDATE public.parking_locations 
SET 
  latitude = 44.5017,
  longitude = 26.0772
WHERE name = 'Parcare Mall Băneasa';

UPDATE public.parking_locations 
SET 
  latitude = 44.4789,
  longitude = 26.0823
WHERE name = 'Parcare Herăstrău';

UPDATE public.parking_locations 
SET 
  latitude = 44.4089,
  longitude = 26.1189
WHERE name = 'Parcare Tineretului';

UPDATE public.parking_locations 
SET 
  latitude = 44.4089,
  longitude = 26.1189
WHERE name = 'Parcare Titan';

UPDATE public.parking_locations 
SET 
  latitude = 44.4789,
  longitude = 26.0823
WHERE name = 'Parcare Militari';

UPDATE public.parking_locations 
SET 
  latitude = 44.4089,
  longitude = 26.1189
WHERE name = 'Parcare Drumul Taberei';

-- Verifică actualizările
SELECT 
  name,
  address,
  city,
  district,
  latitude,
  longitude,
  parking_type,
  total_spots,
  available_spots,
  price_per_hour
FROM public.parking_locations
ORDER BY name; 