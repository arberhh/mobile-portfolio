import React, { useCallback, useMemo } from "react";
import { SectionList, SectionListData, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  Divider,
  ExternalLink,
  Header,
  Icon,
  Intro,
  PageHead,
  Project,
  ThemeText,
} from "@/components";
import { useAsync, useSystemThemeSync } from "@/hooks";
import { getProfile, getProjects } from "@/services";
import { snapshotProfile, snapshotProjects } from "@/content";
import { useTheme } from "@/context";
import { Profile, Project as ProjectData } from "@/types";
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

type ProjectSection = { prompt: string };

function SectionPrompt({ section }: { section: SectionListData<ProjectData, ProjectSection> }) {
  const { theme } = useTheme();
  return <ThemeText style={styles.prompt} text={section.prompt} color={theme.color} />;
}

function renderSectionHeader(info: { section: SectionListData<ProjectData, ProjectSection> }) {
  return <SectionPrompt section={info.section} />;
}

// Work first, then personal projects; an empty group is left out.
function groupProjects(projects: ProjectData[]) {
  return [
    { prompt: "$ ls ./work", data: projects.filter((project) => !project.personal) },
    { prompt: "$ ls ./personal", data: projects.filter((project) => project.personal) },
  ].filter((section) => section.data.length > 0);
}

function RepoLink() {
  const { theme } = useTheme();

  return (
    <ExternalLink url={REPO_URL} style={styles.repoLink} accessibilityRole="link">
      <Icon name="logo-github" size={16} color={theme.textSecondary} style={styles.repoIcon} />
      <ThemeText
        text="View this site's source on GitHub"
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
  const { data: profile } = useAsync<Profile | null>(
    getProfile,
    snapshotProfile,
    snapshotProfile !== null,
  );

  const { theme } = useTheme();
  const sections = useMemo(() => groupProjects(projects), [projects]);

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
        <SectionList
          style={commonStyles.horizontalPadding}
          sections={sections}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={profile ? <Intro profile={profile} /> : null}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={renderItemSeparator}
          renderItem={renderProjectItem}
          ListFooterComponent={RepoLink}
        />
      )}
    </SafeAreaView>
  );
}

export default Home;
