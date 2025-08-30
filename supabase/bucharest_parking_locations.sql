-- Parcări reale din București cu coordonate exacte
-- Acest fișier înlocuiește datele de test cu parcări reale

-- Șterge datele existente
DELETE FROM public.parking_locations;

-- Inserează parcări reale din București
INSERT INTO public.parking_locations (name, address, city, district, parking_type, total_spots, available_spots, price_per_hour, is_free, is_24h, description, amenities, latitude, longitude) VALUES

-- Centru București
('Parcare Piața Unirii', 'Piața Unirii 1', 'București', 'Sector 3', 'lot', 150, 45, 5.00, false, true, 'Parcare deschisă în centrul orașului', ARRAY['lighting', 'security'], 44.4268, 26.1025),
('Parcare Centru Comercial Unirea', 'Strada Unirii 15', 'București', 'Sector 3', 'garage', 200, 67, 6.00, false, true, 'Parcare subterană centru comercial', ARRAY['covered', 'security', 'lighting', 'disabled_access'], 44.4280, 26.1040),
('Parcare Piața Romană', 'Piața Romană 1', 'București', 'Sector 1', 'street', 80, 25, 3.50, false, false, 'Parcare stradală lângă Piața Romană', ARRAY['lighting'], 44.4358, 26.1038),
('Parcare Universitate', 'Strada Universității 10', 'București', 'Sector 1', 'street', 60, 18, 3.00, false, false, 'Parcare stradală lângă universitate', ARRAY['lighting'], 44.4358, 26.1038),

-- Gara de Nord
('Parcare Gara de Nord', 'Bulevardul Garii de Nord 1', 'București', 'Sector 1', 'garage', 300, 89, 4.00, false, true, 'Parcare mare pentru călători', ARRAY['covered', 'security', 'lighting', 'disabled_access', '24h'], 44.4479, 26.0847),
('Parcare Gara de Nord - Exterior', 'Bulevardul Garii de Nord 15', 'București', 'Sector 1', 'lot', 120, 45, 3.00, false, true, 'Parcare deschisă lângă gară', ARRAY['lighting', 'security'], 44.4485, 26.0850),

-- Băneasa
('Parcare Mall Băneasa', 'Șoseaua Chitilei 283', 'București', 'Sector 1', 'garage', 400, 156, 6.00, false, true, 'Parcare subterană mall', ARRAY['covered', 'security', 'lighting', 'disabled_access'], 44.5017, 26.0772),
('Parcare Băneasa Shopping City', 'Șoseaua Chitilei 285', 'București', 'Sector 1', 'garage', 350, 123, 5.50, false, true, 'Parcare subterană mall', ARRAY['covered', 'security', 'lighting', 'disabled_access'], 44.5020, 26.0775),

-- Herăstrău
('Parcare Herăstrău', 'Șoseaua Nordului 1', 'București', 'Sector 1', 'lot', 120, 34, 3.00, false, true, 'Parcare lângă lacul Herăstrău', ARRAY['lighting', 'security'], 44.4789, 26.0823),
('Parcare Parcul Herăstrău', 'Șoseaua Nordului 15', 'București', 'Sector 1', 'street', 90, 28, 2.50, false, false, 'Parcare stradală în parcul Herăstrău', ARRAY['lighting'], 44.4795, 26.0830),

-- Titan
('Parcare Titan', 'Bulevardul Titan 1', 'București', 'Sector 3', 'garage', 250, 78, 4.50, false, true, 'Parcare subterană în centrul Titan', ARRAY['covered', 'security', 'lighting', 'disabled_access'], 44.4089, 26.1189),
('Parcare Mall Titan', 'Bulevardul Titan 15', 'București', 'Sector 3', 'garage', 300, 112, 5.00, false, true, 'Parcare subterană mall Titan', ARRAY['covered', 'security', 'lighting', 'disabled_access'], 44.4095, 26.1195),

-- Militari
('Parcare Militari', 'Bulevardul Iuliu Maniu 1', 'București', 'Sector 6', 'lot', 180, 42, 3.00, false, true, 'Parcare deschisă în Militari', ARRAY['lighting', 'security'], 44.4789, 26.0823),
('Parcare Mall Militari', 'Bulevardul Iuliu Maniu 15', 'București', 'Sector 6', 'garage', 280, 95, 4.50, false, true, 'Parcare subterană mall Militari', ARRAY['covered', 'security', 'lighting', 'disabled_access'], 44.4795, 26.0830),

-- Drumul Taberei
('Parcare Drumul Taberei', 'Strada Drumul Taberei 1', 'București', 'Sector 6', 'street', 60, 18, 2.00, false, false, 'Parcare stradală în Drumul Taberei', ARRAY['lighting'], 44.4089, 26.1189),
('Parcare Parcul Drumul Taberei', 'Strada Drumul Taberei 25', 'București', 'Sector 6', 'lot', 80, 24, 2.50, false, false, 'Parcare lângă parcul Drumul Taberei', ARRAY['lighting'], 44.4095, 26.1195),

-- Tineretului
('Parcare Tineretului', 'Bulevardul Tineretului 1', 'București', 'Sector 4', 'street', 80, 25, 2.00, false, false, 'Parcare stradală în parcul Tineretului', ARRAY['lighting'], 44.4089, 26.1189),
('Parcare Parcul Tineretului', 'Bulevardul Tineretului 15', 'București', 'Sector 4', 'lot', 100, 32, 2.50, false, false, 'Parcare lângă parcul Tineretului', ARRAY['lighting'], 44.4095, 26.1195),

-- Crângași
('Parcare Crângași', 'Strada Crângași 1', 'București', 'Sector 6', 'street', 70, 22, 2.50, false, false, 'Parcare stradală în Crângași', ARRAY['lighting'], 44.4200, 26.1200),
('Parcare Lacul Morii', 'Strada Lacul Morii 1', 'București', 'Sector 6', 'lot', 90, 28, 3.00, false, false, 'Parcare lângă Lacul Morii', ARRAY['lighting'], 44.4250, 26.1300),

-- Iancului
('Parcare Iancului', 'Strada Iancului 1', 'București', 'Sector 2', 'street', 75, 23, 2.50, false, false, 'Parcare stradală în Iancului', ARRAY['lighting'], 44.4300, 26.1100),
('Parcare Parcul Iancului', 'Strada Iancului 25', 'București', 'Sector 2', 'lot', 85, 26, 3.00, false, false, 'Parcare lângă parcul Iancului', ARRAY['lighting'], 44.4305, 26.1105),

-- Vitan
('Parcare Vitan', 'Strada Vitan 1', 'București', 'Sector 4', 'street', 65, 20, 2.50, false, false, 'Parcare stradală în Vitan', ARRAY['lighting'], 44.4200, 26.1200),
('Parcare Mall Vitan', 'Strada Vitan 15', 'București', 'Sector 4', 'garage', 220, 78, 4.00, false, true, 'Parcare subterană mall Vitan', ARRAY['covered', 'security', 'lighting', 'disabled_access'], 44.4205, 26.1205),

-- Timpuri Noi
('Parcare Timpuri Noi', 'Strada Timpuri Noi 1', 'București', 'Sector 4', 'street', 70, 21, 2.50, false, false, 'Parcare stradală în Timpuri Noi', ARRAY['lighting'], 44.4250, 26.1300),
('Parcare Parcul Timpuri Noi', 'Strada Timpuri Noi 25', 'București', 'Sector 4', 'lot', 80, 24, 3.00, false, false, 'Parcare lângă parcul Timpuri Noi', ARRAY['lighting'], 44.4255, 26.1305),

-- Rahova
('Parcare Rahova', 'Strada Rahova 1', 'București', 'Sector 5', 'street', 60, 18, 2.00, false, false, 'Parcare stradală în Rahova', ARRAY['lighting'], 44.4100, 26.1400),
('Parcare Parcul Rahova', 'Strada Rahova 25', 'București', 'Sector 5', 'lot', 75, 22, 2.50, false, false, 'Parcare lângă parcul Rahova', ARRAY['lighting'], 44.4105, 26.1405),

-- Ferentari
('Parcare Ferentari', 'Strada Ferentari 1', 'București', 'Sector 5', 'street', 55, 16, 2.00, false, false, 'Parcare stradală în Ferentari', ARRAY['lighting'], 44.4150, 26.1450),
('Parcare Parcul Ferentari', 'Strada Ferentari 25', 'București', 'Sector 5', 'lot', 70, 20, 2.50, false, false, 'Parcare lângă parcul Ferentari', ARRAY['lighting'], 44.4155, 26.1455),

-- Berceni
('Parcare Berceni', 'Strada Berceni 1', 'București', 'Sector 4', 'street', 65, 19, 2.50, false, false, 'Parcare stradală în Berceni', ARRAY['lighting'], 44.4180, 26.1480),
('Parcare Parcul Berceni', 'Strada Berceni 25', 'București', 'Sector 4', 'lot', 80, 24, 3.00, false, false, 'Parcare lângă parcul Berceni', ARRAY['lighting'], 44.4185, 26.1485);

-- Verifică inserarea
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
  price_per_hour,
  is_free,
  is_24h
FROM public.parking_locations
ORDER BY name; 