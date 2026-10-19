import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { ContactLinks, Header, PageHead, SectionHeading, Tech, ThemeText } from "@/components";
import { useAsync } from "@/hooks";
import { getProfile } from "@/services";
import { snapshotProfile } from "@/content";
import { useTheme } from "@/context";
import { Profile } from "@/types";
import { commonStyles } from "@/common";
import styles from "./styles";

function User() {
  const router = useRouter();
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
    <SafeAreaView style={[commonStyles.flex, { backgroundColor: theme.screenBackground }]}>
      <PageHead title="Profile" path="/profile" description={user?.intro ?? undefined} />
      <Header title={user?.name ?? "Profile"} leftIcon="back" onLeftPress={onBack} />
      <LinearGradient
        colors={[theme.cardBackground, theme.screenBackground, theme.cardBackground]}
        start={[0, 0]}
        end={[0, 1]}
        style={[commonStyles.flex, { backgroundColor: theme.screenBackground }]}
      >
        {error !== "" ? (
          <View style={[commonStyles.flex, commonStyles.center]}>
            <ThemeText text={error} style={commonStyles.errorText} />
          </View>
        ) : loading && !user ? (
          <View style={[commonStyles.flex, commonStyles.center]}>
            <ActivityIndicator size={"large"} color={theme.color} />
          </View>
        ) : (
          showingContent && (
            <ScrollView contentContainerStyle={styles.container}>
              <Image
                source={{ uri: user.profile_picture ?? undefined }}
                alt={`Photo of ${user.name ?? "the developer"}`}
                accessibilityLabel={`Photo of ${user.name ?? "the developer"}`}
                style={styles.profileImage}
              />
              {!!user.headline && (
                <ThemeText style={styles.headline} text={user.headline} color={theme.accent} />
              )}
              {/* About Me Section */}
              <View style={styles.section}>
                <ThemeText
                  style={commonStyles.subtitle}
                  text={user.intro ?? ""}
                  color={theme.textSecondary}
                />
              </View>
              <View style={styles.section}>
                <SectionHeading bracket="[stack]" title="Main Technologies" />
                <View style={[commonStyles.row, commonStyles.aligLeft]}>
                  {(user.main_techs ?? []).map((tech: string, index: number) => (
                    <Tech theme={theme} key={index} title={tech} />
                  ))}
                </View>
              </View>
              <View style={styles.contactLinks}>
                <ContactLinks profile={user} center />
              </View>
            </ScrollView>
          )
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

export default User;
