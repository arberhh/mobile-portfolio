import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Header, PageHead, ThemeText } from "@/components";
import { useTheme } from "@/context";
import { commonStyles } from "@/common";
import styles from "./styles";

function NotFound() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[commonStyles.flex, { backgroundColor: theme.screenBackground }]}>
      <PageHead title="Not found" path="/404" noIndex />
      <Header title="404" leftIcon="back" onLeftPress={() => router.replace("/")} />
      <View style={[commonStyles.flex, commonStyles.center, commonStyles.horizontalPadding]}>
        <ThemeText
          style={commonStyles.subtitle}
          text="$ cd: no such page"
          color={theme.textSecondary}
        />
        <Link href="/" asChild>
          <Text style={StyleSheet.flatten([styles.link, { color: theme.accent }])}>
            [Back to projects]
          </Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}

export default NotFound;
