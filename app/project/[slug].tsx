import { snapshotProjects } from "@/content";

export { ProjectDetail as default } from "@/screens";

// Static web export pre-renders one HTML page per project in the snapshot.
export function generateStaticParams(): { slug: string }[] {
  return snapshotProjects.map((project) => ({ slug: project.slug }));
}
