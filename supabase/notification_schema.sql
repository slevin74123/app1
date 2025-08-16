-- Schema pentru notificările de parcare
-- Această tabelă va stoca notificările utilizatorilor care caută locuri de parcare

-- 1. Șterge tabela existentă dacă există (pentru a evita conflictele)
drop table if exists public.parking_notifications cascade;

-- 2. Creează tabela de notificări
create table public.parking_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parking_location_id uuid not null references public.parking_locations(id) on delete cascade,
  parking_name text not null,
  duration integer not null check (duration > 0), -- în minute
  max_price numeric(8, 2) not null check (max_price >= 0), -- în RON/oră
  created_at timestamp with time zone default now(),
  is_active boolean default true,
  
  -- Constraint pentru a preveni notificări duplicate
  unique(user_id, parking_location_id)
);

-- 3. Creează indexurile pentru performanță
create index parking_notifications_user_id_idx on public.parking_notifications(user_id);
create index parking_notifications_parking_location_id_idx on public.parking_notifications(parking_location_id);
create index parking_notifications_is_active_idx on public.parking_notifications(is_active);
create index parking_notifications_created_at_idx on public.parking_notifications(created_at);

-- 4. Creează index compus pentru căutări eficiente
create index parking_notifications_location_active_idx on public.parking_notifications(parking_location_id, is_active);

-- 5. Activează Row Level Security (RLS)
alter table public.parking_notifications enable row level security;

-- 6. Creează politicile de securitate
-- Utilizatorii pot vedea doar propriile notificări
create policy "Users can view own notifications" on public.parking_notifications
  for select using (auth.uid() = user_id);

-- Utilizatorii pot crea propriile notificări
create policy "Users can create own notifications" on public.parking_notifications
  for insert with check (auth.uid() = user_id);

-- Utilizatorii pot actualiza propriile notificări
create policy "Users can update own notifications" on public.parking_notifications
  for update using (auth.uid() = user_id);

-- Utilizatorii pot șterge propriile notificări
create policy "Users can delete own notifications" on public.parking_notifications
  for delete using (auth.uid() = user_id);

-- 7. Creează trigger pentru actualizarea timestamp-ului
create or replace function update_parking_notifications_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_parking_notifications_updated_at
  before update on public.parking_notifications
  for each row
  execute function update_parking_notifications_updated_at();

-- 8. Creează funcția pentru verificarea potrivirilor de notificări
create or replace function check_parking_notification_matches(
  p_parking_location_id uuid,
  p_reported_price numeric
)
returns table (
  notification_id uuid,
  user_id uuid,
  parking_name text,
  duration integer,
  max_price numeric,
  created_at timestamp with time zone
) as $$
begin
  return query
  select 
    pn.id,
    pn.user_id,
    pn.parking_name,
    pn.duration,
    pn.max_price,
    pn.created_at
  from public.parking_notifications pn
  where pn.parking_location_id = p_parking_location_id
    and pn.is_active = true
    and pn.max_price >= p_reported_price
  order by pn.created_at desc;
end;
$$ language plpgsql security definer;

-- 9. Creează funcția pentru deactivarea notificărilor
create or replace function deactivate_parking_notification(
  p_notification_id uuid,
  p_user_id uuid
)
returns boolean as $$
begin
  update public.parking_notifications
  set is_active = false
  where id = p_notification_id
    and user_id = p_user_id;
  
  return found;
end;
$$ language plpgsql security definer;

-- 10. Mesaj de confirmare
do $$
begin
  raise notice 'Schema pentru notificări de parcare creată cu succes!';
  raise notice 'Tabela: parking_notifications cu RLS activat';
  raise notice 'Indexurile și politicile de securitate au fost create';
  raise notice 'Funcțiile pentru verificarea potrivirilor sunt active';
end $$; 