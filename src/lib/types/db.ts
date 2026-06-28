// Hand-written domain types mirroring supabase/migrations.
// Replace with generated types via:
//   supabase gen types typescript --project-id <id> > src/lib/types/db.ts

export type UserRole = "admin" | "manager" | "assistant" | "artist";
export type Priority = "low" | "medium" | "high" | "urgent";
export type ProjectStatus = "planned" | "active" | "on_hold" | "done" | "cancelled";
export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";
export type TaskOwner = "self" | "with_manager" | "service";
export type PlanStatus = "planned" | "on_track" | "at_risk" | "done";
export type OutputType =
  | "portfolio" | "cv" | "statement" | "exhibition_file"
  | "price_list" | "photo" | "video" | "press";
export type ServiceType =
  | "photography" | "graphic_design" | "web" | "framing"
  | "shipping" | "catalog" | "pr" | "printing" | "other";
export type ServiceStatus =
  | "requested" | "in_progress" | "delivered" | "paid" | "cancelled";

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Artist {
  id: string;
  profile_id: string | null;
  manager_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  specialty: string | null;
  working_style: string | null;
  motivation: string | null;
  production_cycle: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  artist_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface WeeklyPlan {
  id: string;
  artist_id: string;
  week_start: string;
  focus: string | null;
  planned_hours: number;
  actual_hours: number;
  status: PlanStatus;
  review: string | null;
  created_at: string;
}

export interface DailyLog {
  id: string;
  artist_id: string;
  project_id: string | null;
  log_date: string;
  hours: number;
  done: string | null;
  todo: string | null;
  blockers: string | null;
  owner: TaskOwner;
  status: TaskStatus;
  priority: Priority;
  next_micro_step: string | null;
  created_at: string;
}
