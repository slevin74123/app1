-- Schema pentru gestionarea favoritelor și parcarilor utilizatorilor

-- Tabela pentru parcarile favorite ale utilizatorilor
create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parking_spot_id text not null,
  parking_name text not null,
  parking_address text not null,
  parking_type text not null check (parking_type in ('garage', 'street', 'lot')),
  price numeric(10,2),
  rating numeric(3,1),
  added_at timestamp with time zone default now(),
  
  -- Constraint pentru a preveni duplicatele
  unique(user_id, parking_spot_id)
);

-- Tabela pentru istoricul parcarilor utilizatorilor
create table if not exists public.user_parking_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parking_spot_id text not null,
  parking_name text not null,
  parking_address text not null,
  parking_type text not null,
  price numeric(10,2),
  rating numeric(3,1),
  status text not null check (status in ('active', 'completed', 'cancelled', 'favorite')),
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  duration_hours numeric(4,2),
  total_cost numeric(10,2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexuri pentru performanță
create index if not exists user_favorites_user_id_idx on public.user_favorites(user_id);
create index if not exists user_favorites_parking_spot_id_idx on public.user_favorites(parking_spot_id);
create index if not exists user_parking_history_user_id_idx on public.user_parking_history(user_id);
create index if not exists user_parking_history_status_idx on public.user_parking_history(status);
create index if not exists user_parking_history_created_at_idx on public.user_parking_history(created_at desc);

-- Row Level Security (RLS)
alter table public.user_favorites enable row level security;
alter table public.user_parking_history enable row level security;

-- Politici pentru user_favorites
create policy "Users can view their own favorites" on public.user_favorites
  for select using (auth.uid() = user_id);

create policy "Users can insert their own favorites" on public.user_favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own favorites" on public.user_favorites
  for update using (auth.uid() = user_id);

create policy "Users can delete their own favorites" on public.user_favorites
  for delete using (auth.uid() = user_id);

-- Politici pentru user_parking_history
create policy "Users can view their own parking history" on public.user_parking_history
  for select using (auth.uid() = user_id);

create policy "Users can insert their own parking history" on public.user_parking_history
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own parking history" on public.user_parking_history
  for update using (auth.uid() = user_id);

create policy "Users can delete their own parking history" on public.user_parking_history
  for delete using (auth.uid() = user_id);

-- Funcție pentru actualizarea timestamp-ului updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger pentru actualizarea automată a updated_at
create trigger update_user_parking_history_updated_at
  before update on public.user_parking_history
  for each row
  execute function public.update_updated_at_column();

-- Funcție pentru a obține favoritele unui utilizator
create or replace function public.get_user_favorites(user_uuid uuid)
returns table (
  id uuid,
  parking_spot_id text,
  parking_name text,
  parking_address text,
  parking_type text,
  price numeric,
  rating numeric,
  added_at timestamp with time zone
) as $$
begin
  return query
  select 
    uf.id,
    uf.parking_spot_id,
    uf.parking_name,
    uf.parking_address,
    uf.parking_type,
    uf.price,
    uf.rating,
    uf.added_at
  from public.user_favorites uf
  where uf.user_id = user_uuid
  order by uf.added_at desc;
end;
$$ language plpgsql security definer;

-- Funcție pentru a obține istoricul parcarilor unui utilizator
create or replace function public.get_user_parking_history(user_uuid uuid, status_filter text default null)
returns table (
  id uuid,
  parking_spot_id text,
  parking_name text,
  parking_address text,
  parking_type text,
  price numeric,
  rating numeric,
  status text,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  duration_hours numeric,
  total_cost numeric,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) as $$
begin
  return query
  select 
    uph.id,
    uph.parking_spot_id,
    uph.parking_name,
    uph.parking_address,
    uph.parking_type,
    uph.price,
    uph.rating,
    uph.status,
    uph.start_time,
    uph.end_time,
    uph.duration_hours,
    uph.total_cost,
    uph.created_at,
    uph.updated_at
  from public.user_parking_history uph
  where uph.user_id = user_uuid
    and (status_filter is null or uph.status = status_filter)
  order by uph.created_at desc;
end;
$$ language plpgsql security definer; 