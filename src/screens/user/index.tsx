import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import {
  ContactLinks,
  ContributionGraph,
  Footer,
  Header,
  LinkedText,
  PageHead,
  PromptHeading,
  SectionHeading,
  Tech,
  TerminalWindow,
  ThemeText,
} from "@/components";
import { useAsync } from "@/hooks";
import { getProfile } from "@/services";
import { snapshotProfile } from "@/content";
import { ThemeScope, useTheme } from "@/context";
import { darkTheme } from "@/themes";
import { Profile } from "@/types";
import { commonStyles } from "@/common";
import Enter from "@/components/enter";
import styles from "./styles";

function githubUsername(url: string | null) {
  return url?.replace(/\/+$/, "").split("/").pop() ?? "";
}

// The window body, a component of its own so its colours come from the
// ThemeScope around it rather than the screen's theme.
function ProfileCard({ user, raised }: { user: Profile; raised: boolean }) {
  const { theme } = useTheme();
  return (
    <TerminalWindow title="arber@portfolio: ~/profile" raised={raised}>
      <View style={styles.card}>
        <View
          style={[
            styles.avatarRing,
            { borderColor: theme.sky, backgroundColor: theme.cardBackground },
          ]}
        >
          <Image
            source={{ uri: user.profile_picture ?? undefined }}
            alt={`Photo of ${user.name ?? "the developer"}`}
            accessibilityLabel={`Photo of ${user.name ?? "the developer"}`}
            transition={200}
            contentFit="cover"
            style={[styles.avatar, { backgroundColor: theme.surfaceRaised }]}
          />
        </View>
        {!!user.name && (
          <Text
            dataSet={{ display: "" }}
            style={[commonStyles.display, styles.name, { color: theme.text }]}
            accessibilityRole="header"
          >
            {user.name}
          </Text>
        )}
        {!!user.headline && (
          <ThemeText
            style={[commonStyles.lead, styles.headline]}
            text={user.headline}
            color={theme.textSecondary}
          />
        )}
        <View style={styles.contactLinks}>
          <ContactLinks profile={user} center />
        </View>
      </View>
    </TerminalWindow>
  );
}

function User() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const {
    data: user,
    loading,
    error,
  } = useAsync<Profile | null>(getProfile, snapshotProfile, snapshotProfile !== null);
  const showingContent = error === "" && !!user;

  function onBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  return (
    <SafeAreaView
      edges={["right", "bottom", "left"]}
      style={[commonStyles.flex, { backgroundColor: theme.screenBackground }]}
    >
      <PageHead title="Profile" path="/profile" description={user?.intro ?? undefined} />
      <StatusBar style={theme.theme === "dark" ? "light" : "dark"} />
      {/* A flat title bar in the band's top colour (screenBackground at ≥900 via
          `data-header-bar`); the band below starts at the same colour and
          scrolls away, so the about text never sits on sky. */}
      <View
        dataSet={{ headerBar: "" }}
        style={{ paddingTop: insets.top, backgroundColor: theme.heroBandStart }}
      >
        <Header title="~/profile" leftIcon="back" onLeftPress={onBack} transparent />
      </View>
      {showingContent ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient
            dataSet={{ heroBand: "" }}
            colors={[theme.heroBandStart, theme.heroBandEnd]}
            style={styles.heroBand}
          />
          <View dataSet={{ gutter: "" }} style={[commonStyles.horizontalPadding, styles.content]}>
            <Enter index={0}>
              {/* Always a navy terminal, in both themes (SPEC-53). */}
              <ThemeScope theme={darkTheme}>
                {/* The deeper shadow lifts the navy block off a light page. */}
                <ProfileCard user={user} raised={theme.theme === "light"} />
              </ThemeScope>
            </Enter>
            {/* Home already shows `intro`, so this is the longer story. */}
            <Enter index={1}>
              <PromptHeading command="cat about.md" first />
              {/* Free text sits on the shared inset line, like the prompts. */}
              <View dataSet={{ inset: "" }} style={styles.inset}>
                <LinkedText
                  dataSet={{ measure: "" }}
                  style={commonStyles.body}
                  text={user.about_me || user.intro || ""}
                  color={theme.textSecondary}
                />
              </View>
            </Enter>
            <Enter index={2}>
              <SectionHeading bracket="[stack]" title="Main Technologies" />
              <View dataSet={{ inset: "" }} style={[styles.chips, styles.inset]}>
                {(user.main_techs ?? []).map((tech: string, index: number) => (
                  <Tech theme={theme} key={index} title={tech} />
                ))}
              </View>
            </Enter>
            <Enter index={3}>
              <ContributionGraph username={githubUsername(user.github)} />
            </Enter>
            <Enter index={4}>
              <Footer />
            </Enter>
          </View>
        </ScrollView>
      ) : (
        <View style={[commonStyles.flex, commonStyles.center]}>
          {error !== "" ? (
            <ThemeText text={error} style={commonStyles.errorText} />
          ) : (
            loading && <ActivityIndicator size={"large"} color={theme.color} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

export default User;
