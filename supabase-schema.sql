-- ============================================================
-- ALMA FOOD — Supabase Schema
-- Coller dans l'éditeur SQL de Supabase et exécuter
-- ============================================================

-- Table profiles (un profil par utilisateur)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text,
  app_type text default 'food',  -- 'food' | 'almaplus' | etc.
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Lecture profil" on public.profiles for select using (auth.uid() = id);
create policy "Modification profil" on public.profiles for update using (auth.uid() = id);

-- Trigger : créer le profil automatiquement à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Table food_data — stocke toutes les données de l'app food
-- Une ligne par (user, clé)
-- ============================================================
create table if not exists public.food_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  key text not null,
  value jsonb,
  updated_at timestamptz default now(),
  unique(user_id, key)
);

alter table public.food_data enable row level security;
create policy "Lecture food_data" on public.food_data
  for select using (auth.uid() = user_id);
create policy "Insertion food_data" on public.food_data
  for insert with check (auth.uid() = user_id);
create policy "Modification food_data" on public.food_data
  for update using (auth.uid() = user_id);
create policy "Suppression food_data" on public.food_data
  for delete using (auth.uid() = user_id);

-- Index pour les requêtes rapides
create index if not exists food_data_user_key on public.food_data(user_id, key);

-- ============================================================
-- CRÉER LE COMPTE DE JEAN-PHILIPPE
-- Exécuter APRÈS avoir configuré les variables d'env
-- Remplacer l'email et le mot de passe par les vrais
-- ============================================================

-- Option 1 : via l'interface Supabase
-- Authentication > Users > Invite user > jean-philippe@email.fr

-- Option 2 : via SQL (mot de passe temporaire, il devra le changer)
-- select * from auth.users; -- pour vérifier

-- ============================================================
-- VÉRIFICATIONS
-- ============================================================
-- select * from public.profiles;
-- select * from public.food_data limit 10;
-- select key, updated_at from public.food_data where user_id = 'UUID_DE_JEAN_PHILIPPE';
