-- Schema pentru funcționalitatea de comunitate

-- Tabela pentru postările comunității
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null,
  user_avatar text,
  message text not null,
  location text,
  post_type text not null check (post_type in ('info', 'warning', 'tip', 'question', 'general')),
  likes_count integer default 0,
  dislikes_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela pentru reacțiile utilizatorilor (emoticoane)
create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('like', 'dislike', 'heart', 'laugh', 'wow', 'sad', 'angry')),
  created_at timestamp with time zone default now(),
  
  -- Un utilizator poate avea o singură reacție per post
  unique(post_id, user_id)
);

-- Indexuri pentru performanță
create index if not exists community_posts_user_id_idx on public.community_posts(user_id);
create index if not exists community_posts_created_at_idx on public.community_posts(created_at desc);
create index if not exists community_posts_post_type_idx on public.community_posts(post_type);
create index if not exists post_reactions_post_id_idx on public.post_reactions(post_id);
create index if not exists post_reactions_user_id_idx on public.post_reactions(user_id);

-- Row Level Security (RLS)
alter table public.community_posts enable row level security;
alter table public.post_reactions enable row level security;

-- Politici pentru community_posts
create policy "Anyone can view community posts" on public.community_posts
  for select using (true);

create policy "Users can create their own posts" on public.community_posts
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own posts" on public.community_posts
  for update using (auth.uid() = user_id);

create policy "Users can delete their own posts" on public.community_posts
  for delete using (auth.uid() = user_id);

-- Politici pentru post_reactions
create policy "Anyone can view post reactions" on public.post_reactions
  for select using (true);

create policy "Users can create their own reactions" on public.post_reactions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own reactions" on public.post_reactions
  for update using (auth.uid() = user_id);

create policy "Users can delete their own reactions" on public.post_reactions
  for delete using (auth.uid() = user_id);

-- Funcție pentru actualizarea timestamp-ului updated_at
create or replace function public.update_community_posts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger pentru actualizarea automată a updated_at
create trigger update_community_posts_updated_at
  before update on public.community_posts
  for each row
  execute function public.update_community_posts_updated_at();

-- Funcție pentru a obține postările cu reacții
create or replace function public.get_community_posts_with_reactions()
returns table (
  id uuid,
  user_id uuid,
  user_name text,
  user_avatar text,
  message text,
  location text,
  post_type text,
  likes_count bigint,
  dislikes_count bigint,
  heart_count bigint,
  laugh_count bigint,
  wow_count bigint,
  sad_count bigint,
  angry_count bigint,
  user_reaction text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) as $$
begin
  return query
  select
    cp.id,
    cp.user_id,
    cp.user_name,
    cp.user_avatar,
    cp.message,
    cp.location,
    cp.post_type,
    (select count(*) from public.post_reactions pr where pr.post_id = cp.id and pr.reaction_type = 'like'),
    (select count(*) from public.post_reactions pr where pr.post_id = cp.id and pr.reaction_type = 'dislike'),
    (select count(*) from public.post_reactions pr where pr.post_id = cp.id and pr.reaction_type = 'heart'),
    (select count(*) from public.post_reactions pr where pr.post_id = cp.id and pr.reaction_type = 'laugh'),
    (select count(*) from public.post_reactions pr where pr.post_id = cp.id and pr.reaction_type = 'wow'),
    (select count(*) from public.post_reactions pr where pr.post_id = cp.id and pr.reaction_type = 'sad'),
    (select count(*) from public.post_reactions pr where pr.post_id = cp.id and pr.reaction_type = 'angry'),
    (select pr.reaction_type from public.post_reactions pr where pr.post_id = cp.id and pr.user_id = auth.uid() limit 1),
    cp.created_at,
    cp.updated_at
  from public.community_posts cp
  order by cp.created_at desc;
end;
$$ language plpgsql security definer;

-- Funcție pentru a adăuga/actualiza o reacție
create or replace function public.toggle_post_reaction(
  post_uuid uuid,
  reaction_type_param text
)
returns table (
  success boolean,
  message text,
  new_reaction_type text
) as $$
declare
  existing_reaction text;
  new_reaction text;
begin
  -- Verifică dacă utilizatorul este autentificat
  if auth.uid() is null then
    return query select false, 'Utilizatorul nu este autentificat'::text, null::text;
    return;
  end if;

  -- Verifică dacă post-ul există
  if not exists (select 1 from public.community_posts where id = post_uuid) then
    return query select false, 'Post-ul nu există'::text, null::text;
    return;
  end if;

  -- Obține reacția existentă
  select pr.reaction_type into existing_reaction
  from public.post_reactions pr
  where pr.post_id = post_uuid and pr.user_id = auth.uid();

  -- Dacă aceeași reacție, o șterge (toggle off)
  if existing_reaction = reaction_type_param then
    delete from public.post_reactions
    where post_id = post_uuid and user_id = auth.uid();
    
    new_reaction := null;
  else
    -- Dacă reacție diferită, o actualizează
    if existing_reaction is not null then
      update public.post_reactions
      set reaction_type = reaction_type_param,
          created_at = now()
      where post_id = post_uuid and user_id = auth.uid();
    else
      -- Dacă nu există reacție, o creează
      insert into public.post_reactions (post_id, user_id, reaction_type)
      values (post_uuid, auth.uid(), reaction_type_param);
    end if;
    
    new_reaction := reaction_type_param;
  end if;

  return query select true, 'Reacția a fost actualizată cu succes'::text, new_reaction;
end;
$$ language plpgsql security definer; 