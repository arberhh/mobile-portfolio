// app/+html.tsx hides the page (`data-theme-pending`) when the OS is light,
// because the static HTML is dark. Once the client theme matches, show it,
// then switch on the theme transitions (`data-theme-ready`) so the swap
// itself never animates.
export default function showTheme() {
  // One frame later, so Reanimated-driven styles (the toggle icon) have caught
  // up with the new theme before anything is shown.
  requestAnimationFrame(() => {
    const root = document.documentElement;
    root.removeAttribute("data-theme-pending");
    // Flush styles so the final colours land before transitions are allowed.
    root.getBoundingClientRect();
    root.setAttribute("data-theme-ready", "");
  });
}
