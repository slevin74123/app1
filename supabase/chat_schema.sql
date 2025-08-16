-- Schema pentru funcționalitatea de chat comun

-- Tabela pentru mesajele de chat
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null,
  user_avatar text,
  message text not null,
  message_type text not null check (message_type in ('text', 'info', 'warning', 'tip')),
  is_edited boolean default false,
  edited_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela pentru reacțiile la mesaje (like, heart, etc.)
create table if not exists public.message_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.chat_messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('like', 'heart', 'laugh', 'wow', 'sad', 'angry')),
  created_at timestamp with time zone default now(),
  
  -- Un utilizator poate avea o singură reacție per mesaj
  unique(message_id, user_id)
);

-- Tabela pentru utilizatorii online în chat
create table if not exists public.chat_online_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null,
  user_avatar text,
  last_seen timestamp with time zone default now(),
  is_typing boolean default false,
  typing_started_at timestamp with time zone,
  
  -- Un utilizator poate fi online o singură dată
  unique(user_id)
);

-- Indexuri pentru performanță
create index if not exists chat_messages_created_at_idx on public.chat_messages(created_at desc);
create index if not exists chat_messages_user_id_idx on public.chat_messages(user_id);
create index if not exists chat_messages_message_type_idx on public.chat_messages(message_type);
create index if not exists message_reactions_message_id_idx on public.message_reactions(message_id);
create index if not exists message_reactions_user_id_idx on public.message_reactions(user_id);
create index if not exists chat_online_users_last_seen_idx on public.chat_online_users(last_seen desc);

-- Row Level Security (RLS)
alter table public.chat_messages enable row level security;
alter table public.message_reactions enable row level security;
alter table public.chat_online_users enable row level security;

-- Politici pentru chat_messages
create policy "Anyone can view chat messages" on public.chat_messages
  for select using (true);

create policy "Users can create their own messages" on public.chat_messages
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own messages" on public.chat_messages
  for update using (auth.uid() = user_id);

create policy "Users can delete their own messages" on public.chat_messages
  for delete using (auth.uid() = user_id);

-- Politici pentru message_reactions
create policy "Anyone can view message reactions" on public.message_reactions
  for select using (true);

create policy "Users can create their own reactions" on public.message_reactions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own reactions" on public.message_reactions
  for update using (auth.uid() = user_id);

create policy "Users can delete their own reactions" on public.message_reactions
  for delete using (auth.uid() = user_id);

-- Politici pentru chat_online_users
create policy "Anyone can view online users" on public.chat_online_users
  for select using (true);

create policy "Users can manage their own online status" on public.chat_online_users
  for all using (auth.uid() = user_id);

-- Funcție pentru actualizarea timestamp-ului updated_at
create or replace function public.update_chat_messages_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger pentru actualizarea automată a updated_at
create trigger update_chat_messages_updated_at
  before update on public.chat_messages
  for each row
  execute function public.update_chat_messages_updated_at();

-- Funcție simplificată pentru a obține mesajele de chat cu reacții (fără user_reaction)
create or replace function public.get_chat_messages_with_reactions()
returns table (
  id uuid,
  user_id uuid,
  user_name text,
  user_avatar text,
  message text,
  message_type text,
  is_edited boolean,
  edited_at timestamp with time zone,
  likes_count bigint,
  heart_count bigint,
  laugh_count bigint,
  wow_count bigint,
  sad_count bigint,
  angry_count bigint,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) as $$
begin
  return query
  select
    cm.id,
    cm.user_id,
    cm.user_name,
    cm.user_avatar,
    cm.message,
    cm.message_type,
    cm.is_edited,
    cm.edited_at,
    (select count(*) from public.message_reactions mr where mr.message_id = cm.id and mr.reaction_type = 'like'),
    (select count(*) from public.message_reactions mr where mr.message_id = cm.id and mr.reaction_type = 'heart'),
    (select count(*) from public.message_reactions mr where mr.message_id = cm.id and mr.reaction_type = 'laugh'),
    (select count(*) from public.message_reactions mr where mr.message_id = cm.id and mr.reaction_type = 'wow'),
    (select count(*) from public.message_reactions mr where mr.message_id = cm.id and mr.reaction_type = 'sad'),
    (select count(*) from public.message_reactions mr where mr.message_id = cm.id and mr.reaction_type = 'angry'),
    cm.created_at,
    cm.updated_at
  from public.chat_messages cm
  order by cm.created_at asc;
end;
$$ language plpgsql security definer;

-- Funcție pentru a obține reacția unui utilizator la un mesaj specific
create or replace function public.get_user_reaction_for_message(
  message_uuid uuid,
  user_uuid uuid
)
returns table (
  reaction_type text
) as $$
begin
  return query
  select mr.reaction_type
  from public.message_reactions mr
  where mr.message_id = message_uuid and mr.user_id = user_uuid
  limit 1;
end;
$$ language plpgsql security definer;

-- Funcție pentru a obține utilizatorii online
create or replace function public.get_online_users()
returns table (
  id uuid,
  user_id uuid,
  user_name text,
  user_avatar text,
  last_seen timestamp with time zone,
  is_typing boolean,
  typing_started_at timestamp with time zone
) as $$
begin
  return query
  select
    cou.id,
    cou.user_id,
    cou.user_name,
    cou.user_avatar,
    cou.last_seen,
    cou.is_typing,
    cou.typing_started_at
  from public.chat_online_users cou
  where cou.last_seen > now() - interval '5 minutes'
  order by cou.last_seen desc;
end;
$$ language plpgsql security definer;

-- Funcție pentru a actualiza statusul online al unui utilizator
create or replace function public.update_user_online_status(
  user_name_param text,
  user_avatar_param text default null
)
returns table (
  success boolean,
  message text
) as $$
begin
  -- Verifică dacă utilizatorul este autentificat
  if auth.uid() is null then
    return query select false, 'Utilizatorul nu este autentificat'::text;
    return;
  end if;

  -- Inserează sau actualizează statusul online
  insert into public.chat_online_users (user_id, user_name, user_avatar, last_seen)
  values (auth.uid(), user_name_param, user_avatar_param, now())
  on conflict (user_id) do update set
    user_name = excluded.user_name,
    user_avatar = excluded.user_avatar,
    last_seen = now(),
    is_typing = false,
    typing_started_at = null;

  return query select true, 'Status online actualizat cu succes'::text;
end;
$$ language plpgsql security definer;

-- Funcție pentru a seta statusul de typing
create or replace function public.set_typing_status(
  is_typing_param boolean
)
returns table (
  success boolean,
  message text
) as $$
begin
  -- Verifică dacă utilizatorul este autentificat
  if auth.uid() is null then
    return query select false, 'Utilizatorul nu este autentificat'::text;
    return;
  end if;

  -- Actualizează statusul de typing
  update public.chat_online_users
  set 
    is_typing = is_typing_param,
    typing_started_at = case when is_typing_param then now() else null end,
    last_seen = now()
  where user_id = auth.uid();

  if found then
    return query select true, 'Status typing actualizat cu succes'::text;
  else
    return query select false, 'Utilizatorul nu este online'::text;
  end if;
end;
$$ language plpgsql security definer;

-- Funcție pentru a adăuga/actualiza o reacție la un mesaj
create or replace function public.toggle_message_reaction(
  message_uuid uuid,
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

  -- Verifică dacă mesajul există
  if not exists (select 1 from public.chat_messages where id = message_uuid) then
    return query select false, 'Mesajul nu există'::text, null::text;
    return;
  end if;

  -- Obține reacția existentă
  select mr.reaction_type into existing_reaction
  from public.message_reactions mr
  where mr.message_id = message_uuid and mr.user_id = auth.uid();

  -- Dacă aceeași reacție, o șterge (toggle off)
  if existing_reaction = reaction_type_param then
    delete from public.message_reactions
    where message_id = message_uuid and user_id = auth.uid();
    
    new_reaction := null;
  else
    -- Dacă reacție diferită, o actualizează
    if existing_reaction is not null then
      update public.message_reactions
      set reaction_type = reaction_type_param
      where message_id = message_uuid and user_id = auth.uid();
    else
      -- Dacă nu există reacție, o creează
      insert into public.message_reactions (message_id, user_id, reaction_type)
      values (message_uuid, auth.uid(), reaction_type_param);
    end if;
    
    new_reaction := reaction_type_param;
  end if;

  return query select true, 'Reacția a fost actualizată cu succes'::text, new_reaction;
end;
$$ language plpgsql security definer;

-- Funcție pentru a edita un mesaj
create or replace function public.edit_chat_message(
  message_uuid uuid,
  new_message text
)
returns table (
  success boolean,
  message text
) as $$
begin
  -- Verifică dacă utilizatorul este autentificat
  if auth.uid() is null then
    return query select false, 'Utilizatorul nu este autentificat'::text;
    return;
  end if;

  -- Verifică dacă mesajul există și aparține utilizatorului
  if not exists (select 1 from public.chat_messages where id = message_uuid and user_id = auth.uid()) then
    return query select false, 'Mesajul nu există sau nu îți aparține'::text;
    return;
  end if;

  -- Actualizează mesajul
  update public.chat_messages
  set 
    message = new_message,
    is_edited = true,
    edited_at = now(),
    updated_at = now()
  where id = message_uuid and user_id = auth.uid();

  return query select true, 'Mesajul a fost editat cu succes'::text;
end;
$$ language plpgsql security definer; 