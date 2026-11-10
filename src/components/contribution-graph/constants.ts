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

// Sky ramp that peaks in pink, so the busiest days are the accent (DESIGN §4).
// Level 0 is a step off the card colour so empty days still read as cells.
export const LEVEL_COLORS = {
  dark: ["#15385F", "#2A5F94", "#4D93C4", "#9CCBE6", "#FF4D94"],
  light: ["#DCEEF7", "#9ED6EE", "#5FB3DC", "#2F78AB", "#D81B72"],
} as const;
