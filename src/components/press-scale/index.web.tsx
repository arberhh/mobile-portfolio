import React, { ReactNode } from "react";
import { View } from "react-native";
import type { PressHandlers } from "./index";

// The press scale is CSS `:active` (PROJECT_CARD_CSS, WEB_MOTION_CSS).
export default function PressScale({
  children,
}: {
  children: (handlers: PressHandlers) => ReactNode;
}) {
  return <View>{children({})}</View>;
}
