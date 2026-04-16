create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lovefy-photos',
  'lovefy-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.lovefy_drafts (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null,
  status text not null default 'draft' check (status in ('draft', 'paid', 'published', 'expired')),
  sender_name text,
  recipient_name text,
  message text,
  music_id text,
  special_date date,
  published_slug text unique,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lovefy_photos (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.lovefy_drafts(id) on delete cascade,
  storage_path text not null unique,
  original_file_name text,
  mime_type text not null,
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 5242880),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists lovefy_photos_draft_id_idx on public.lovefy_photos(draft_id);
create index if not exists lovefy_drafts_cleanup_idx on public.lovefy_drafts(status, created_at, expires_at);

alter table public.lovefy_drafts enable row level security;
alter table public.lovefy_photos enable row level security;

drop policy if exists "service role manages lovefy drafts" on public.lovefy_drafts;
create policy "service role manages lovefy drafts"
on public.lovefy_drafts
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "service role manages lovefy photos" on public.lovefy_photos;
create policy "service role manages lovefy photos"
on public.lovefy_photos
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "service role manages lovefy storage" on storage.objects;
create policy "service role manages lovefy storage"
on storage.objects
for all
using (bucket_id = 'lovefy-photos' and auth.role() = 'service_role')
with check (bucket_id = 'lovefy-photos' and auth.role() = 'service_role');
