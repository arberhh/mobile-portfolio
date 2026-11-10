import React, { ReactNode } from "react";
import { View } from "react-native";
import { MAX_STAGGER_ITEMS } from "@/constants/motion";

// The animation is WEB_MOTION_CSS on `data-enter`, so the static HTML and the
// first client render match. The attribute value sets the `--i` stagger index.
export default function Enter({ index, children }: { index: number; children: ReactNode }) {
  return <View dataSet={{ enter: String(Math.min(index, MAX_STAGGER_ITEMS)) }}>{children}</View>;
}
