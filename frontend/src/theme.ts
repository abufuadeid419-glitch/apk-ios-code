// Design tokens for this app. Light theme only.Always modify the colors and theme to Dark, Light or Dark and Light according to the design guidelines.
//
// The keys match the "color" block of /app/design_guidelines.json. Fill the
// values from that file (or from the user's brand colors). Keep every key; do
// not add a second theme or colors file; do not write color literals in
// components.
//
// How the names work: a plain key is a background, and its `on` partner is the
// text or icon color that sits on top of it. Always use them as a pair.
//   <View style={{ backgroundColor: colors.brandPrimary }}>
//     <Text style={{ color: colors.onBrandPrimary }}>Continue</Text>
//   </View>
//
// Styling a screen or component: build the sheet with makeStyles so colors
// and layout live together and follow the active scheme:
//   const useStyles = makeStyles((colors) => ({
//     card: { backgroundColor: colors.surfaceSecondary, padding: 16 },
//     title: { color: colors.onSurfaceSecondary, fontSize: 16 },
//   }));
//   function Screen() {
//     const styles = useStyles();
//     return <View style={styles.card}><Text style={styles.title}>Hi</Text></View>;
//   }
// For color props that are not styles (icon color, placeholderTextColor,
// ActivityIndicator) read useTheme().colors inside the component.
// Never call StyleSheet.create with color values at module level; it cannot
// follow the scheme.
//
// To support dark mode later: add `dark` to `themes` with every key filled.
// Nothing else changes; the device setting takes over automatically.
// Feel free to add as many new colors as you need to support the design guidelines.

import { useMemo } from "react";
import { Appearance, StyleSheet, useColorScheme } from "react-native";

import { storage } from "@/src/utils/storage";

export type ColorScheme = "light" | "dark";

const light = {
  surface: "#FAFAFA",
  onSurface: "#18181B",
  surfaceSecondary: "#FFFFFF",
  onSurfaceSecondary: "#3F3F46",
  surfaceTertiary: "#F4F4F5",
  onSurfaceTertiary: "#27272A",
  surfaceInverse: "#18181B",
  onSurfaceInverse: "#FAFAFA",
  brand: "#A13D2D",
  brandPrimary: "#A13D2D",
  onBrandPrimary: "#FFFFFF",
  brandSecondary: "#E8BAB3",
  onBrandSecondary: "#3D140E",
  brandTertiary: "#F5E1DE",
  onBrandTertiary: "#7A2A1E",
  success: "#2E7D32",
  onSuccess: "#FFFFFF",
  warning: "#C25700",
  onWarning: "#FFFFFF",
  error: "#D32F2F",
  onError: "#FFFFFF",
  info: "#455A64",
  onInfo: "#FFFFFF",
  border: "#E4E4E7",
  borderStrong: "#D4D4D8",
  divider: "#E4E4E7",
  muted: "#71717A",
  onBrand: "#FFFFFF",
  overlay: "rgba(0,0,0,0.4)",
  pro: "#B8912A",
  onPro: "#1A1813",
};

export type ThemeColors = typeof light;

const dark: ThemeColors = {
  surface: "#121212",
  onSurface: "#F5F5F5",
  surfaceSecondary: "#1E1E1E",
  onSurfaceSecondary: "#E0E0E0",
  surfaceTertiary: "#2C2C2C",
  onSurfaceTertiary: "#D4D4D4",
  surfaceInverse: "#F5F5F5",
  onSurfaceInverse: "#121212",
  brand: "#E57373",
  brandPrimary: "#E57373",
  onBrandPrimary: "#1A0805",
  brandSecondary: "#7A2A1E",
  onBrandSecondary: "#F5E1DE",
  brandTertiary: "#3D140E",
  onBrandTertiary: "#F2C6BF",
  success: "#81C784",
  onSuccess: "#121212",
  warning: "#FFB74D",
  onWarning: "#121212",
  error: "#EF8A8A",
  onError: "#121212",
  info: "#90A4AE",
  onInfo: "#121212",
  border: "#333333",
  borderStrong: "#4F4F4F",
  divider: "#2E2E2E",
  muted: "#A1A1AA",
  onBrand: "#121212",
  overlay: "rgba(0,0,0,0.6)",
  pro: "#F1D570",
  onPro: "#1A1813",
};

export const defaultScheme = "light" satisfies ColorScheme;

export const themes: { light: ThemeColors; dark?: ThemeColors } = { light, dark };

// User preference: "system" follows the device; persisted across launches.
export type ThemePref = "system" | "light" | "dark";
export const THEME_PREF_KEY = "theme_pref";
export function applyThemePref(p: ThemePref) {
  setColorScheme(p === "system" ? null : p);
}

// In-app theme toggle, only after `dark` exists in `themes`. Call
// setColorScheme("dark"), setColorScheme("light"), or setColorScheme(null) to
// follow the device. Every useTheme() consumer re-renders. Persisting the
// choice and re-applying it on launch is the toggle's job.
export function setColorScheme(scheme: ColorScheme | null) {
  // RN 0.86 re-reads the device scheme only for the literal "unspecified";
  // null would pin useColorScheme() to null and the app to light.
  Appearance.setColorScheme?.(scheme ?? "unspecified");
}

// Keep native surfaces (alerts, pickers, navigation chrome) on the schemes this
// app ships: light only forces light; once `dark` exists the device decides.
// Optional call because react-native-web does not implement it.
setColorScheme?.(themes.dark ? null : defaultScheme);
storage.getItem<ThemePref>(THEME_PREF_KEY, "system").then((p) => p && p !== "system" && applyThemePref(p));

export function useTheme(): { scheme: ColorScheme; colors: ThemeColors } {
  const system = useColorScheme() as string | null | undefined;
  const scheme: ColorScheme = system === "dark" && themes.dark ? "dark" : system === "light" ? "light" : defaultScheme;
  return { scheme, colors: themes[scheme] ?? themes.light };
}

// Themed StyleSheet: returns a hook that builds the sheet from the active
// scheme's colors and memoizes it until the scheme changes.
export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: ThemeColors) => T & StyleSheet.NamedStyles<any>,
): () => T {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}



export const fonts = { regular: "Cairo", semibold: "Cairo-SemiBold", bold: "Cairo-Bold" };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 6, md: 12, lg: 20, pill: 999 };
