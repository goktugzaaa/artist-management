-- AMOS (Artist Management OS) - Initial schema
-- MVP scope: profiles, artists, projects, tasks, weekly_plans, daily_logs,
--            meetings, outputs, services. RLS enabled from day one.
-- Identifiers in English; domain content stored in Turkish.

-- ============================================================
-- Enums
-- ============================================================
create type user_role        as enum ('admin', 'manager', 'assistant', 'artist');
create type priority_level   as enum ('low', 'medium', 'high', 'urgent');
create type project_status   as enum ('planned', 'active', 'on_hold', 'done', 'cancelled');
create type task_status      as enum ('todo', 'in_progress', 'blocked', 'done');
create type task_owner       as enum ('self', 'with_manager', 'service');   -- solo / Sirma ile / dis hizmet
create type plan_status      as enum ('planned', 'on_track', 'at_risk', 'done');
create type output_type      as enum ('portfolio', 'cv', 'statement', 'exhibition_file', 'price_list', 'photo', 'video', 'press');
create type service_type     as enum ('photography', 'graphic_design', 'web', 'framing', 'shipping', 'catalog', 'pr', 'printing', 'other');
create type service_status   as enum ('requested', 'in_progress', 'delivered', 'paid', 'cancelled');

-- ============================================================
-- profiles  (1:1 with auth.users)
-- ============================================================
create table profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  role        user_role not null default 'artist',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- artists
-- ============================================================
create table artists (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid references profiles (id) on delete set null,  -- artist's own login, if any
  manager_id       uuid references profiles (id) on delete set null,  -- responsible manager
  name             text not null,
  email            text,
  phone            text,
  specialty        text,
  working_style    text,
  motivation       text,
  production_cycle text,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ============================================================
-- projects
-- ============================================================
create table projects (
  id          uuid primary key default gen_random_uuid(),
  artist_id   uuid not null references artists (id) on delete cascade,
  name        text not null,
  description text,
  status      project_status not null default 'planned',
  priority    priority_level not null default 'medium',
  deadline    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- tasks
-- ============================================================
create table tasks (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid references projects (id) on delete cascade,
  artist_id       uuid not null references artists (id) on delete cascade,
  title           text not null,
  description     text,
  status          task_status not null default 'todo',
  priority        priority_level not null default 'medium',
  owner           task_owner not null default 'self',
  due_date        date,
  next_micro_step text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- weekly_plans  (sprint)
-- ============================================================
create table weekly_plans (
  id            uuid primary key default gen_random_uuid(),
  artist_id     uuid not null references artists (id) on delete cascade,
  week_start    date not null,
  focus         text,
  planned_hours numeric(5,1) not null default 0,
  actual_hours  numeric(5,1) not null default 0,
  status        plan_status not null default 'planned',
  review        text,
  created_at    timestamptz not null default now(),
  unique (artist_id, week_start)
);

-- ============================================================
-- daily_logs
-- ============================================================
create table daily_logs (
  id              uuid primary key default gen_random_uuid(),
  artist_id       uuid not null references artists (id) on delete cascade,
  project_id      uuid references projects (id) on delete set null,
  log_date        date not null default current_date,
  hours           numeric(4,1) not null default 0,
  done            text,
  todo            text,
  blockers        text,
  owner           task_owner not null default 'self',
  status          task_status not null default 'in_progress',
  priority        priority_level not null default 'medium',
  next_micro_step text,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- meetings
-- ============================================================
create table meetings (
  id           uuid primary key default gen_random_uuid(),
  artist_id    uuid not null references artists (id) on delete cascade,
  project_id   uuid references projects (id) on delete set null,
  meeting_date date not null default current_date,
  decisions    text,
  comments     text,
  mood         text,        -- sanatcinin duygusal durumu
  next_action  text,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- outputs
-- ============================================================
create table outputs (
  id         uuid primary key default gen_random_uuid(),
  artist_id  uuid not null references artists (id) on delete cascade,
  project_id uuid references projects (id) on delete set null,
  type       output_type not null,
  title      text not null,
  status     task_status not null default 'todo',
  link       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- services  (external services)
-- ============================================================
create table services (
  id             uuid primary key default gen_random_uuid(),
  artist_id      uuid not null references artists (id) on delete cascade,
  project_id     uuid references projects (id) on delete set null,
  type           service_type not null,
  vendor         text,
  budget         numeric(10,2) not null default 0,
  status         service_status not null default 'requested',
  delivery_date  date,
  invoice_status text,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_artists_manager   on artists (manager_id);
create index idx_projects_artist   on projects (artist_id);
create index idx_tasks_project     on tasks (project_id);
create index idx_tasks_artist      on tasks (artist_id);
create index idx_weekly_artist     on weekly_plans (artist_id);
create index idx_daily_artist_date on daily_logs (artist_id, log_date);
create index idx_meetings_artist   on meetings (artist_id);
create index idx_outputs_artist    on outputs (artist_id);
create index idx_services_artist   on services (artist_id);
