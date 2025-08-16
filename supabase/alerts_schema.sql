-- Schema pentru tabela de alerte de parcare
-- Această tabelă va stoca toate alertele utilizatorilor pentru notificări

-- Șterge tabela dacă există
DROP TABLE IF EXISTS public.parking_alerts CASCADE;

-- Creează tabela pentru alertele de parcare
CREATE TABLE public.parking_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    parking_name TEXT NOT NULL,
    location TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    max_price_per_hour DECIMAL(10,2) NOT NULL CHECK (max_price_per_hour >= 0),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Creează indexuri pentru performanță
CREATE INDEX idx_parking_alerts_user_id ON public.parking_alerts(user_id);
CREATE INDEX idx_parking_alerts_is_active ON public.parking_alerts(is_active);
CREATE INDEX idx_parking_alerts_created_at ON public.parking_alerts(created_at DESC);
CREATE INDEX idx_parking_alerts_location ON public.parking_alerts(location);

-- Creează trigger pentru actualizarea updated_at
CREATE OR REPLACE FUNCTION update_parking_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_parking_alerts_updated_at
    BEFORE UPDATE ON public.parking_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_parking_alerts_updated_at();

-- Creează RLS policies
ALTER TABLE public.parking_alerts ENABLE ROW LEVEL SECURITY;

-- Utilizatorii pot citi doar propriile alerte
CREATE POLICY "Users can view own alerts" ON public.parking_alerts
    FOR SELECT USING (auth.uid() = user_id);

-- Utilizatorii pot crea doar propriile alerte
CREATE POLICY "Users can create own alerts" ON public.parking_alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Utilizatorii pot actualiza doar propriile alerte
CREATE POLICY "Users can update own alerts" ON public.parking_alerts
    FOR UPDATE USING (auth.uid() = user_id);

-- Utilizatorii pot șterge doar propriile alerte
CREATE POLICY "Users can delete own alerts" ON public.parking_alerts
    FOR DELETE USING (auth.uid() = user_id);

-- Confirmați că tabela a fost creată cu succes
SELECT 'Tabela parking_alerts a fost creată cu succes!' as status; 