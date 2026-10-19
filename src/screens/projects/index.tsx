import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Divider, ExternalLink, Header, Project, ThemeText, WebAppShell } from "@/components";
import { useAsync, useIsWideWeb, useSystemThemeSync } from "@/hooks";
import { getProjects } from "@/services";
import { snapshotProjects } from "@/content";
import { useTheme } from "@/context";
import { ScreenProps, Project as ProjectData } from "@/types";
import { commonStyles } from "@/common";
import { REPO_URL } from "@/constants";
import { ProjectDetailContent } from "../project-detail";
import styles from "./styles";

function keyExtractor(item: ProjectData) {
  return item?.id.toString();
}

function renderItemSeparator() {
  return <Divider style={styles.itemSeparator} />;
}

function RepoLink() {
  const { theme } = useTheme();

  return (
    <ExternalLink url={REPO_URL} style={styles.repoLink} accessibilityRole="link">
      <Ionicons name="logo-github" size={16} color={theme.textSecondary} style={styles.repoIcon} />
      <ThemeText
        text="View source on GitHub"
        color={theme.textSecondary}
        style={commonStyles.subtitle}
      />
    </ExternalLink>
  );
}

interface ProjectListItemProps {
  item: ProjectData;
  onPress: (id: number) => void;
}

function ProjectListItem({ item, onPress }: ProjectListItemProps) {
  return (
    <Project
      onPress={() => onPress(item.id)}
      title={item.title}
      image={item.banner_url}
      domains={item.domains}
    />
  );
}

function Home({ navigation }: ScreenProps) {
  const { data: projects, error } = useAsync<ProjectData[]>(
    getProjects,
    snapshotProjects,
    snapshotProjects.length > 0,
  );

  const { theme } = useTheme();
  const isWideWeb = useIsWideWeb();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useSystemThemeSync();

  const onLeftPress = useCallback(() => {
    navigation.navigate("User");
  }, [navigation]);

  const onPressProject = useCallback(
    (id: number) => {
      if (isWideWeb) {
        setSelectedProjectId(id);
      } else {
        navigation.navigate("ProjectDetails", { id });
      }
    },
    [isWideWeb, navigation],
  );

  const renderProjectItem = useCallback(
    ({ item }: { item: ProjectData }) => <ProjectListItem item={item} onPress={onPressProject} />,
    [onPressProject],
  );

  return (
    <WebAppShell active="Home">
      <SafeAreaView style={[commonStyles.flex, { backgroundColor: theme.screenBackground }]}>
        <StatusBar style={theme.theme === "dark" ? "light" : "dark"} />
        <Header title="Home" leftIcon="account" onLeftPress={onLeftPress} />
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
      {selectedProjectId !== null && (
        <View style={StyleSheet.absoluteFill}>
          <ProjectDetailContent id={selectedProjectId} onBack={() => setSelectedProjectId(null)} />
        </View>
      )}
    </WebAppShell>
  );
}

export default Home;
