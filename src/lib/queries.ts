// Shared read helpers used by multiple screens (dropdowns, lists).
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoArtists, demoProjects } from "@/lib/demo";

export interface ArtistLite {
  id: string;
  name: string;
}
export interface ProjectLite {
  id: string;
  name: string;
  artist_id: string;
}

export async function getArtistsLite(): Promise<ArtistLite[]> {
  if (!isSupabaseConfigured()) {
    return demoArtists.map((a) => ({ id: a.id, name: a.name }));
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("artists")
      .select("id, name")
      .order("name");
    return (data as ArtistLite[]) ?? [];
  } catch {
    return [];
  }
}

export async function getProjectsLite(): Promise<ProjectLite[]> {
  if (!isSupabaseConfigured()) {
    return demoProjects.map((p) => ({ id: p.id, name: p.name, artist_id: p.artist_id }));
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("id, name, artist_id")
      .order("name");
    return (data as ProjectLite[]) ?? [];
  } catch {
    return [];
  }
}
