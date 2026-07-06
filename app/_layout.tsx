import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { createContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { themeColors } from "../constants/colors"; // Adjust path if saving to a theme directory

// 1. Initialize Context with strict structural safety defaults
export const ThemeContext = createContext({
  isDarkMode: false,
  colors: themeColors.light,
  toggleTheme: () => {},
});

export default function RootLayout() {
  // Sync automatically with device operating system settings as a fallback default
  const deviceColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceColorScheme === "dark");

  // React to OS-level theme toggles natively
  useEffect(() => {
    setIsDarkMode(deviceColorScheme === "dark");
  }, [deviceColorScheme]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const currentColors = isDarkMode ? themeColors.dark : themeColors.light;

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, colors: currentColors, toggleTheme }}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} translucent />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(merchant)" />
        <Stack.Screen name="(staff)" />
      </Stack>
    </ThemeContext.Provider>
  );
}
