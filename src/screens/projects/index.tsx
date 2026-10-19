import React, { useCallback } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Divider, ExternalLink, Header, Icon, PageHead, Project, ThemeText } from "@/components";
import { useAsync, useSystemThemeSync } from "@/hooks";
import { getProjects } from "@/services";
import { snapshotProjects } from "@/content";
import { useTheme } from "@/context";
import { Project as ProjectData } from "@/types";
import { commonStyles } from "@/common";
import { REPO_URL } from "@/constants";
import styles from "./styles";

function keyExtractor(item: ProjectData) {
  return item?.id.toString();
}

function renderItemSeparator() {
  return <Divider style={styles.itemSeparator} />;
}

function renderProjectItem({ item }: { item: ProjectData }) {
  return <Project project={item} />;
}

function RepoLink() {
  const { theme } = useTheme();

  return (
    <ExternalLink url={REPO_URL} style={styles.repoLink} accessibilityRole="link">
      <Icon name="logo-github" size={16} color={theme.textSecondary} style={styles.repoIcon} />
      <ThemeText
        text="View source on GitHub"
        color={theme.textSecondary}
        style={commonStyles.subtitle}
      />
    </ExternalLink>
  );
}

function Home() {
  const router = useRouter();
  const { data: projects, error } = useAsync<ProjectData[]>(
    getProjects,
    snapshotProjects,
    snapshotProjects.length > 0,
  );

  const { theme } = useTheme();

  useSystemThemeSync();

  const onLeftPress = useCallback(() => {
    router.push("/profile");
  }, [router]);

  return (
    <SafeAreaView style={[commonStyles.flex, { backgroundColor: theme.screenBackground }]}>
      <PageHead path="/" />
      <StatusBar style={theme.theme === "dark" ? "light" : "dark"} />
      <Header title="Projects" leftIcon="account" onLeftPress={onLeftPress} />
      {error !== "" ? (
        <View style={[commonStyles.flex, commonStyles.center, commonStyles.horizontalPadding]}>
          <ThemeText style={commonStyles.errorText} text={error} />
        </View>
      ) : (
        <FlatList
          style={commonStyles.horizontalPadding}
          data={projects}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={renderItemSeparator}
          renderItem={renderProjectItem}
        />
      )}
      <RepoLink />
    </SafeAreaView>
  );
}

export default Home;
