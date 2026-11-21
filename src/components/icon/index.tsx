import React from "react";
import Svg, { Path } from "react-native-svg";
import { GLYPHS } from "./glyphs";

type IconName = keyof typeof GLYPHS;

interface IconProps {
  name: IconName;
  size: number;
  color: string;
}

// The app's only icon component. Inline SVG rather than an icon font, so no
// font file ships and the static HTML already has every icon (a font glyph
// differs before and after the font loads, so it couldn't render until
// hydration). `currentColor` lets web CSS recolour an icon (the card arrow's
// hover).
function Icon({ name, size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" color={color} aria-hidden>
      {GLYPHS[name].map(({ d, stroke }: { d: string; stroke?: number }) =>
        stroke ? (
          <Path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <Path key={d} d={d} fill="currentColor" />
        ),
      )}
    </Svg>
  );
}

export default Icon;
export type { IconName };
