import type { View } from "react-native";

// For the web variants that replace Reanimated: react-native-web views are
// DOM elements, so they can run the browser's Web Animations API directly.
// Each caller renders the final state as its style and animates *to* it, so
// once an animation ends (or is skipped) the element simply shows its style.
export function animate(
  view: View | null,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
) {
  const element = view as unknown as HTMLElement | null;
  if (!element?.animate) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  element.animate(keyframes, options);
}
