// Shared read helpers used by multiple screens (dropdowns, lists).
import { createClient } from "@/lib/supabase/server";

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
