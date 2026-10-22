// A square's level (0-4), or null for padding before the first day.
export type Level = number | null;

export const DAYS = 7;
export const CELL = 10;
const GAP = 3;
export const COLUMN_WIDTH = CELL + GAP;
export const GRID_HEIGHT = DAYS * COLUMN_WIDTH - GAP;

export const FILL_MS = 6000;
// GitHub's year view, for the empty grid shown while loading.
export const PLACEHOLDER_WEEKS = 53;

// Solid, GitHub-style ramps (alpha on the accent looked muddy on the dark card).
export const LEVEL_COLORS = {
  dark: ["#1C211D", "#0E4429", "#006D32", "#26A641", "#B6FF6B"],
  light: ["#E3E9E1", "#AEDCA0", "#6CC35B", "#3F8C1F", "#1F5C0C"],
} as const;
