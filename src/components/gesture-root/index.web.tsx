import React, { ReactNode } from "react";
import { View } from "react-native";
import { commonStyles } from "@/common";

export default function GestureRoot({ children }: { children: ReactNode }) {
  return <View style={commonStyles.flex}>{children}</View>;
}
