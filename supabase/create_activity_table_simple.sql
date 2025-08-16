-- Script simplu pentru crearea tabelei user_activities
-- Rulează acest script în Supabase SQL Editor

-- 1. Creează tabela dacă nu există
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL CHECK (
        action_type IN (
            'parking_reported',
            'community_update', 
            'parking_reserved',
            'alert_created',
            'chat_message'
        )
    ),
    location TEXT NOT NULL,
    details TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Creează indexuri dacă nu există
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_action_type ON public.user_activities(action_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_location ON public.user_activities(location);

-- 3. Creează trigger-ul pentru updated_at dacă nu există
CREATE OR REPLACE FUNCTION update_user_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_activities_updated_at ON public.user_activities;
CREATE TRIGGER update_user_activities_updated_at
    BEFORE UPDATE ON public.user_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_user_activities_updated_at();

-- 4. Activează RLS
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- 5. Creează RLS policies dacă nu există
DROP POLICY IF EXISTS "Users can view all activities" ON public.user_activities;
CREATE POLICY "Users can view all activities" ON public.user_activities
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can create own activities" ON public.user_activities;
CREATE POLICY "Users can create own activities" ON public.user_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own activities" ON public.user_activities;
CREATE POLICY "Users can update own activities" ON public.user_activities
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own activities" ON public.user_activities;
CREATE POLICY "Users can delete own activities" ON public.user_activities
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Confirmați că totul a fost creat
SELECT '✅ Tabela user_activities a fost creată cu succes!' as status; 