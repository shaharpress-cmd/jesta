-- Jesta (ג'סטה) — optional Supabase schema for later
-- Platform is intermediary only; no payments.

create extension if not exists "uuid-ossp";

create type public.category_id as enum (
  'fuel', 'moving', 'home', 'errands', 'garden', 'pets', 'digital', 'neighborhood', 'other'
);

create type public.urgency as enum ('now', 'today', 'flexible');
create type public.jesta_status as enum ('open', 'in_progress', 'done', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  avatar_url text,
  rating numeric(3,2) default 5.0,
  rating_count int default 0,
  verified_basic boolean default false, -- מאומת בסיסית — NOT "safe"
  bio text,
  tags text[] default '{}',
  given_count int default 0,
  requested_count int default 0,
  avg_response_min int default 0,
  help_categories category_id[] default '{}',
  last_seen_at timestamptz default now(),
  terms_accepted_at timestamptz,
  created_at timestamptz default now()
);

create table public.jestas (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category category_id not null,
  author_id uuid not null references public.profiles(id),
  location_label text not null, -- general area only
  lat double precision,
  lng double precision,
  urgency urgency not null default 'flexible',
  status jesta_status not null default 'open',
  created_at timestamptz default now()
);

create table public.offers (
  id uuid primary key default uuid_generate_v4(),
  jesta_id uuid not null references public.jestas(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  message text,
  created_at timestamptz default now(),
  unique (jesta_id, user_id)
);

create table public.chat_threads (
  id uuid primary key default uuid_generate_v4(),
  jesta_id uuid not null references public.jestas(id) on delete cascade,
  participant_a uuid not null references public.profiles(id),
  participant_b uuid not null references public.profiles(id),
  last_message_at timestamptz default now(),
  created_at timestamptz default now()
);

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

create table public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references public.profiles(id),
  jesta_id uuid references public.jestas(id),
  reported_user_id uuid references public.profiles(id),
  reason text not null,
  created_at timestamptz default now()
);

-- RLS stubs (enable when connecting Supabase)
alter table public.profiles enable row level security;
alter table public.jestas enable row level security;
alter table public.offers enable row level security;
alter table public.chat_threads enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;

-- Basic RLS policies (MVP — tighten later)
-- profiles: anyone can read; users update own
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- jestas: public read open; authors write
create policy "jestas_select_all" on public.jestas for select using (true);
create policy "jestas_insert_auth" on public.jestas for insert with check (auth.uid() = author_id);
create policy "jestas_update_author" on public.jestas for update using (auth.uid() = author_id);

-- offers
create policy "offers_select_all" on public.offers for select using (true);
create policy "offers_insert_auth" on public.offers for insert with check (auth.uid() = user_id);

-- chat: participants only
create policy "threads_select_part" on public.chat_threads for select using (auth.uid() = participant_a or auth.uid() = participant_b);
create policy "threads_insert_part" on public.chat_threads for insert with check (auth.uid() = participant_a or auth.uid() = participant_b);
create policy "messages_select_part" on public.messages for select using (
  exists (select 1 from public.chat_threads t where t.id = thread_id and (t.participant_a = auth.uid() or t.participant_b = auth.uid()))
);
create policy "messages_insert_sender" on public.messages for insert with check (
  auth.uid() = sender_id and exists (
    select 1 from public.chat_threads t where t.id = thread_id and (t.participant_a = auth.uid() or t.participant_b = auth.uid())
  )
);

-- reports: insert own
create policy "reports_insert_own" on public.reports for insert with check (auth.uid() = reporter_id);

-- Auto-create profile on auth.users insert (safe re-run)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url, verified_basic)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1),
      'משתמש Google'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    ),
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
