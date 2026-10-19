import React, { useState } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FullScreenSlideshow, Header, List, PageHead, Slideshow, ThemeText } from "@/components";
import { useAsync } from "@/hooks";
import { getProjects } from "@/services";
import { findProject, snapshotProjects } from "@/content";
import { useTheme } from "@/context";
import { Project } from "@/types";
import { commonStyles } from "@/common";
import styles from "./styles";

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
      <Header title={project?.title ?? "Project"} leftIcon="back" onLeftPress={onBack} />
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
          contentContainerStyle={[commonStyles.flexGrow, commonStyles.verticalPadding]}
        >
          <FullScreenSlideshow
            visible={modalVisible}
            onClose={closeModal}
            images={project.images}
            initialIndex={activeIndex}
          />
          {/* custom slideshow */}
          <Slideshow onImagePress={openModal} images={project.images} />
          <View style={styles.body}>
            <ThemeText style={commonStyles.title} text={project.title} color={theme.accent} />
            <ThemeText
              style={commonStyles.subtitle}
              text={project.long_description}
              color={theme.textSecondary}
            />
            <List
              items={project.tools_technologies}
              color={theme.textSecondary}
              title="Tools and Technologies"
              bracket="[stack]"
            />
            <List
              items={project.non_technical_contributions}
              color={theme.textSecondary}
              title="Non technical contributions"
              bracket="[contributions/non-technical]"
            />
            <List
              items={project.techical_contributions}
              color={theme.textSecondary}
              title="Technical contributions"
              bracket="[contributions/technical]"
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default ProjectDetailScreen;
