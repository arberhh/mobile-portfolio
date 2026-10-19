import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { Header, SectionHeading, SocialIcon, Tech, ThemeText, WebAppShell } from "@/components";
import { useAsync } from "@/hooks";
import { getProfile } from "@/services";
import { snapshotProfile } from "@/content";
import { useTheme } from "@/context";
import { ScreenProps, Profile } from "@/types";
import { commonStyles } from "@/common";
import styles from "./styles";

function User({ navigation }: ScreenProps) {
  const { theme } = useTheme();
  const {
    data: user,
    loading,
    error,
  } = useAsync<Profile | null>(getProfile, snapshotProfile, snapshotProfile !== null);
  const showingContent = error === "" && !loading && !!user;

  return (
    <WebAppShell active="User">
      <SafeAreaView style={[commonStyles.flex, { backgroundColor: theme.screenBackground }]}>
        <Header title="Arber" leftIcon="back" onLeftPress={() => navigation.goBack()} />
        <LinearGradient
          colors={[theme.cardBackground, theme.screenBackground, theme.cardBackground]}
          start={[0, 0]}
          end={[0, 1]}
          style={[
            styles.container,
            showingContent && styles.loadedContainer,
            { backgroundColor: theme.screenBackground },
          ]}
        >
          {error !== "" ? (
            <View style={[commonStyles.flex, commonStyles.center]}>
              <ThemeText text={error} style={commonStyles.errorText} />
            </View>
          ) : loading || !user ? (
            <ActivityIndicator size={"large"} color={theme.color} />
          ) : (
            <>
              <Image
                source={{ uri: user.profile_picture ?? undefined }}
                style={styles.profileImage}
              />
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
              {/* Contact Icons */}
              <View style={styles.contactIcons}>
                {user.linkedin && (
                  <SocialIcon url={user.linkedin} iconType="linkedin" color={theme.color} />
                )}
                {user.github && (
                  <SocialIcon url={user.github} iconType="github" color={theme.color} />
                )}
                {user.email && (
                  <SocialIcon url={`mailto:${user.email}`} iconType="google" color={theme.color} />
                )}
              </View>
            </>
          )}
        </LinearGradient>
      </SafeAreaView>
    </WebAppShell>
  );
}

export default User;
