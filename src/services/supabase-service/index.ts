import { Image } from "expo-image";
import { getSupabase, slugify } from "@/util";
import { Database, Domain, Profile, Project } from "@/types";

// Also used by scripts/snapshot-content.mjs, keep the two in sync.
const DOMAINS_SELECT = "*, project_domains(domains(id, title, icon))";

function prefetchImages(urls: string[]) {
  const validUrls = urls.filter((url) => url !== "");
  if (validUrls.length > 0) {
    Image.prefetch(validUrls).catch(() => {});
  }
}

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectRowWithDomains = ProjectRow & { project_domains: { domains: Domain }[] };

async function runQuery<T>(
  query: PromiseLike<{ data: T; error: unknown }>,
  fallbackMessage: string,
): Promise<T> {
  try {
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(fallbackMessage, error);
    throw new Error(fallbackMessage);
  }
}

function withFlattenedDomains<T extends { project_domains: { domains: Domain }[] }>(project: T) {
  const { project_domains, ...rest } = project;
  return { ...rest, domains: project_domains.map((pd) => pd.domains) };
}

function toProject(row: ProjectRow & { domains: Domain[] }): Project {
  const title = row.title ?? "";
  return {
    id: row.id,
    slug: row.slug ?? slugify(title),
    title,
    role: row.role ?? "",
    period: row.period ?? "",
    highlight: row.highlight ?? "",
    banner_url: row.banner_url ?? "",
    banner_alt: row.banner_alt ?? "",
    images: row.images ?? [],
    short_description: row.short_description ?? "",
    long_description: row.long_description ?? "",
    tools_technologies: row.tools_technologies ?? [],
    non_technical_contributions: row.non_technical_contributions ?? [],
    techical_contributions: row.techical_contributions ?? [],
    github: row.github ?? "",
    app_store_url: row.app_store_url ?? "",
    play_store_url: row.play_store_url ?? "",
    domains: row.domains,
  };
}

function parseProjects(rows: ProjectRowWithDomains[] | null): Project[] {
  return (rows ?? []).map(withFlattenedDomains).map(toProject);
}

async function getProjects(): Promise<Project[]> {
  const rows = await runQuery(
    getSupabase().from("projects").select(DOMAINS_SELECT).order("created_at", { ascending: false }),
    "There was an issue with fetching the projects, please try again later!",
  );
  const projects = parseProjects(rows);
  prefetchImages(projects.map((project) => project.banner_url));
  return projects;
}

async function getProfile(): Promise<Profile> {
  const fallbackMessage =
    "There was an issue with fetching the developer profile, please try again later!";
  const profile = await runQuery(
    getSupabase().from("profile").select("*").single(),
    fallbackMessage,
  );
  if (!profile) throw new Error(fallbackMessage);
  return profile;
}

export { getProjects, getProfile, parseProjects };
export type { ProjectRowWithDomains };
