import React, { useMemo } from "react";
import { View } from "react-native";
import { getContributions } from "@/services";
import { useAsync } from "@/hooks";
import { useTheme } from "@/context";
import { Contributions, ContributionDay } from "@/types";
import SectionHeading from "../section-heading";
import ThemeText from "../theme-text";
import FillGrid, { Level } from "./fill-grid";
import styles from "./styles";

// Solid, GitHub-style ramps (alpha on the accent looked muddy on the dark card).
const LEVEL_COLORS = {
  dark: ["#1C211D", "#0E4429", "#006D32", "#26A641", "#B6FF6B"],
  light: ["#E3E9E1", "#AEDCA0", "#6CC35B", "#3F8C1F", "#1F5C0C"],
} as const;

function toWeeks(days: ContributionDay[]): Level[][] {
  if (days.length === 0) return [];
  // Pad the first week so every column starts on a Sunday, like GitHub's grid.
  const leading = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const padded: Level[] = [...Array(leading).fill(null), ...days.map((day) => day.level)];
  const weeks: Level[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

// A fixed fake year to fill while the real one loads, so the server HTML and
// the client's first render match (no Math.random). Weighted like a real
// graph: mostly quiet, a few busy days.
function ghostLevel(week: number, day: number) {
  const roll = (Math.imul(week * 7 + day + 1, 2654435761) >>> 0) % 100;
  if (roll < 35) return 0;
  if (roll < 70) return 1;
  if (roll < 88) return 2;
  if (roll < 96) return 3;
  return 4;
}

const GHOST_WEEKS: Level[][] = Array.from({ length: 53 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ghostLevel(week, day)),
);

const fetchNothing = () => Promise.resolve<Contributions | null>(null);

export default function ContributionGraph({ username }: { username: string }) {
  const { theme } = useTheme();
  const fetcher = useMemo(
    () => (username ? () => getContributions(username) : fetchNothing),
    [username],
  );
  // No snapshot to start from, so this one does report `loading`.
  const { data, loading } = useAsync<Contributions | null>(fetcher, null);
  const weeks = useMemo(() => toWeeks(data?.days ?? []), [data]);

  // It's decorative, so if it fails, render nothing rather than an error.
  if (!loading && weeks.length === 0) return null;

  // The grid holds its space from the first render, so the contact links
  // below never jump, and fills in the real weeks as soon as they arrive.
  return (
    <View style={styles.container}>
      <SectionHeading bracket="[github]" title="Contribution activity" />
      <ThemeText
        style={styles.total}
        text={
          data
            ? `${data.total.toLocaleString("en-US")} contributions in the last year`
            : "Fetching contributions…"
        }
        color={theme.textSecondary}
      />
      <View
        accessible
        accessibilityLabel={
          data
            ? `${data.total} GitHub contributions in the last year`
            : "Loading GitHub contributions"
        }
      >
        <FillGrid
          weeks={weeks.length > 0 ? weeks : GHOST_WEEKS}
          loaded={weeks.length > 0}
          colors={LEVEL_COLORS[theme.theme]}
        />
      </View>
    </View>
  );
}
