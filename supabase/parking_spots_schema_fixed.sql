-- Schema pentru gestionarea locurilor individuale de parcare
-- Versiune curată fără erori de sintaxă

-- 1. Șterge tabelele existente dacă există
drop table if exists public.parking_spots cascade;
drop table if exists public.parking_spot_status_history cascade;

-- 2. Creează tabela pentru locurile individuale de parcare
create table public.parking_spots (
  id uuid primary key default gen_random_uuid(),
  parking_location_id uuid references public.parking_locations(id) on delete cascade,
  spot_number text not null,
  status text not null check (status in ('available', 'reserved', 'occupied')) default 'available',
  last_status_change timestamp with time zone default now(),
  last_reported_by uuid references auth.users(id),
  is_premium boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(parking_location_id, spot_number)
);

-- 3. Creează tabela pentru istoricul statusurilor
create table public.parking_spot_status_history (
  id uuid primary key default gen_random_uuid(),
  parking_spot_id uuid references public.parking_spots(id) on delete cascade,
  user_id uuid references auth.users(id),
  old_status text not null,
  new_status text not null,
  change_reason text,
  notes text,
  created_at timestamp with time zone default now()
);

-- 4. Creează indexurile pentru performanță
create index parking_spots_parking_location_id_idx on public.parking_spots(parking_location_id);
create index parking_spots_status_idx on public.parking_spots(status);
create index parking_spots_last_status_change_idx on public.parking_spots(last_status_change desc);
create index parking_spot_status_history_parking_spot_id_idx on public.parking_spot_status_history(parking_spot_id);
create index parking_spot_status_history_created_at_idx on public.parking_spot_status_history(created_at desc);

-- 5. Activează Row Level Security (RLS)
alter table public.parking_spots enable row level security;
alter table public.parking_spot_status_history enable row level security;

-- 6. Creează politicile de securitate pentru parking_spots
create policy "Anyone can view parking spots" on public.parking_spots
  for select using (true);

create policy "Authenticated users can update parking spots" on public.parking_spots
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can insert parking spots" on public.parking_spots
  for insert with check (auth.role() = 'authenticated');

-- 7. Creează politicile de securitate pentru parking_spot_status_history
create policy "Anyone can view parking spot status history" on public.parking_spot_status_history
  for select using (true);

create policy "Authenticated users can insert parking spot status history" on public.parking_spot_status_history
  for insert with check (auth.role() = 'authenticated');

-- 8. Creează funcția pentru actualizarea statusului unui loc de parcare
create or replace function update_parking_spot_status(
  spot_id uuid,
  new_status text,
  user_id uuid,
  change_reason text default 'user_report',
  notes text default null
) returns boolean as $$
declare
  old_status text;
begin
  select status into old_status from public.parking_spots where id = spot_id;
  
  if not found then
    return false;
  end if;
  
  update public.parking_spots 
  set 
    status = new_status,
    last_status_change = now(),
    last_reported_by = user_id,
    updated_at = now()
  where id = spot_id;
  
  insert into public.parking_spot_status_history (
    parking_spot_id, user_id, old_status, new_status, change_reason, notes
  ) values (
    spot_id, user_id, old_status, new_status, change_reason, notes
  );
  
  return true;
end;
$$ language plpgsql security definer;

-- 9. Creează funcția pentru raportarea unui loc liber
create or replace function report_free_parking_spot(
  parking_location_id uuid,
  spot_number text,
  user_id uuid,
  notes text default null
) returns boolean as $$
declare
  spot_id uuid;
begin
  select id into spot_id 
  from public.parking_spots 
  where parking_location_id = report_free_parking_spot.parking_location_id 
    and spot_number = report_free_parking_spot.spot_number;
  
  if found then
    return update_parking_spot_status(spot_id, 'available', user_id, 'user_report', notes);
  else
    insert into public.parking_spots (
      parking_location_id, spot_number, status, last_reported_by
    ) values (
      report_free_parking_spot.parking_location_id, report_free_parking_spot.spot_number, 'available', user_id
    );
    
    insert into public.parking_spot_status_history (
      parking_spot_id, user_id, old_status, new_status, change_reason, notes
    ) values (
      (select id from public.parking_spots where parking_location_id = report_free_parking_spot.parking_location_id and spot_number = report_free_parking_spot.spot_number),
      user_id, 'unknown', 'available', 'user_report', notes
    );
    
    return true;
  end if;
end;
$$ language plpgsql security definer;

-- 10. Creează funcția pentru obținerea statisticilor unei parcări
create or replace function get_parking_location_stats(parking_location_id uuid)
returns table (
  total_spots bigint,
  available_spots bigint,
  reserved_spots bigint,
  occupied_spots bigint
) as $$
begin
  return query
  select 
    count(*) as total_spots,
    count(*) filter (where status = 'available') as available_spots,
    count(*) filter (where status = 'reserved') as reserved_spots,
    count(*) filter (where status = 'occupied') as occupied_spots
  from public.parking_spots
  where parking_location_id = get_parking_location_stats.parking_location_id;
end;
$$ language plpgsql security definer;

-- 11. Creează trigger pentru actualizarea automată a updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_parking_spots_updated_at
  before update on public.parking_spots
  for each row
  execute function update_updated_at_column();

-- 12. Creează view pentru statisticile parcărilor (versiune simplificată)
create or replace view parking_locations_with_stats as
select 
  pl.id,
  pl.name,
  pl.address,
  pl.city,
  pl.district,
  pl.postal_code,
  pl.latitude,
  pl.longitude,
  pl.parking_type,
  pl.price_per_hour,
  pl.is_free,
  pl.is_24h,
  pl.description,
  pl.amenities,
  pl.created_at,
  pl.updated_at,
  coalesce(ps_stats.total_spots, 0) as total_spots,
  coalesce(ps_stats.available_spots, 0) as available_spots,
  coalesce(ps_stats.reserved_spots, 0) as reserved_spots,
  coalesce(ps_stats.occupied_spots, 0) as occupied_spots
from public.parking_locations pl
left join (
  select 
    parking_location_id,
    count(*) as total_spots,
    count(*) filter (where status = 'available') as available_spots,
    count(*) filter (where status = 'reserved') as reserved_spots,
    count(*) filter (where status = 'occupied') as occupied_spots
  from public.parking_spots
  group by parking_location_id
) ps_stats on pl.id = ps_stats.parking_location_id;

-- 13. View-ul este automat accesibil pentru toți utilizatorii
-- Nu este nevoie să activezi RLS pe view-uri în Supabase

-- 14. Inserează date de test pentru locurile de parcare
-- Folosește ON CONFLICT pentru a evita duplicatele

-- Parcare Centru Comercial (200 locuri)
insert into public.parking_spots (parking_location_id, spot_number, status, is_premium)
select 
  (select id from public.parking_locations where name = 'Parcare Centru Comercial'),
  'A' || num,
  case 
    when random() < 0.6 then 'available'
    when random() < 0.8 then 'reserved'
    else 'occupied'
  end,
  case when random() < 0.2 then true else false end
from generate_series(1, 50) as num
on conflict (parking_location_id, spot_number) do nothing;

insert into public.parking_spots (parking_location_id, spot_number, status, is_premium)
select 
  (select id from public.parking_locations where name = 'Parcare Centru Comercial'),
  'B' || num,
  case 
    when random() < 0.6 then 'available'
    when random() < 0.8 then 'reserved'
    else 'occupied'
  end,
  case when random() < 0.2 then true else false end
from generate_series(1, 50) as num
on conflict (parking_location_id, spot_number) do nothing;

insert into public.parking_spots (parking_location_id, spot_number, status, is_premium)
select 
  (select id from public.parking_locations where name = 'Parcare Centru Comercial'),
  'C' || num,
  case 
    when random() < 0.6 then 'available'
    when random() < 0.8 then 'reserved'
    else 'occupied'
  end,
  case when random() < 0.2 then true else false end
from generate_series(1, 50) as num
on conflict (parking_location_id, spot_number) do nothing;

insert into public.parking_spots (parking_location_id, spot_number, status, is_premium)
select 
  (select id from public.parking_locations where name = 'Parcare Centru Comercial'),
  'D' || num,
  case 
    when random() < 0.6 then 'available'
    when random() < 0.8 then 'reserved'
    else 'occupied'
  end,
  case when random() < 0.2 then true else false end
from generate_series(1, 50) as num
on conflict (parking_location_id, spot_number) do nothing;

-- Parcare Piața Unirii (150 locuri)
insert into public.parking_spots (parking_location_id, spot_number, status, is_premium)
select 
  (select id from public.parking_locations where name = 'Parcare Piața Unirii'),
  'A' || num,
  case 
    when random() < 0.5 then 'available'
    when random() < 0.8 then 'reserved'
    else 'occupied'
  end,
  case when random() < 0.3 then true else false end
from generate_series(1, 75) as num
on conflict (parking_location_id, spot_number) do nothing;

insert into public.parking_spots (parking_location_id, spot_number, status, is_premium)
select 
  (select id from public.parking_locations where name = 'Parcare Piața Unirii'),
  'B' || num,
  case 
    when random() < 0.5 then 'available'
    when random() < 0.8 then 'reserved'
    else 'occupied'
  end,
  case when random() < 0.3 then true else false end
from generate_series(1, 75) as num
on conflict (parking_location_id, spot_number) do nothing;

-- Parcare Gara de Nord (300 locuri)
insert into public.parking_spots (parking_location_id, spot_number, status, is_premium)
select 
  (select id from public.parking_locations where name = 'Parcare Gara de Nord'),
  'A' || num,
  case 
    when random() < 0.7 then 'available'
    when random() < 0.9 then 'reserved'
    else 'occupied'
  end,
  case when random() < 0.1 then true else false end
from generate_series(1, 100) as num
on conflict (parking_location_id, spot_number) do nothing;

insert into public.parking_spots (parking_location_id, spot_number, status, is_premium)
select 
  (select id from public.parking_locations where name = 'Parcare Gara de Nord'),
  'B' || num,
  case 
    when random() < 0.7 then 'available'
    when random() < 0.9 then 'reserved'
    else 'occupied'
  end,
  case when random() < 0.1 then true else false end
from generate_series(1, 100) as num
on conflict (parking_location_id, spot_number) do nothing;

insert into public.parking_spots (parking_location_id, spot_number, status, is_premium)
select 
  (select id from public.parking_locations where name = 'Parcare Gara de Nord'),
  'C' || num,
  case 
    when random() < 0.7 then 'available'
    when random() < 0.9 then 'reserved'
    else 'occupied'
  end,
  case when random() < 0.1 then true else false end
from generate_series(1, 100) as num
on conflict (parking_location_id, spot_number) do nothing;

-- Parcare Universitate (50 locuri)
insert into public.parking_spots (parking_location_id, spot_number, status, is_premium)
select 
  (select id from public.parking_locations where name = 'Parcare Universitate'),
  'A' || num,
  case 
    when random() < 0.4 then 'available'
    when random() < 0.7 then 'reserved'
    else 'occupied'
  end,
  case when random() < 0.4 then true else false end
from generate_series(1, 50) as num
on conflict (parking_location_id, spot_number) do nothing;

-- Parcare Pantelimon (30 locuri) - cu statusuri realiste
insert into public.parking_spots (parking_location_id, spot_number, status, is_premium)
select 
  (select id from public.parking_locations where name = 'Parcare Pantelimon'),
  'A' || num,
  case 
    when num <= 22 then 'available'
    when num <= 26 then 'reserved'
    else 'occupied'
  end,
  case when random() < 0.2 then true else false end
from generate_series(1, 30) as num
on conflict (parking_location_id, spot_number) do nothing;

-- 15. Verificări și teste
-- Verifică că toate tabelele au fost create și au date
-- Testează view-ul pentru a verifica că funcționează

-- Verifică că există date în parking_locations
-- SELECT COUNT(*) FROM public.parking_locations;

-- Verifică că există date în parking_spots
-- SELECT COUNT(*) FROM public.parking_spots;

-- Testează view-ul
-- SELECT * FROM parking_locations_with_stats LIMIT 5;

-- Verifică că funcțiile funcționează
-- SELECT get_parking_location_stats((SELECT id FROM public.parking_locations WHERE name = 'Parcare Pantelimon' LIMIT 1)); 