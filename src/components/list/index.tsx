import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/context";
import { commonStyles } from "@/common";
import { ListProps } from "@/types";
import SectionHeading from "../section-heading";
import styles from "./styles";

export default function List({ items = [], bracket, color, title }: ListProps) {
  const { theme } = useTheme();
  if (items.length === 0) return null;

  return (
    <View>
      <SectionHeading bracket={bracket} title={title} />
      <View dataSet={{ inset: "" }} style={styles.items}>
        {items.map((item) => (
          <View style={styles.item} key={item}>
            <View style={[styles.bullet, { backgroundColor: theme.color }]} />
            <Text dataSet={{ measure: "" }} style={[commonStyles.body, styles.text, { color }]}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
