import React, { useState } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FullScreenSlideshow, Header, List, Slideshow, ThemeText, WebAppShell } from "@/components";
import { useAsync } from "@/hooks";
import { getProjects } from "@/services";
import { snapshotProjects } from "@/content";
import { useTheme } from "@/context";
import { ScreenProps, Project } from "@/types";
import { commonStyles } from "@/common";
import styles from "./styles";

interface ProjectDetailContentProps {
  id: number;
  onBack: () => void;
}

function ProjectDetailContent({ id, onBack }: ProjectDetailContentProps) {
  const { theme } = useTheme();
  const {
    data: projects,
    loading,
    error,
  } = useAsync<Project[]>(getProjects, snapshotProjects, snapshotProjects.length > 0);
  const project = projects.find((item) => item.id === id) ?? null;
  const [modalVisible, setModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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
      <Header title="ProjectDetails" leftIcon="back" onLeftPress={onBack} />
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

function ProjectDetailScreen({ navigation, route }: ScreenProps) {
  return (
    <WebAppShell>
      <ProjectDetailContent id={route.params.id} onBack={() => navigation.goBack()} />
    </WebAppShell>
  );
}

export default ProjectDetailScreen;
export { ProjectDetailContent };
