-- Creează tabela pentru parcările raportate de utilizatori
CREATE TABLE parcari_raportate (
    id BIGSERIAL PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    adresa VARCHAR(255) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    numar_recenzii INTEGER DEFAULT 0,
    disponibilitate BOOLEAN DEFAULT TRUE,
    garaj BOOLEAN DEFAULT FALSE,
    acoperit BOOLEAN DEFAULT FALSE,
    securitate BOOLEAN DEFAULT FALSE,
    pret_pe_ora DECIMAL(6,2) NOT NULL,
    distanta_km DECIMAL(4,2) DEFAULT 0.0,
    timp_mers_minute INTEGER DEFAULT 0,
    lat DECIMAL(10,8) NOT NULL,
    lng DECIMAL(11,8) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Creează indexuri pentru performanță
CREATE INDEX idx_parcari_raportate_location ON parcari_raportate(lat, lng);
CREATE INDEX idx_parcari_raportate_disponibilitate ON parcari_raportate(disponibilitate);
CREATE INDEX idx_parcari_raportate_user_id ON parcari_raportate(user_id);
CREATE INDEX idx_parcari_raportate_created_at ON parcari_raportate(created_at);

-- Creează funcție pentru actualizarea updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Creează trigger pentru actualizarea automată a updated_at
CREATE TRIGGER update_parcari_raportate_updated_at 
    BEFORE UPDATE ON parcari_raportate 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Creează RLS (Row Level Security) pentru securitate
ALTER TABLE parcari_raportate ENABLE ROW LEVEL SECURITY;

-- Politici RLS
-- Permite citirea tuturor parcărilor raportate
CREATE POLICY "Permite citirea parcărilor raportate" ON parcari_raportate
    FOR SELECT USING (true);

-- Permite inserarea doar utilizatorilor autentificați
CREATE POLICY "Permite inserarea parcărilor raportate" ON parcari_raportate
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Permite actualizarea doar creatorului parcării
CREATE POLICY "Permite actualizarea parcărilor raportate" ON parcari_raportate
    FOR UPDATE USING (auth.uid() = user_id);

-- Permite ștergerea doar creatorului parcării
CREATE POLICY "Permite ștergerea parcărilor raportate" ON parcari_raportate
    FOR DELETE USING (auth.uid() = user_id); 