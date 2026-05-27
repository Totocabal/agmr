create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prenom text not null,
  nom text not null,
  email text not null,
  sujet text not null,
  message text not null,
  source text not null default 'site_web',
  status text not null default 'new',
  user_agent text
);

alter table public.contact_messages enable row level security;

drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
on public.contact_messages
for insert
to anon
with check (
  source = 'site_web'
  and status = 'new'
  and length(prenom) between 1 and 80
  and length(nom) between 1 and 80
  and length(email) between 3 and 160
  and length(message) between 1 and 3000
);

drop policy if exists "Authenticated users can read contact messages" on public.contact_messages;
create policy "Authenticated users can read contact messages"
on public.contact_messages
for select
to authenticated
using (true);
