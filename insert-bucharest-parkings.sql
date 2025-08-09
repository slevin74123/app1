-- Script pentru inserarea parcărilor din București în baza de date
-- Rulează aceste interogări în Supabase SQL Editor

-- 1. PIAȚA VICTORIEI
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Piața Victoriei', 'Piața Victoriei, Sector 1', 4.2, 45, true, false, true, true, 8.0, 0.1, 2, 44.4268, 26.1025, 'admin-user', NOW(), NOW()),
('Parcare Guvern', 'Strada Izvor, Sector 1', 4.5, 32, true, true, true, true, 10.0, 0.2, 3, 44.4270, 26.1020, 'admin-user', NOW(), NOW()),
('Parcare Parlament', 'Calea 13 Septembrie, Sector 5', 4.0, 28, true, false, true, true, 8.0, 0.3, 4, 44.4275, 26.1030, 'admin-user', NOW(), NOW());

-- 2. PIAȚA UNIRII
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Unirea Shopping Center', 'Piața Unirii, Sector 3', 4.3, 67, true, true, true, true, 6.0, 0.1, 2, 44.4260, 26.1030, 'admin-user', NOW(), NOW()),
('Parcare Vitan Mall', 'Șoseaua Chitilei, Sector 3', 4.1, 89, true, true, true, true, 5.0, 0.4, 5, 44.4250, 26.1040, 'admin-user', NOW(), NOW()),
('Parcare Piața Unirii', 'Piața Unirii, Sector 3', 3.8, 56, true, false, false, true, 4.0, 0.1, 2, 44.4265, 26.1035, 'admin-user', NOW(), NOW());

-- 3. CENTRUL VECHI
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Centrul Vechi', 'Strada Lipscani, Sector 3', 4.4, 78, true, false, true, true, 7.0, 0.2, 3, 44.4300, 26.1000, 'admin-user', NOW(), NOW()),
('Parcare Hanul cu Tei', 'Strada Gabroveni, Sector 3', 4.0, 34, true, false, false, true, 6.0, 0.3, 4, 44.4305, 26.1005, 'admin-user', NOW(), NOW()),
('Parcare Cărturești Carusel', 'Strada Lipscani, Sector 3', 4.2, 92, true, false, true, true, 8.0, 0.2, 3, 44.4302, 26.1002, 'admin-user', NOW(), NOW());

-- 4. BERCENI
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Berceni', 'Strada Berceni, Sector 4', 3.9, 23, true, false, false, true, 3.0, 0.5, 6, 44.3833, 26.1167, 'admin-user', NOW(), NOW()),
('Parcare Parcul Tineretului', 'Strada Olteniței, Sector 4', 4.1, 41, true, false, false, true, 4.0, 0.6, 7, 44.3840, 26.1170, 'admin-user', NOW(), NOW()),
('Parcare Berceni Shopping', 'Strada Berceni, Sector 4', 4.0, 38, true, true, true, true, 5.0, 0.4, 5, 44.3835, 26.1165, 'admin-user', NOW(), NOW());

-- 5. DRUMUL TABEREI
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Drumul Taberei', 'Strada Drumul Taberei, Sector 6', 3.8, 29, true, false, false, true, 3.0, 0.7, 8, 44.4167, 25.9667, 'admin-user', NOW(), NOW()),
('Parcare Parcul Drumul Taberei', 'Strada Drumul Taberei, Sector 6', 4.0, 35, true, false, false, true, 4.0, 0.8, 9, 44.4170, 25.9670, 'admin-user', NOW(), NOW()),
('Parcare Plaza Romania', 'Strada Drumul Taberei, Sector 6', 4.2, 73, true, true, true, true, 5.0, 0.6, 7, 44.4165, 25.9665, 'admin-user', NOW(), NOW());

-- 6. BĂNEASA
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Băneasa', 'Strada Băneasa, Sector 1', 4.3, 31, true, false, true, true, 6.0, 0.9, 10, 44.5167, 26.0833, 'admin-user', NOW(), NOW()),
('Parcare Parcul Băneasa', 'Strada Băneasa, Sector 1', 4.1, 27, true, false, false, true, 5.0, 1.0, 11, 44.5170, 26.0835, 'admin-user', NOW(), NOW()),
('Parcare Băneasa Shopping City', 'Strada Băneasa, Sector 1', 4.4, 82, true, true, true, true, 6.0, 0.8, 9, 44.5165, 26.0830, 'admin-user', NOW(), NOW());

-- 7. PANTELIMON
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Pantelimon', 'Strada Pantelimon, Sector 2', 3.7, 19, true, false, false, true, 3.0, 1.1, 12, 44.4500, 26.2000, 'admin-user', NOW(), NOW()),
('Parcare Parcul Pantelimon', 'Strada Pantelimon, Sector 2', 3.9, 25, true, false, false, true, 4.0, 1.2, 13, 44.4505, 26.2005, 'admin-user', NOW(), NOW()),
('Parcare Pantelimon Shopping', 'Strada Pantelimon, Sector 2', 4.0, 44, true, true, true, true, 5.0, 1.0, 11, 44.4495, 26.1995, 'admin-user', NOW(), NOW());

-- 8. COTROCENI
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Palatul Cotroceni', 'Strada Geniului, Sector 6', 4.5, 15, true, true, true, true, 8.0, 0.4, 5, 44.4333, 26.0667, 'admin-user', NOW(), NOW()),
('Parcare Universitatea Politehnica', 'Splaiul Independenței, Sector 6', 4.2, 67, true, false, true, true, 6.0, 0.5, 6, 44.4335, 26.0665, 'admin-user', NOW(), NOW()),
('Parcare Parcul Cotroceni', 'Strada Geniului, Sector 6', 4.1, 38, true, false, false, true, 5.0, 0.6, 7, 44.4330, 26.0670, 'admin-user', NOW(), NOW());

-- 9. PRIMĂVERII
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Primăverii', 'Strada Primăverii, Sector 1', 4.6, 12, true, true, true, true, 10.0, 0.8, 9, 44.4667, 26.0833, 'admin-user', NOW(), NOW()),
('Parcare Parcul Primăverii', 'Strada Primăverii, Sector 1', 4.3, 18, true, false, false, true, 8.0, 0.9, 10, 44.4670, 26.0835, 'admin-user', NOW(), NOW()),
('Parcare Ambasada SUA', 'Strada Tudor Arghezi, Sector 1', 4.4, 8, true, true, true, true, 9.0, 0.7, 8, 44.4665, 26.0830, 'admin-user', NOW(), NOW());

-- 10. TITAN
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Titan', 'Strada Titan, Sector 3', 3.9, 33, true, false, false, true, 4.0, 0.9, 10, 44.4500, 26.1500, 'admin-user', NOW(), NOW()),
('Parcare Parcul Titan', 'Strada Titan, Sector 3', 4.1, 47, true, false, false, true, 5.0, 1.0, 11, 44.4505, 26.1505, 'admin-user', NOW(), NOW()),
('Parcare Titan Shopping', 'Strada Titan, Sector 3', 4.0, 58, true, true, true, true, 5.0, 0.8, 9, 44.4495, 26.1495, 'admin-user', NOW(), NOW());

-- 11. MILITARI
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Militari', 'Strada Militari, Sector 6', 3.8, 26, true, false, false, true, 3.0, 1.2, 13, 44.4333, 25.9500, 'admin-user', NOW(), NOW()),
('Parcare Parcul Militari', 'Strada Militari, Sector 6', 4.0, 32, true, false, false, true, 4.0, 1.3, 14, 44.4335, 25.9505, 'admin-user', NOW(), NOW()),
('Parcare Militari Shopping', 'Strada Militari, Sector 6', 4.1, 61, true, true, true, true, 5.0, 1.1, 12, 44.4330, 25.9495, 'admin-user', NOW(), NOW());

-- 12. COLENTINA
INSERT INTO parcari_raportate (nume, adresa, rating, numar_recenzii, disponibilitate, garaj, acoperit, securitate, pret_pe_ora, distanta_km, timp_mers_minute, lat, lng, user_id, created_at, updated_at) VALUES
('Parcare Colentina', 'Strada Colentina, Sector 2', 3.7, 21, true, false, false, true, 3.0, 1.4, 15, 44.4667, 26.1333, 'admin-user', NOW(), NOW()),
('Parcare Parcul Colentina', 'Strada Colentina, Sector 2', 3.9, 28, true, false, false, true, 4.0, 1.5, 16, 44.4670, 26.1335, 'admin-user', NOW(), NOW()),
('Parcare Colentina Shopping', 'Strada Colentina, Sector 2', 4.0, 49, true, true, true, true, 5.0, 1.3, 14, 44.4665, 26.1330, 'admin-user', NOW(), NOW());

-- Verificare inserări
SELECT 
    COUNT(*) as total_parcari,
    AVG(rating) as rating_mediu,
    AVG(pret_pe_ora) as pret_mediu,
    MIN(pret_pe_ora) as pret_minim,
    MAX(pret_pe_ora) as pret_maxim
FROM parcari_raportate 
WHERE nume LIKE '%Parcare%';

-- Afișare parcări organizate pe zone (exemplu pentru primele 5)
SELECT 
    CASE 
        WHEN nume LIKE '%Victoriei%' OR nume LIKE '%Guvern%' OR nume LIKE '%Parlament%' THEN 'Piața Victoriei'
        WHEN nume LIKE '%Unirii%' OR nume LIKE '%Vitan%' THEN 'Piața Unirii'
        WHEN nume LIKE '%Centrul Vechi%' OR nume LIKE '%Lipscani%' OR nume LIKE '%Hanul%' OR nume LIKE '%Cărturești%' THEN 'Centrul Vechi'
        WHEN nume LIKE '%Berceni%' OR nume LIKE '%Tineretului%' THEN 'Berceni'
        WHEN nume LIKE '%Drumul Taberei%' OR nume LIKE '%Plaza Romania%' THEN 'Drumul Taberei'
        ELSE 'Alte zone'
    END as zona,
    nume,
    adresa,
    rating,
    pret_pe_ora,
    disponibilitate
FROM parcari_raportate 
WHERE nume LIKE '%Parcare%'
ORDER BY zona, rating DESC; 