// "Role · Period" for cards and the detail page. Spaces inside each part are
// non-breaking (and a word joiner follows each dash), so a narrow line wraps
// only after a "·" and never splits a date range like "Dec 2022 – May 2024".
export function formatMeta(role: string, period: string) {
  return [role, period]
    .join(" · ")
    .split(" · ")
    .filter(Boolean)
    .map((part) => part.replace(/ /g, "\u00A0").replace(/[–-]/g, "$&\u2060"))
    .join("\u00A0· ");
}
