-- Script pentru inserarea de date de test în user_activities
-- RULĂ ACEST SCRIPT DOAR DUPĂ CE AI UTILIZATORI AUTENTIFICAȚI ÎN APLICAȚIE

-- NOTĂ: Înlocuiește UUID-urile de mai jos cu ID-urile reale ale utilizatorilor tăi
-- Pentru a găsi ID-urile utilizatorilor, rulează: SELECT id, email FROM auth.users;

-- Exemplu de inserare (decomentează și modifică după ce ai utilizatori):
/*
INSERT INTO public.user_activities (user_id, action_type, location, details) VALUES
    ('REPLACE_WITH_REAL_USER_ID_1', 'parking_reported', 'Piața Victoriei', 'Loc liber raportat în zona centrală'),
    ('REPLACE_WITH_REAL_USER_ID_2', 'community_update', 'Centrul Vechi', 'Actualizare informații despre parcări'),
    ('REPLACE_WITH_REAL_USER_ID_1', 'parking_reserved', 'Herastrau', 'Rezervare loc parcare pentru eveniment'),
    ('REPLACE_WITH_REAL_USER_ID_2', 'alert_created', 'Mall Băneasa', 'Alertă creată pentru locuri gratuite'),
    ('REPLACE_WITH_REAL_USER_ID_1', 'chat_message', 'Universitate', 'Mesaj în chat-ul comunității');
*/

-- Pentru a verifica dacă ai utilizatori în sistem:
SELECT 'Utilizatori existenți în sistem:' as info;
SELECT id, email, created_at FROM auth.users LIMIT 5;

-- Pentru a verifica dacă tabela user_activities este goală:
SELECT 'Activitatea din tabela user_activities:' as info;
SELECT COUNT(*) as total_activities FROM public.user_activities; 