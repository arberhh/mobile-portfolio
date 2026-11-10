import "react-native";

// react-native-web renders `dataSet` as data-* attributes (the hooks for the
// CSS in app/+html.tsx); react-native's own types don't know about it.
declare module "react-native" {
  interface ViewProps {
    dataSet?: Record<string, string>;
  }
  interface TextProps {
    dataSet?: Record<string, string>;
    // Heading level for role="header" (react-native-web renders <h1>…<h6>).
    "aria-level"?: number;
  }
}
