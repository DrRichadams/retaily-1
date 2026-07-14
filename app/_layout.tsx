import { ThemeContext, ThemeProvider } from "@/utils/themeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";

export default function RootLayout() {
  const theme = useContext(ThemeContext);
  return (
    <ThemeProvider>
      <StatusBar style={theme.isDarkMode ? "light" : "dark"} translucent />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(Cashier)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
