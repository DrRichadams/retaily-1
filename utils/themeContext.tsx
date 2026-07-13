import { themeColors } from "@/constants/colors";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext({
  colors: {
    ...themeColors.dark,
  },
  isDarkMode: false,
});

export function ThemeProvider({ children }: PropsWithChildren) {
  const deviceColorScheme = useColorScheme();
  const isDark = deviceColorScheme === "dark";
  const [colors, setColors] = useState(
    isDark ? themeColors.dark : themeColors.light,
  );
  const [isDarkMode, setIsDarkMode] = useState(deviceColorScheme === "dark");

  useEffect(() => {
    setIsDarkMode(isDark);
    setColors(isDark ? themeColors.dark : themeColors.light);
  }, [deviceColorScheme]);

  return (
    <ThemeContext.Provider value={{ colors, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
