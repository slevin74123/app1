-- Schema simplificată pentru funcționalitatea de chat comun

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