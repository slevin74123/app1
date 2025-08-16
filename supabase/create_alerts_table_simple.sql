-- Script simplu pentru crearea tabelei parking_alerts
-- Rulează acest script în Supabase SQL Editor

-- 1. Creează tabela dacă nu există
CREATE TABLE IF NOT EXISTS public.parking_alerts (
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

-- 2. Creează indexuri dacă nu există
CREATE INDEX IF NOT EXISTS idx_parking_alerts_user_id ON public.parking_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_parking_alerts_is_active ON public.parking_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_parking_alerts_created_at ON public.parking_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parking_alerts_location ON public.parking_alerts(location);

-- 3. Creează trigger-ul pentru updated_at dacă nu există
CREATE OR REPLACE FUNCTION update_parking_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_parking_alerts_updated_at ON public.parking_alerts;
CREATE TRIGGER update_parking_alerts_updated_at
    BEFORE UPDATE ON public.parking_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_parking_alerts_updated_at();

-- 4. Activează RLS
ALTER TABLE public.parking_alerts ENABLE ROW LEVEL SECURITY;

-- 5. Creează RLS policies dacă nu există
DROP POLICY IF EXISTS "Users can view own alerts" ON public.parking_alerts;
CREATE POLICY "Users can view own alerts" ON public.parking_alerts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own alerts" ON public.parking_alerts;
CREATE POLICY "Users can create own alerts" ON public.parking_alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own alerts" ON public.parking_alerts;
CREATE POLICY "Users can update own alerts" ON public.parking_alerts
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own alerts" ON public.parking_alerts;
CREATE POLICY "Users can delete own alerts" ON public.parking_alerts
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Confirmați că totul a fost creat
SELECT '✅ Tabela parking_alerts a fost creată cu succes!' as status; 