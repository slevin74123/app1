import { supabase } from '@/lib/supabase'

export async function createServerClient() {
  // Pentru server-side rendering, folosim client-ul standard
  // Cookie-urile sunt gestionate automat de Supabase
  return supabase
} 