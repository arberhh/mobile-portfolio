import React from "react";
import { SectionList, SectionListData, SectionListRenderItemInfo, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Footer, Header, Intro, PageHead, Project, PromptHeading, ThemeText } from "@/components";
import { useAsync } from "@/hooks";
import { getProfile, getProjects } from "@/services";
import { snapshotProfile, snapshotProjects } from "@/content";
import { useTheme } from "@/context";
import Enter from "@/components/enter";
import { Profile, Project as ProjectData } from "@/types";
import { commonStyles } from "@/common";
import styles from "./styles";

type ProjectSection = { command: string; offset: number };

function keyExtractor(item: ProjectData) {
  return item?.id.toString();
}

function renderItemSeparator() {
  return <View style={styles.itemSeparator} />;
}

// Cards enter after the hero (index 0), staggered across both sections. The
// first card's banner is the page's largest paint, so it loads first.
function renderProjectItem({
  item,
  index,
  section,
}: SectionListRenderItemInfo<ProjectData, ProjectSection>) {
  const position = section.offset + index;
  return (
    <Enter index={position + 1}>
      <Project project={item} priority={position === 0} />
    </Enter>
  );
}

function renderSectionHeader({
  section,
}: {
  section: SectionListData<ProjectData, ProjectSection>;
}) {
  return <PromptHeading command={section.command} count={section.data.length} />;
}

// Work first, then personal projects; an empty group is left out.
function groupProjects(projects: ProjectData[]) {
  const work = projects.filter((project) => !project.personal);
  const personal = projects.filter((project) => project.personal);
  return [
    { command: "ls ./work", offset: 0, data: work },
    { command: "ls ./personal", offset: work.length, data: personal },
  ].filter((section) => section.data.length > 0);
}

// The band scrolls away with the hero, so cards never sit on sky. It starts
// at the header bar's colour, so at rest the two read as one. WEB_SHELL_CSS
// hides it at ≥900, where the desktop is already sky.
function Hero({ profile }: { profile: Profile }) {
  const { theme } = useTheme();

  return (
    <View>
      <LinearGradient
        dataSet={{ heroBand: "" }}
        colors={[theme.heroBandStart, theme.heroBandEnd]}
        style={styles.heroBand}
      />
      <Enter index={0}>
        <Intro profile={profile} />
      </Enter>
    </View>
  );
}

function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  function onLeftPress() {
    router.push("/profile");
  }

  return (
    <SafeAreaView
      edges={["right", "bottom", "left"]}
      style={[commonStyles.flex, { backgroundColor: theme.screenBackground }]}
    >
      <PageHead path="/" />
      <StatusBar style={theme.theme === "dark" ? "light" : "dark"} />
      {/* A flat title bar in the band's top colour (screenBackground at ≥900 via
          `data-header-bar`), so content scrolling under it meets a deliberate edge. */}
      <View
        dataSet={{ headerBar: "" }}
        style={{ paddingTop: insets.top, backgroundColor: theme.heroBandStart }}
      >
        <Header title="~/projects" leftIcon="account" onLeftPress={onLeftPress} transparent />
      </View>
      {error !== "" ? (
        <View style={[commonStyles.flex, commonStyles.center, commonStyles.horizontalPadding]}>
          <ThemeText style={commonStyles.errorText} text={error} />
        </View>
      ) : (
        <SectionList
          dataSet={{ gutter: "" }}
          style={commonStyles.horizontalPadding}
          sections={groupProjects(projects)}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={profile ? <Hero profile={profile} /> : null}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={renderItemSeparator}
          renderItem={renderProjectItem}
          ListFooterComponent={Footer}
        />
      )}
    </SafeAreaView>
  );
}

export default Home;
