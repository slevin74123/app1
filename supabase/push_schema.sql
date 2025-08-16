-- push_subscriptions table
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamp with time zone default now(),
  revoked_at timestamp with time zone
);

alter table public.push_subscriptions enable row level security;
create policy "allow user read own subs" on public.push_subscriptions for select using (auth.uid() = user_id);
create policy "allow user upsert own subs" on public.push_subscriptions for insert with check (auth.uid() = user_id);
create policy "allow user update own subs" on public.push_subscriptions for update using (auth.uid() = user_id);

-- notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  spot_id text,
  title text not null,
  body text,
  read_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table public.notifications enable row level security;
create policy "allow user read own notifications" on public.notifications for select using (auth.uid() = user_id);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc); 