import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, title = 'Test notificare', body: message = 'Funcționează push!', url = '/dashboard' } = body as any;
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
    const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
    if (!supabaseUrl || !supabaseKey || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json({ error: 'Server push env vars not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    webpush.setVapidDetails('mailto:admin@example.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    const { data: subs, error } = await supabase.from('push_subscriptions').select('*').eq('user_id', userId).is('revoked_at', null);
    if (error) throw error;

    const payload = JSON.stringify({ title, body: message, url });

    const results = await Promise.allSettled((subs || []).map((s: any) => webpush.sendNotification({
      endpoint: s.endpoint,
      keys: { p256dh: s.p256dh, auth: s.auth }
    } as any, payload)));

    return NextResponse.json({ ok: true, results });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
} 