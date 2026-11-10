import React, { useState } from "react";
import { View, ActivityIndicator, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ExternalLink,
  FullScreenSlideshow,
  Header,
  Icon,
  List,
  PageHead,
  SectionHeading,
  Slideshow,
  TerminalWindow,
  ThemeText,
} from "@/components";
import { useAsync } from "@/hooks";
import { getProjects } from "@/services";
import { findProject, snapshotProjects } from "@/content";
import { useTheme } from "@/context";
import { Project } from "@/types";
import { commonStyles } from "@/common";
import Enter from "@/components/enter";
import { formatMeta } from "@/components/project/meta";
import styles from "./styles";

function ProjectLinks({ project }: { project: Project }) {
  const { theme } = useTheme();
  const links = [
    { label: "Website", url: project.website_url },
    { label: "App Store", url: project.app_store_url },
    { label: "Google Play", url: project.play_store_url },
    { label: "Source", url: project.github },
  ].filter((link) => link.url !== "");

  if (links.length === 0) return null;

  // The first available link is the primary (pink) action.
  return (
    <View dataSet={{ inset: "" }} style={[styles.links, styles.inset]}>
      {links.map(({ label, url }, index) => {
        const primary = index === 0;
        const color = primary ? theme.onAccent : theme.text;
        return (
          <ExternalLink
            key={label}
            url={url}
            accessibilityRole="link"
            style={[
              styles.link,
              primary
                ? { backgroundColor: theme.accent }
                : [styles.secondaryLink, { borderColor: theme.chipBorder }],
            ]}
          >
            <Icon name="open-outline" size={16} color={color} />
            <Text style={[commonStyles.button, { color }]}>{label}</Text>
          </ExternalLink>
        );
      })}
    </View>
  );
}

// Tool entries read "Area: tools". The area becomes a mono label (a 140px
// column at ≥768 via PROJECT_CARD_CSS); an entry without ": " is plain text.
function ToolRow({ tool, first }: { tool: string; first: boolean }) {
  const { theme } = useTheme();
  const colon = tool.indexOf(": ");
  const label = colon > 0 ? tool.slice(0, colon) : "";
  const text = colon > 0 ? tool.slice(colon + 2) : tool;

  return (
    <View
      dataSet={{ toolRow: "" }}
      style={[styles.toolRow, !first && [styles.toolDivider, { borderTopColor: theme.line }]]}
    >
      {label !== "" && (
        <Text dataSet={{ toolLabel: "" }} style={[commonStyles.label, { color: theme.color }]}>
          {label}
        </Text>
      )}
      <Text dataSet={{ measure: "" }} style={[commonStyles.body, { color: theme.textSecondary }]}>
        {text}
      </Text>
    </View>
  );
}

function ProjectDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { theme } = useTheme();
  const {
    data: projects,
    loading,
    error,
  } = useAsync<Project[]>(getProjects, snapshotProjects, snapshotProjects.length > 0);
  const project = findProject(projects, slug);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  function onBack() {
    // A deep link opens this screen with no history, so "back" goes Home.
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  function openModal(img: string) {
    if (!project) return;
    setActiveIndex(project.images.indexOf(img));
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  const meta = project ? formatMeta(project.role, project.period) : "";

  return (
    <SafeAreaView style={[commonStyles.flex, { backgroundColor: theme.screenBackground }]}>
      {project && (
        <PageHead
          title={project.title}
          description={project.short_description || undefined}
          path={`/project/${project.slug}`}
          image={project.banner_url}
        />
      )}
      <Header title={`~/projects/${slug}`} leftIcon="back" onLeftPress={onBack} />
      {error !== "" ? (
        <View style={[commonStyles.flex, commonStyles.center]}>
          <ThemeText style={commonStyles.errorText} text={error} />
        </View>
      ) : !project && loading ? (
        <View style={[commonStyles.flex, commonStyles.center]}>
          <ActivityIndicator size={"large"} color={theme.color} />
        </View>
      ) : !project ? (
        <View style={[commonStyles.flex, commonStyles.center]}>
          <ThemeText style={commonStyles.errorText} text="This project doesn't exist." />
        </View>
      ) : (
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[commonStyles.flexGrow, styles.content]}
        >
          <FullScreenSlideshow
            visible={modalVisible}
            onClose={closeModal}
            images={project.images}
            title={project.title}
            initialIndex={activeIndex}
          />
          {project.images.length > 0 && (
            <Enter index={0}>
              <View dataSet={{ gutter: "" }} style={styles.window}>
                <TerminalWindow title={`${project.slug}/screens`}>
                  <Slideshow
                    onImagePress={openModal}
                    images={project.images}
                    title={project.title}
                  />
                </TerminalWindow>
              </View>
            </Enter>
          )}
          <View dataSet={{ gutter: "" }} style={styles.body}>
            {/* Headings carry their own inset; everything else is wrapped in
                `data-inset` so the body shares the hero and card content line. */}
            <Enter index={1}>
              <View dataSet={{ inset: "" }} style={styles.inset}>
                <Text
                  style={[commonStyles.h1, { color: theme.text }]}
                  accessibilityRole="header"
                  aria-level={1}
                >
                  {project.title}
                </Text>
                {meta !== "" && (
                  <Text style={[commonStyles.meta, styles.meta, { color: theme.textSecondary }]}>
                    {meta}
                  </Text>
                )}
                {project.highlight !== "" && (
                  <View
                    style={[
                      styles.highlight,
                      { backgroundColor: theme.highlightBackground, borderLeftColor: theme.accent },
                    ]}
                  >
                    <Text style={[commonStyles.lead, { color: theme.text }]}>
                      {project.highlight}
                    </Text>
                  </View>
                )}
              </View>
            </Enter>
            <Enter index={2}>
              <ProjectLinks project={project} />
            </Enter>
            {project.long_description !== "" && (
              <Enter index={3}>
                <View dataSet={{ inset: "" }} style={styles.inset}>
                  <Text
                    dataSet={{ measure: "" }}
                    style={[commonStyles.body, styles.description, { color: theme.textSecondary }]}
                  >
                    {project.long_description}
                  </Text>
                </View>
              </Enter>
            )}
            {project.tools_technologies.length > 0 && (
              <Enter index={4}>
                <SectionHeading bracket="[stack]" title="Tools" />
                <View dataSet={{ inset: "" }} style={styles.inset}>
                  {project.tools_technologies.map((tool, index) => (
                    <ToolRow key={tool} tool={tool} first={index === 0} />
                  ))}
                </View>
              </Enter>
            )}
            {/* The CSS caps the stagger at 5; both lists share that slot. */}
            <Enter index={5}>
              <List
                items={project.non_technical_contributions}
                color={theme.textSecondary}
                title="Contributions"
                bracket="[product]"
              />
              <List
                items={project.techical_contributions}
                color={theme.textSecondary}
                title="Contributions"
                bracket="[tech]"
              />
            </Enter>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default ProjectDetailScreen;
