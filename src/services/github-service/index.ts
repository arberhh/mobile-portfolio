import { ContributionDay, Contributions } from "@/types";

// GitHub has no public endpoint for the contribution calendar without a token
// (and github.com/<user> can't be iframed), so this reads the same data from a
// public, CORS-enabled proxy of the calendar.
const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";

type ApiResponse = {
  total?: Record<string, number>;
  contributions?: { date: string; count: number; level: number }[];
};

function parseContributions(json: ApiResponse): Contributions {
  const days: ContributionDay[] = (json.contributions ?? []).map(({ date, count, level }) => ({
    date,
    count,
    level: Math.min(4, Math.max(0, level)) as ContributionDay["level"],
  }));
  return { total: json.total?.lastYear ?? days.reduce((sum, day) => sum + day.count, 0), days };
}

async function getContributions(username: string): Promise<Contributions> {
  const response = await fetch(`${CONTRIBUTIONS_API}/${encodeURIComponent(username)}?y=last`);
  if (!response.ok) throw new Error("Could not load GitHub contributions");
  return parseContributions(await response.json());
}

export { getContributions, parseContributions };
