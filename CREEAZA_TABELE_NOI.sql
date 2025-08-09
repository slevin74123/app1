-- =====================================================
-- SCRIPT PENTRU CREAREA TABELELOR NOI
-- (Fără să afecteze tabela parcari_raportate existentă)
-- =====================================================

-- =====================================================
-- 1. TABELE PENTRU SESIUNI PARCARE
-- =====================================================

-- Tabela pentru sesiuni de parcare
CREATE TABLE IF NOT EXISTS sesiuni_parcare (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parcare_id BIGINT REFERENCES parcari_raportate(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'rezervat' CHECK (status IN ('rezervat', 'activ', 'finalizat', 'anulat')),
    data_inceput TIMESTAMP NOT NULL,
    data_sfarsit TIMESTAMP NOT NULL,
    data_activare TIMESTAMP,
    cost_total DECIMAL(8,2) NOT NULL DEFAULT 0,
    cost_pe_ora DECIMAL(6,2) NOT NULL,
    ore_rezervate INTEGER NOT NULL,
    ore_utilizate DECIMAL(4,2) DEFAULT 0,
    locatie_nume VARCHAR(255) NOT NULL,
    locatie_adresa VARCHAR(255) NOT NULL,
    locatie_lat DECIMAL(10,8),
    locatie_lng DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. TABELE PENTRU COMUNITATE
-- =====================================================

-- Tabela pentru feed-ul comunității
CREATE TABLE IF NOT EXISTS postari_comunitate (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    titlu VARCHAR(255),
    continut TEXT NOT NULL,
    tip_postare VARCHAR(50) DEFAULT 'general' CHECK (tip_postare IN ('general', 'problema', 'recomandare', 'alerta')),
    locatie_nume VARCHAR(255),
    locatie_adresa VARCHAR(255),
    locatie_lat DECIMAL(10,8),
    locatie_lng DECIMAL(11,8),
    imagine_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comentarii_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'activ' CHECK (status IN ('activ', 'moderat', 'sters')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela pentru like-uri la postări
CREATE TABLE IF NOT EXISTS like_uri_postari (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    postare_id BIGINT REFERENCES postari_comunitate(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, postare_id)
);

-- Tabela pentru comentarii la postări
CREATE TABLE IF NOT EXISTS comentarii_postari (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    postare_id BIGINT REFERENCES postari_comunitate(id) ON DELETE CASCADE,
    continut TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. TABELE PENTRU CHAT LIVE
-- =====================================================

-- Tabela pentru mesaje chat live
CREATE TABLE IF NOT EXISTS mesaje_chat (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    continut TEXT NOT NULL,
    tip_mesaj VARCHAR(20) DEFAULT 'text' CHECK (tip_mesaj IN ('text', 'imagine', 'locatie')),
    imagine_url TEXT,
    locatie_lat DECIMAL(10,8),
    locatie_lng DECIMAL(11,8),
    likes_count INTEGER DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela pentru like-uri la mesaje chat
CREATE TABLE IF NOT EXISTS like_uri_mesaje (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mesaj_id BIGINT REFERENCES mesaje_chat(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, mesaj_id)
);

-- Tabela pentru utilizatori online (pentru chat)
CREATE TABLE IF NOT EXISTS utilizatori_online (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ultima_activitate TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'online' CHECK (status IN ('online', 'away', 'offline')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =====================================================
-- 4. TABELE PENTRU RAPORTĂRI PROBLEME
-- =====================================================

-- Tabela pentru raportări probleme
CREATE TABLE IF NOT EXISTS raportari_probleme (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tip_problema VARCHAR(50) NOT NULL CHECK (tip_problema IN ('parcare_ilegala', 'masina_abandonata', 'contor_stricat', 'zona_interzisa', 'alte_probleme')),
    titlu VARCHAR(255) NOT NULL,
    descriere TEXT NOT NULL,
    locatie_nume VARCHAR(255),
    locatie_adresa VARCHAR(255) NOT NULL,
    locatie_lat DECIMAL(10,8),
    locatie_lng DECIMAL(11,8),
    imagine_url TEXT,
    status VARCHAR(20) DEFAULT 'nou' CHECK (status IN ('nou', 'in_procesare', 'rezolvat', 'respins')),
    prioritate VARCHAR(20) DEFAULT 'medie' CHECK (prioritate IN ('scazuta', 'medie', 'ridicata', 'urgenta')),
    raspuns_admin TEXT,
    data_raspuns TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. TABELE PENTRU STATISTICI ȘI ECONOMII
-- =====================================================

-- Tabela pentru statistici utilizatori (pentru economii)
CREATE TABLE IF NOT EXISTS statistici_utilizatori (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_ore_parcare DECIMAL(8,2) DEFAULT 0,
    total_cost_parcare DECIMAL(10,2) DEFAULT 0,
    total_economii DECIMAL(10,2) DEFAULT 0,
    sesiuni_completate INTEGER DEFAULT 0,
    sesiuni_active INTEGER DEFAULT 0,
    ore_gratuite_ramase DECIMAL(4,2) DEFAULT 0,
    nivel_fidelitate VARCHAR(20) DEFAULT 'incepator' CHECK (nivel_fidelitate IN ('incepator', 'bronze', 'argint', 'aur', 'platinum')),
    puncte_fidelitate INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tabela pentru promoții și economii
CREATE TABLE IF NOT EXISTS promotii_economii (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tip_promotie VARCHAR(50) NOT NULL CHECK (tip_promotie IN ('prima_parcare', 'ore_gratuite', 'reducere_procent', 'cashback', 'bonus_fidelitate')),
    descriere VARCHAR(255) NOT NULL,
    valoare_economie DECIMAL(8,2) NOT NULL,
    procent_reducere INTEGER,
    ore_gratuite INTEGER,
    este_activ BOOLEAN DEFAULT TRUE,
    data_activare TIMESTAMP,
    data_expirare TIMESTAMP,
    este_utilizat BOOLEAN DEFAULT FALSE,
    data_utilizare TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. INDEXURI PENTRU PERFORMANȚĂ
-- =====================================================

-- Indexuri pentru sesiuni_parcare
CREATE INDEX IF NOT EXISTS idx_sesiuni_user_id ON sesiuni_parcare(user_id);
CREATE INDEX IF NOT EXISTS idx_sesiuni_status ON sesiuni_parcare(status);
CREATE INDEX IF NOT EXISTS idx_sesiuni_data_inceput ON sesiuni_parcare(data_inceput);

-- Indexuri pentru postari_comunitate
CREATE INDEX IF NOT EXISTS idx_postari_user_id ON postari_comunitate(user_id);
CREATE INDEX IF NOT EXISTS idx_postari_created_at ON postari_comunitate(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_postari_status ON postari_comunitate(status);

-- Indexuri pentru mesaje_chat
CREATE INDEX IF NOT EXISTS idx_mesaje_created_at ON mesaje_chat(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mesaje_user_id ON mesaje_chat(user_id);

-- Indexuri pentru raportari_probleme
CREATE INDEX IF NOT EXISTS idx_rap_user_id ON raportari_probleme(user_id);
CREATE INDEX IF NOT EXISTS idx_rap_status ON raportari_probleme(status);

-- =====================================================
-- 7. POLITICI RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Politici pentru sesiuni_parcare
ALTER TABLE sesiuni_parcare ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilizatorii pot vedea propriile sesiuni" ON sesiuni_parcare
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot crea propriile sesiuni" ON sesiuni_parcare
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot actualiza propriile sesiuni" ON sesiuni_parcare
    FOR UPDATE USING (auth.uid() = user_id);

-- Politici pentru postari_comunitate
ALTER TABLE postari_comunitate ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Toți utilizatorii pot vedea postările publice" ON postari_comunitate
    FOR SELECT USING (status = 'activ');

CREATE POLICY "Utilizatorii pot crea propriile postări" ON postari_comunitate
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot actualiza propriile postări" ON postari_comunitate
    FOR UPDATE USING (auth.uid() = user_id);

-- Politici pentru mesaje_chat
ALTER TABLE mesaje_chat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Toți utilizatorii pot vedea mesajele chat" ON mesaje_chat
    FOR SELECT USING (true);

CREATE POLICY "Utilizatorii autentificați pot crea mesaje" ON mesaje_chat
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politici pentru raportari_probleme
ALTER TABLE raportari_probleme ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilizatorii pot vedea propriile raportări" ON raportari_probleme
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot crea raportări" ON raportari_probleme
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politici pentru statistici_utilizatori
ALTER TABLE statistici_utilizatori ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilizatorii pot vedea propriile statistici" ON statistici_utilizatori
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot actualiza propriile statistici" ON statistici_utilizatori
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 8. FUNCȚII PENTRU AUTOMATIZARE
-- =====================================================

-- Funcție pentru actualizarea automată a updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger-uri pentru actualizarea automată
CREATE TRIGGER update_sesiuni_updated_at BEFORE UPDATE ON sesiuni_parcare
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_postari_updated_at BEFORE UPDATE ON postari_comunitate
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comentarii_updated_at BEFORE UPDATE ON comentarii_postari
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mesaje_updated_at BEFORE UPDATE ON mesaje_chat
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rap_updated_at BEFORE UPDATE ON raportari_probleme
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stats_updated_at BEFORE UPDATE ON statistici_utilizatori
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. VERIFICARE CREARE TABELE
-- =====================================================

-- Verifică dacă toate tabelele au fost create
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'sesiuni_parcare',
    'postari_comunitate', 
    'like_uri_postari',
    'comentarii_postari',
    'mesaje_chat',
    'like_uri_mesaje',
    'raportari_probleme',
    'statistici_utilizatori',
    'promotii_economii',
    'utilizatori_online'
)
ORDER BY table_name;

-- Afișează numărul de tabele create
SELECT COUNT(*) as tabele_create
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'sesiuni_parcare',
    'postari_comunitate', 
    'like_uri_postari',
    'comentarii_postari',
    'mesaje_chat',
    'like_uri_mesaje',
    'raportari_probleme',
    'statistici_utilizatori',
    'promotii_economii',
    'utilizatori_online'
); 