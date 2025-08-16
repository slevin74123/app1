-- Schema simplificată pentru tabela de parcare
-- Această versiune nu necesită extensia earthdistance

-- 1. Șterge tabela existentă dacă există (pentru a evita conflictele)
drop table if exists public.parking_locations cascade;

-- 2. Creează tabela de parcare
create table public.parking_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  district text,
  postal_code text,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  parking_type text not null check (parking_type in ('street', 'garage', 'lot', 'underground')),
  total_spots integer,
  available_spots integer,
  price_per_hour numeric(8, 2),
  is_free boolean default false,
  is_24h boolean default false,
  description text,
  amenities text[], -- ['covered', 'security', 'lighting', 'disabled_access']
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. Creează indexurile pentru performanță (fără index geografic)
create index parking_locations_name_idx on public.parking_locations using gin(to_tsvector('romanian', name));
create index parking_locations_address_idx on public.parking_locations using gin(to_tsvector('romanian', address));
create index parking_locations_city_idx on public.parking_locations(city);
create index parking_locations_district_idx on public.parking_locations(district);
create index parking_locations_parking_type_idx on public.parking_locations(parking_type);
create index parking_locations_lat_idx on public.parking_locations(latitude);
create index parking_locations_lng_idx on public.parking_locations(longitude);

-- 4. Activează Row Level Security (RLS)
alter table public.parking_locations enable row level security;

-- 5. Creează politicile de securitate
create policy "Anyone can view parking locations" on public.parking_locations
  for select using (true);

create policy "Authenticated users can create parking locations" on public.parking_locations
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update parking locations" on public.parking_locations
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete parking locations" on public.parking_locations
  for delete using (auth.role() = 'authenticated');

-- 6. Creează funcția pentru actualizarea timestamp-ului updated_at
create or replace function public.update_parking_locations_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 7. Creează trigger-ul
create trigger update_parking_locations_updated_at
  before update on public.parking_locations
  for each row
  execute function public.update_parking_locations_updated_at();

-- 8. Creează funcția de search pentru autocomplete
create or replace function public.search_parking_locations(search_term text, limit_count integer default 10)
returns table (
  id uuid,
  name text,
  address text,
  city text,
  district text,
  parking_type text,
  total_spots integer,
  available_spots integer,
  price_per_hour numeric,
  is_free boolean,
  is_24h boolean,
  description text,
  amenities text[],
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) as $$
begin
  return query
  select 
    pl.id,
    pl.name,
    pl.address,
    pl.city,
    pl.district,
    pl.parking_type,
    pl.total_spots,
    pl.available_spots,
    pl.price_per_hour,
    pl.is_free,
    pl.is_24h,
    pl.description,
    pl.amenities,
    pl.created_at,
    pl.updated_at
  from public.parking_locations pl
  where 
    to_tsvector('romanian', pl.name || ' ' || pl.address || ' ' || pl.city || ' ' || coalesce(pl.district, '')) @@ plainto_tsquery('romanian', search_term)
    or pl.name ilike '%' || search_term || '%'
    or pl.address ilike '%' || search_term || '%'
    or pl.city ilike '%' || search_term || '%'
    or pl.district ilike '%' || search_term || '%'
  order by 
    case 
      when pl.name ilike search_term || '%' then 1
      when pl.name ilike '%' || search_term || '%' then 2
      when pl.address ilike search_term || '%' then 3
      when pl.city ilike search_term || '%' then 4
      else 5
    end,
    pl.name
  limit limit_count;
end;
$$ language plpgsql security definer;

-- 9. Inserează date de test pentru parcare
insert into public.parking_locations (name, address, city, district, parking_type, total_spots, available_spots, price_per_hour, is_free, is_24h, description, amenities) values
('Parcare Centru Comercial', 'Strada Republicii 15', 'București', 'Centru', 'garage', 200, 45, 5.00, false, true, 'Parcare subterană cu acces direct în centrul comercial', ARRAY['covered', 'security', 'lighting', 'disabled_access']),
('Parcare Piața Unirii', 'Piața Unirii 1', 'București', 'Centru', 'lot', 150, 23, 3.50, false, true, 'Parcare deschisă în centrul orașului', ARRAY['lighting', 'security']),
('Parcare Gara de Nord', 'Bulevardul Garii de Nord 1', 'București', 'Gara de Nord', 'garage', 300, 67, 4.00, false, true, 'Parcare mare pentru călători', ARRAY['covered', 'security', 'lighting', 'disabled_access', '24h']),
('Parcare Universitate', 'Strada Universității 10', 'București', 'Centru', 'street', 50, 12, 2.50, false, false, 'Parcare stradală lângă universitate', ARRAY['lighting']),
('Parcare Mall Băneasa', 'Șoseaua Chitilei 283', 'București', 'Băneasa', 'garage', 400, 89, 6.00, false, true, 'Parcare subterană mall', ARRAY['covered', 'security', 'lighting', 'disabled_access']),
('Parcare Herăstrău', 'Șoseaua Nordului 1', 'București', 'Herăstrău', 'lot', 120, 34, 3.00, false, true, 'Parcare lângă lacul Herăstrău', ARRAY['lighting', 'security']),
('Parcare Tineretului', 'Bulevardul Tineretului 1', 'București', 'Tineretului', 'street', 80, 25, 2.00, false, false, 'Parcare stradală în parcul Tineretului', ARRAY['lighting']),
('Parcare Titan', 'Bulevardul Titan 1', 'București', 'Titan', 'garage', 250, 56, 4.50, false, true, 'Parcare subterană în centrul Titan', ARRAY['covered', 'security', 'lighting', 'disabled_access']),
('Parcare Militari', 'Bulevardul Iuliu Maniu 1', 'București', 'Militari', 'lot', 180, 42, 3.00, false, true, 'Parcare deschisă în Militari', ARRAY['lighting', 'security']),
('Parcare Drumul Taberei', 'Strada Drumul Taberei 1', 'București', 'Drumul Taberei', 'street', 60, 18, 2.00, false, false, 'Parcare stradală în Drumul Taberei', ARRAY['lighting']);

-- 10. Mesaj de confirmare
do $$
begin
  raise notice 'Schema simplificată de parcare creată cu succes!';
  raise notice 'Tabela: parking_locations cu % rânduri de test', (select count(*) from public.parking_locations);
  raise notice 'Indexurile și politicile de securitate au fost create';
  raise notice 'Funcția de search pentru autocomplete este activă';
  raise notice 'NOTĂ: Această versiune nu include indexul geografic (earthdistance)';
end $$; 