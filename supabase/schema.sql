-- Q-SENSE MVP schema for Supabase / PostgreSQL
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'student' check (role in ('student','instructor','admin')),
  created_at timestamptz not null default now()
);

create table if not exists learning_modules (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  description text,
  difficulty text,
  created_at timestamptz not null default now()
);

create table if not exists learner_progress (
  user_id uuid references profiles(id) on delete cascade,
  module_id bigint references learning_modules(id) on delete cascade,
  progress numeric not null default 0,
  completed_at timestamptz,
  primary key(user_id,module_id)
);

create table if not exists circuits (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete set null,
  name text not null,
  framework text not null default 'qiskit',
  gates jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists simulation_runs (
  id bigint generated always as identity primary key,
  circuit_id bigint references circuits(id) on delete cascade,
  backend text not null,
  shots integer not null,
  probabilities jsonb,
  statevector jsonb,
  created_at timestamptz not null default now()
);

create table if not exists challenges (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  difficulty text not null,
  xp integer not null default 0,
  prompt text not null
);

create table if not exists challenge_attempts (
  id bigint generated always as identity primary key,
  challenge_id bigint references challenges(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  circuit jsonb,
  score numeric,
  passed boolean,
  created_at timestamptz not null default now()
);
