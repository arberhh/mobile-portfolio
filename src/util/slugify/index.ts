// Mirrors the backfill in 20261019180000_add_project_meta_and_profile_headline.sql,
// so a project without a stored slug still gets the URL it will have once
// the migration runs.
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
