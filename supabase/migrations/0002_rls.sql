-- AMOS - Row Level Security policies
-- Model: staff (admin/manager/assistant) have full access.
--        artists can read only their own artist row and its child records.
-- Tighten further per-manager scoping in a later phase.

-- ============================================================
-- Helper functions (security definer to read profiles safely)
-- ============================================================
create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role in ('admin', 'manager', 'assistant')
  );
$$;

-- artist ids owned by the current user (artist logging into their own panel)
create or replace function my_artist_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from artists where profile_id = auth.uid();
$$;

-- ============================================================
-- Enable RLS
-- ============================================================
alter table profiles     enable row level security;
alter table artists      enable row level security;
alter table projects     enable row level security;
alter table tasks        enable row level security;
alter table weekly_plans enable row level security;
alter table daily_logs   enable row level security;
alter table meetings     enable row level security;
alter table outputs      enable row level security;
alter table services     enable row level security;

-- ============================================================
-- profiles
-- ============================================================
create policy profiles_self_read   on profiles for select using (id = auth.uid() or is_staff());
create policy profiles_self_update on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_staff_all   on profiles for all    using (is_staff()) with check (is_staff());

-- ============================================================
-- artists  (staff: all; artist: read own)
-- ============================================================
create policy artists_staff_all on artists for all using (is_staff()) with check (is_staff());
create policy artists_self_read on artists for select using (profile_id = auth.uid());

-- ============================================================
-- Child tables: staff full access; artist read-only on own rows
-- ============================================================
-- projects
create policy projects_staff_all on projects for all using (is_staff()) with check (is_staff());
create policy projects_self_read on projects for select using (artist_id in (select my_artist_ids()));

-- tasks
create policy tasks_staff_all on tasks for all using (is_staff()) with check (is_staff());
create policy tasks_self_read on tasks for select using (artist_id in (select my_artist_ids()));

-- weekly_plans
create policy weekly_staff_all on weekly_plans for all using (is_staff()) with check (is_staff());
create policy weekly_self_read on weekly_plans for select using (artist_id in (select my_artist_ids()));

-- daily_logs
create policy daily_staff_all on daily_logs for all using (is_staff()) with check (is_staff());
create policy daily_self_read on daily_logs for select using (artist_id in (select my_artist_ids()));

-- meetings
create policy meetings_staff_all on meetings for all using (is_staff()) with check (is_staff());
create policy meetings_self_read on meetings for select using (artist_id in (select my_artist_ids()));

-- outputs
create policy outputs_staff_all on outputs for all using (is_staff()) with check (is_staff());
create policy outputs_self_read on outputs for select using (artist_id in (select my_artist_ids()));

-- services
create policy services_staff_all on services for all using (is_staff()) with check (is_staff());
create policy services_self_read on services for select using (artist_id in (select my_artist_ids()));

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'artist');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
