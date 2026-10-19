import { parseProjects } from "@/services";
import { Profile, Project } from "@/types";
import type { ProjectRowWithDomains } from "@/services/supabase-service";
import snapshot from "./snapshot.json";

// Build-time copy of the Supabase content (scripts/snapshot-content.mjs).
// Screens render from it immediately and refresh from Supabase afterwards.
const snapshotProjects: Project[] = parseProjects(
  snapshot.projects as unknown as ProjectRowWithDomains[],
);
const snapshotProfile = snapshot.profile as unknown as Profile | null;

export { snapshotProjects, snapshotProfile };
