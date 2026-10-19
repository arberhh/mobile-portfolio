import { ReactNode } from "react";
import { TextStyle } from "react-native";
import { Theme } from "../themes";
import { Database } from "./supabase";

type Props = {
  children: ReactNode;
};

interface ListProps {
  color: string;
  items: string[];
  bracket: string;
  title: string;
}

type Domain = Pick<Database["public"]["Tables"]["domains"]["Row"], "id" | "title" | "icon">;

interface ProjectProps {
  project: Project;
}

interface Project {
  id: number;
  slug: string;
  title: string;
  role: string;
  period: string;
  highlight: string;
  banner_url: string;
  banner_alt: string;
  images: string[];
  short_description: string;
  long_description: string;
  tools_technologies: string[];
  non_technical_contributions: string[];
  techical_contributions: string[];
  github: string;
  app_store_url: string;
  play_store_url: string;
  domains: Domain[];
}

type Profile = Database["public"]["Tables"]["profile"]["Row"];

interface FullScreenSlideshowProps {
  visible: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

interface SocialIconProps {
  color: string;
  url: string;
  iconType: "linkedin" | "github" | "google";
}

interface TechProps {
  title: string;
  theme: Theme;
}

interface SectionHeadingProps {
  bracket: string;
  title: string;
}

interface ThemeTextProps {
  style: TextStyle;
  text: string;
  color?: string;
  numberOfLines?: number;
}

export {
  Database,
  Props,
  ListProps,
  ProjectProps,
  Domain,
  Project,
  Profile,
  FullScreenSlideshowProps,
  SocialIconProps,
  TechProps,
  SectionHeadingProps,
  ThemeTextProps,
};
