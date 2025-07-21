-- SEED DATA pentru Supabase Parking App
-- Șterge datele existente
TRUNCATE TABLE problems_reports CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE favorites CASCADE;
TRUNCATE TABLE chat_messages CASCADE;
TRUNCATE TABLE community_updates CASCADE;
TRUNCATE TABLE reservations CASCADE;
TRUNCATE TABLE parking_spots CASCADE;
TRUNCATE TABLE user_profiles CASCADE;

-- 1. user_profiles
INSERT INTO user_profiles (id, full_name, email, avatar_url, created_at)
VALUES
  ('user-1', 'Andrei Popescu', 'andrei.popescu@email.com', 'https://randomuser.me/api/portraits/men/1.jpg', NOW()),
  ('user-2', 'Maria Ionescu', 'maria.ionescu@email.com', 'https://randomuser.me/api/portraits/women/2.jpg', NOW()),
  ('user-3', 'Alex Dumitru', 'alex.dumitru@email.com', 'https://randomuser.me/api/portraits/men/3.jpg', NOW()),
  ('user-4', 'Ioana Georgescu', 'ioana.georgescu@email.com', 'https://randomuser.me/api/portraits/women/4.jpg', NOW()),
  ('user-5', 'Vlad Stan', 'vlad.stan@email.com', 'https://randomuser.me/api/portraits/men/5.jpg', NOW()),
  ('user-6', 'Elena Radu', 'elena.radu@email.com', 'https://randomuser.me/api/portraits/women/6.jpg', NOW()),
  ('user-7', 'Cristian Matei', 'cristian.matei@email.com', 'https://randomuser.me/api/portraits/men/7.jpg', NOW()),
  ('user-8', 'Ana Marinescu', 'ana.marinescu@email.com', 'https://randomuser.me/api/portraits/women/8.jpg', NOW()),
  ('user-9', 'George Ilie', 'george.ilie@email.com', 'https://randomuser.me/api/portraits/men/9.jpg', NOW()),
  ('user-10', 'Diana Pavel', 'diana.pavel@email.com', 'https://randomuser.me/api/portraits/women/10.jpg', NOW());

-- 2. parking_spots (distribuite pe hartă, 25 locuri)
INSERT INTO parking_spots (id, name, address, latitude, longitude, is_available, created_at)
VALUES
  ('b1a2c3d4-0001-4000-8000-000000000001', 'Spot 1', 'Strada Exemplu 1, București', 44.4268, 26.1025, TRUE, NOW()),
  ('b1a2c3d4-0002-4000-8000-000000000002', 'Spot 2', 'Strada Exemplu 2, București', 44.4270, 26.1030, TRUE, NOW()),
  ('b1a2c3d4-0003-4000-8000-000000000003', 'Spot 3', 'Strada Exemplu 3, București', 44.4272, 26.1040, FALSE, NOW()),
  ('b1a2c3d4-0004-4000-8000-000000000004', 'Spot 4', 'Strada Exemplu 4, București', 44.4265, 26.1050, TRUE, NOW()),
  ('b1a2c3d4-0005-4000-8000-000000000005', 'Spot 5', 'Strada Exemplu 5, București', 44.4260, 26.1060, TRUE, NOW()),
  ('b1a2c3d4-0006-4000-8000-000000000006', 'Spot 6', 'Strada Exemplu 6, București', 44.4255, 26.1070, FALSE, NOW()),
  ('b1a2c3d4-0007-4000-8000-000000000007', 'Spot 7', 'Strada Exemplu 7, București', 44.4250, 26.1080, TRUE, NOW()),
  ('b1a2c3d4-0008-4000-8000-000000000008', 'Spot 8', 'Strada Exemplu 8, București', 44.4245, 26.1090, TRUE, NOW()),
  ('b1a2c3d4-0009-4000-8000-000000000009', 'Spot 9', 'Strada Exemplu 9, București', 44.4240, 26.1100, TRUE, NOW()),
  ('b1a2c3d4-0010-4000-8000-000000000010', 'Spot 10', 'Strada Exemplu 10, București', 44.4235, 26.1110, FALSE, NOW()),
  ('b1a2c3d4-0011-4000-8000-000000000011', 'Spot 11', 'Strada Exemplu 11, București', 44.4230, 26.1120, TRUE, NOW()),
  ('b1a2c3d4-0012-4000-8000-000000000012', 'Spot 12', 'Strada Exemplu 12, București', 44.4225, 26.1130, TRUE, NOW()),
  ('b1a2c3d4-0013-4000-8000-000000000013', 'Spot 13', 'Strada Exemplu 13, București', 44.4220, 26.1140, TRUE, NOW()),
  ('b1a2c3d4-0014-4000-8000-000000000014', 'Spot 14', 'Strada Exemplu 14, București', 44.4215, 26.1150, TRUE, NOW()),
  ('b1a2c3d4-0015-4000-8000-000000000015', 'Spot 15', 'Strada Exemplu 15, București', 44.4210, 26.1160, FALSE, NOW()),
  ('b1a2c3d4-0016-4000-8000-000000000016', 'Spot 16', 'Strada Exemplu 16, București', 44.4205, 26.1170, TRUE, NOW()),
  ('b1a2c3d4-0017-4000-8000-000000000017', 'Spot 17', 'Strada Exemplu 17, București', 44.4200, 26.1180, TRUE, NOW()),
  ('b1a2c3d4-0018-4000-8000-000000000018', 'Spot 18', 'Strada Exemplu 18, București', 44.4195, 26.1190, TRUE, NOW()),
  ('b1a2c3d4-0019-4000-8000-000000000019', 'Spot 19', 'Strada Exemplu 19, București', 44.4190, 26.1200, TRUE, NOW()),
  ('b1a2c3d4-0020-4000-8000-000000000020', 'Spot 20', 'Strada Exemplu 20, București', 44.4185, 26.1210, FALSE, NOW()),
  ('b1a2c3d4-0021-4000-8000-000000000021', 'Spot 21', 'Strada Exemplu 21, București', 44.4180, 26.1220, TRUE, NOW()),
  ('b1a2c3d4-0022-4000-8000-000000000022', 'Spot 22', 'Strada Exemplu 22, București', 44.4175, 26.1230, TRUE, NOW()),
  ('b1a2c3d4-0023-4000-8000-000000000023', 'Spot 23', 'Strada Exemplu 23, București', 44.4170, 26.1240, TRUE, NOW()),
  ('b1a2c3d4-0024-4000-8000-000000000024', 'Spot 24', 'Strada Exemplu 24, București', 44.4165, 26.1250, TRUE, NOW()),
  ('b1a2c3d4-0025-4000-8000-000000000025', 'Spot 25', 'Strada Exemplu 25, București', 44.4160, 26.1260, TRUE, NOW());

-- 3. reservations (15 rezervări)
INSERT INTO reservations (id, user_id, spot_id, start_time, end_time, status, created_at)
VALUES
  (1, 'user-1', 3, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '2 hours', 'completed', NOW() - INTERVAL '2 days'),
  (2, 'user-2', 6, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days' + INTERVAL '1 hours', 'completed', NOW() - INTERVAL '1 days'),
  (3, 'user-3', 10, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hours', 'completed', NOW() - INTERVAL '3 hours'),
  (4, 'user-4', 15, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '3 hours', 'completed', NOW() - INTERVAL '5 hours'),
  (5, 'user-5', 20, NOW() - INTERVAL '1 hours', NOW() + INTERVAL '1 hours', 'active', NOW() - INTERVAL '1 hours'),
  (6, 'user-6', 2, NOW() + INTERVAL '2 hours', NOW() + INTERVAL '4 hours', 'upcoming', NOW()),
  (7, 'user-7', 5, NOW() + INTERVAL '3 hours', NOW() + INTERVAL '5 hours', 'upcoming', NOW()),
  (8, 'user-8', 8, NOW() - INTERVAL '10 hours', NOW() - INTERVAL '8 hours', 'completed', NOW() - INTERVAL '10 hours'),
  (9, 'user-9', 12, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '4 hours', 'completed', NOW() - INTERVAL '6 hours'),
  (10, 'user-10', 18, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '10 hours', 'completed', NOW() - INTERVAL '12 hours'),
  (11, 'user-1', 1, NOW() + INTERVAL '1 days', NOW() + INTERVAL '1 days' + INTERVAL '2 hours', 'upcoming', NOW()),
  (12, 'user-2', 4, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '1 hours', 'upcoming', NOW()),
  (13, 'user-3', 7, NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '1 hours', 'upcoming', NOW()),
  (14, 'user-4', 9, NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '2 hours', 'upcoming', NOW()),
  (15, 'user-5', 11, NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '2 hours', 'upcoming', NOW());

-- 4. community_updates (10 postări)
INSERT INTO community_updates (id, user_id, content, created_at)
VALUES
  (1, 'user-1', 'Salutare! Am găsit un loc liber lângă parc.', NOW() - INTERVAL '1 days'),
  (2, 'user-2', 'Atenție la bariera de la intrare, nu funcționează mereu.', NOW() - INTERVAL '2 days'),
  (3, 'user-3', 'Cineva a uitat farurile aprinse la Spot 5.', NOW() - INTERVAL '3 hours'),
  (4, 'user-4', 'Mulțumesc pentru ajutorul de ieri!', NOW() - INTERVAL '5 hours'),
  (5, 'user-5', 'S-a eliberat Spot 12.', NOW() - INTERVAL '6 hours'),
  (6, 'user-6', 'Propun să ne întâlnim la cafea săptămâna viitoare.', NOW() - INTERVAL '7 hours'),
  (7, 'user-7', 'Atenție la gropile din zona de nord.', NOW() - INTERVAL '8 hours'),
  (8, 'user-8', 'Felicitări pentru noua aplicație!', NOW() - INTERVAL '9 hours'),
  (9, 'user-9', 'Spot 18 e blocat de o mașină fără abonament.', NOW() - INTERVAL '10 hours'),
  (10, 'user-10', 'Vreme frumoasă pentru parcare azi!', NOW() - INTERVAL '11 hours');

-- 5. chat_messages (20 mesaje)
INSERT INTO chat_messages (id, sender_id, receiver_id, message, sent_at)
VALUES
  (1, 'user-1', 'user-2', 'Salut, ai rezervat Spot 3?', NOW() - INTERVAL '2 hours'),
  (2, 'user-2', 'user-1', 'Da, îl eliberez în 10 minute.', NOW() - INTERVAL '1.5 hours'),
  (3, 'user-3', 'user-4', 'Ne vedem la barieră?', NOW() - INTERVAL '1 hours'),
  (4, 'user-4', 'user-3', 'Da, vin acum.', NOW() - INTERVAL '55 minutes'),
  (5, 'user-5', 'user-6', 'Poți să-mi ții un loc?', NOW() - INTERVAL '50 minutes'),
  (6, 'user-6', 'user-5', 'Sigur, te aștept.', NOW() - INTERVAL '45 minutes'),
  (7, 'user-7', 'user-8', 'Ai văzut mesajul de pe wall?', NOW() - INTERVAL '40 minutes'),
  (8, 'user-8', 'user-7', 'Da, mulțumesc!', NOW() - INTERVAL '35 minutes'),
  (9, 'user-9', 'user-10', 'Spot 18 e ocupat?', NOW() - INTERVAL '30 minutes'),
  (10, 'user-10', 'user-9', 'Da, momentan.', NOW() - INTERVAL '25 minutes'),
  (11, 'user-1', 'user-3', 'Vii la întâlnire?', NOW() - INTERVAL '20 minutes'),
  (12, 'user-3', 'user-1', 'Ajung în 5 minute.', NOW() - INTERVAL '15 minutes'),
  (13, 'user-2', 'user-4', 'Poți să mă ajuți cu aplicația?', NOW() - INTERVAL '10 minutes'),
  (14, 'user-4', 'user-2', 'Sigur, scrie-mi aici.', NOW() - INTERVAL '9 minutes'),
  (15, 'user-5', 'user-7', 'Ai găsit loc de parcare?', NOW() - INTERVAL '8 minutes'),
  (16, 'user-7', 'user-5', 'Da, la Spot 21.', NOW() - INTERVAL '7 minutes'),
  (17, 'user-6', 'user-8', 'Ne vedem la cafea?', NOW() - INTERVAL '6 minutes'),
  (18, 'user-8', 'user-6', 'Da, la ora 10.', NOW() - INTERVAL '5 minutes'),
  (19, 'user-9', 'user-1', 'Mulțumesc pentru ajutor!', NOW() - INTERVAL '4 minutes'),
  (20, 'user-1', 'user-9', 'Cu plăcere!', NOW() - INTERVAL '3 minutes');

-- 6. favorites (10 favorite)
INSERT INTO favorites (id, user_id, spot_id, created_at)
VALUES
  (1, 'user-1', 1, NOW()),
  (2, 'user-2', 2, NOW()),
  (3, 'user-3', 3, NOW()),
  (4, 'user-4', 4, NOW()),
  (5, 'user-5', 5, NOW()),
  (6, 'user-6', 6, NOW()),
  (7, 'user-7', 7, NOW()),
  (8, 'user-8', 8, NOW()),
  (9, 'user-9', 9, NOW()),
  (10, 'user-10', 10, NOW());

-- 7. notifications (10 notificări)
INSERT INTO notifications (id, user_id, message, is_read, created_at)
VALUES
  (1, 'user-1', 'Rezervarea ta pentru Spot 3 a fost confirmată.', FALSE, NOW()),
  (2, 'user-2', 'Spot 6 este acum disponibil.', TRUE, NOW()),
  (3, 'user-3', 'Ai primit un mesaj nou.', FALSE, NOW()),
  (4, 'user-4', 'Spot 15 a fost eliberat.', TRUE, NOW()),
  (5, 'user-5', 'Rezervarea ta expiră în 10 minute.', FALSE, NOW()),
  (6, 'user-6', 'Spot 2 a fost adăugat la favorite.', TRUE, NOW()),
  (7, 'user-7', 'Ai primit o nouă notificare.', FALSE, NOW()),
  (8, 'user-8', 'Spot 8 este ocupat.', TRUE, NOW()),
  (9, 'user-9', 'Rezervarea ta a fost anulată.', FALSE, NOW()),
  (10, 'user-10', 'Spot 10 este acum liber.', TRUE, NOW());

-- 8. problems_reports (10 raportări)
INSERT INTO problems_reports (id, user_id, spot_id, description, status, created_at)
VALUES
  (1, 'user-1', 3, 'Bariera nu se deschide.', 'open', NOW() - INTERVAL '1 days'),
  (2, 'user-2', 6, 'Locul este ocupat abuziv.', 'closed', NOW() - INTERVAL '2 days'),
  (3, 'user-3', 10, 'Iluminatul nu funcționează.', 'open', NOW() - INTERVAL '3 hours'),
  (4, 'user-4', 15, 'Semnalizare lipsă.', 'open', NOW() - INTERVAL '5 hours'),
  (5, 'user-5', 20, 'Gropi în asfalt.', 'closed', NOW() - INTERVAL '6 hours'),
  (6, 'user-6', 2, 'Marcaj șters.', 'open', NOW() - INTERVAL '7 hours'),
  (7, 'user-7', 5, 'Loc blocat de altă mașină.', 'closed', NOW() - INTERVAL '8 hours'),
  (8, 'user-8', 8, 'Acces dificil.', 'open', NOW() - INTERVAL '9 hours'),
  (9, 'user-9', 12, 'Zgomot excesiv.', 'open', NOW() - INTERVAL '10 hours'),
  (10, 'user-10', 18, 'Parcare neregulamentară.', 'closed', NOW() - INTERVAL '11 hours'); 