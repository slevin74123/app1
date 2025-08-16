-- Schema pentru tabela de activități utilizator
-- Această tabelă va stoca toate activitățile utilizatorilor pentru feed-ul de activitate recentă

-- Șterge tabela dacă există
DROP TABLE IF EXISTS public.user_activities CASCADE;

-- Creează tabela pentru activitățile utilizatorilor
CREATE TABLE public.user_activities (
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

-- Creează indexuri pentru performanță
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_action_type ON public.user_activities(action_type);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at DESC);
CREATE INDEX idx_user_activities_location ON public.user_activities(location);

-- Creează trigger pentru actualizarea updated_at
CREATE OR REPLACE FUNCTION update_user_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_activities_updated_at
    BEFORE UPDATE ON public.user_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_user_activities_updated_at();

-- Creează RLS policies
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Orice utilizator autentificat poate citi activitățile
CREATE POLICY "Users can view all activities" ON public.user_activities
    FOR SELECT USING (auth.role() = 'authenticated');

-- Utilizatorii pot crea doar propriile activități
CREATE POLICY "Users can create own activities" ON public.user_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Utilizatorii pot actualiza doar propriile activități
CREATE POLICY "Users can update own activities" ON public.user_activities
    FOR UPDATE USING (auth.uid() = user_id);

-- Utilizatorii pot șterge doar propriile activități
CREATE POLICY "Users can delete own activities" ON public.user_activities
    FOR DELETE USING (auth.uid() = user_id);

-- NOTĂ: Nu se inserează date de test pentru că utilizatorii nu există încă
-- Datele de test vor fi create automat când utilizatorii vor folosi aplicația

-- Confirmați că tabela a fost creată cu succes
SELECT 'Tabela user_activities a fost creată cu succes!' as status; 