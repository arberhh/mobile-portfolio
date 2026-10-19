// Runs after `expo export --platform web` (static output) for GitHub Pages:
// - copies the router's not-found page to 404.html, which Pages serves for
//   unknown paths;
// - writes sitemap.xml from the content snapshot (same slugs the export
//   pre-rendered) and points robots.txt at it.
import { copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const app = JSON.parse(readFileSync(join(root, "app.json"), "utf8")).expo;
const siteUrl = `https://arberhh.github.io${app.experiments.baseUrl}`;

const notFound = join(dist, "+not-found.html");
if (existsSync(notFound)) {
  copyFileSync(notFound, join(dist, "404.html"));
}

// Router internals with no use on a static host: the dev route index and the
// unfilled dynamic-route template (real project pages are pre-rendered).
rmSync(join(dist, "_sitemap.html"), { force: true });
rmSync(join(dist, "project", "[slug].html"), { force: true });

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const { projects } = JSON.parse(readFileSync(join(root, "src/content/snapshot.json"), "utf8"));
const paths = [
  "/",
  "/profile",
  ...projects.map((project) => `/project/${project.slug ?? slugify(project.title ?? "")}`),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);
writeFileSync(
  join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

console.log(`postexport-web: wrote 404.html and a sitemap with ${paths.length} URLs`);
