import React, { useMemo, useRef } from "react";
import { ScrollView, View } from "react-native";
import { TRANSPARENT } from "@/constants";
import { getContributions } from "@/services";
import { useAsync } from "@/hooks";
import { useTheme } from "@/context";
import { Contributions, ContributionDay } from "@/types";
import SectionHeading from "../section-heading";
import ThemeText from "../theme-text";
import styles from "./styles";

// Level 0 uses the theme's hairline colour; 1-4 are the accent at rising opacity.
const LEVEL_ALPHA = ["", "55", "88", "BB", ""] as const;

function toWeeks(days: ContributionDay[]) {
  if (days.length === 0) return [];
  // Pad the first week so every column starts on a Sunday, like GitHub's grid.
  const leading = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const padded: (ContributionDay | null)[] = [...Array(leading).fill(null), ...days];
  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

const fetchNothing = () => Promise.resolve<Contributions | null>(null);

export default function ContributionGraph({ username }: { username: string }) {
  const { theme } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const fetcher = useMemo(
    () => (username ? () => getContributions(username) : fetchNothing),
    [username],
  );
  const { data } = useAsync<Contributions | null>(fetcher, null, true);
  const weeks = useMemo(() => toWeeks(data?.days ?? []), [data]);

  // Decorative and non-essential: render nothing until (and unless) it loads.
  if (!data || weeks.length === 0) return null;

  function colorFor(level: ContributionDay["level"]) {
    if (level === 0) return theme.line;
    if (level === 4) return theme.accent;
    return `${theme.accent}${LEVEL_ALPHA[level]}`;
  }

  return (
    <View style={styles.container}>
      <SectionHeading bracket="[github]" title="Contribution activity" />
      <ThemeText
        style={styles.total}
        text={`${data.total.toLocaleString("en-US")} contributions in the last year`}
        color={theme.textSecondary}
      />
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        <View
          style={styles.grid}
          accessible
          accessibilityLabel={`${data.total} GitHub contributions in the last year`}
        >
          {weeks.map((week, w) => (
            <View key={w} style={styles.column}>
              {week.map((day, d) => (
                <View
                  key={d}
                  style={[
                    styles.cell,
                    { backgroundColor: day ? colorFor(day.level) : TRANSPARENT },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
