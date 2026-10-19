import { ReactNode } from "react";
import { AccessibilityRole, TextStyle } from "react-native";
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
  title: string;
  initialIndex?: number;
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
  accessibilityRole?: AccessibilityRole;
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
  TechProps,
  SectionHeadingProps,
  ThemeTextProps,
};
