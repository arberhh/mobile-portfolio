import React from "react";

interface CaretProps {
  size?: "hero" | "small" | "display";
}

// Size, colour (navy inside `data-sky`) and the blink all come from
// WEB_MOTION_CSS, so the static HTML already blinks before hydration.
function Caret({ size = "hero" }: CaretProps) {
  return <span data-caret={size === "hero" ? "" : size} aria-hidden="true" />;
}

export default Caret;
