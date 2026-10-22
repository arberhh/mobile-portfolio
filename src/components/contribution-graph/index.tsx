import React, { useMemo } from "react";
import { View } from "react-native";
import { getContributions } from "@/services";
import { useAsync } from "@/hooks";
import { useTheme } from "@/context";
import { Contributions, ContributionDay } from "@/types";
import SectionHeading from "../section-heading";
import { DAYS, Level, LEVEL_COLORS } from "./constants";
import FillGrid from "./fill-grid";
import RollingTotal from "./rolling-total";
import styles from "./styles";

function toWeeks(days: ContributionDay[]): Level[][] {
  if (days.length === 0) return [];
  // Pad the first week so every column starts on a Sunday, like GitHub's grid.
  const leading = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const padded: Level[] = [...Array(leading).fill(null), ...days.map((day) => day.level)];
  const weeks: Level[][] = [];
  for (let i = 0; i < padded.length; i += DAYS) weeks.push(padded.slice(i, i + DAYS));
  return weeks;
}

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

  return (
    <View style={styles.container}>
      <SectionHeading bracket="[github]" title="Contribution activity" />
      {/* The empty grid and rolling total are the loading state; the grid
          also holds its space, so the contact links below don't jump. */}
      <View
        accessible
        accessibilityLabel={
          data
            ? `${data.total} GitHub contributions in the last year`
            : "Loading GitHub contributions"
        }
      >
        <RollingTotal value={data?.total ?? null} />
        <FillGrid weeks={data ? weeks : null} colors={LEVEL_COLORS[theme.theme]} />
      </View>
    </View>
  );
}
