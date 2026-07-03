import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../theme/colors";

// Fixed dimensions for precise layout calculations
const TOGGLE_WIDTH = 110;
const TOGGLE_HEIGHT = 40;
const CIRCLE_SIZE = 32;
const MARGIN = 4;
const SLIDE_DISTANCE = TOGGLE_WIDTH - CIRCLE_SIZE - MARGIN * 2; // Distance the circle moves left-to-right

export default function TopBar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const animationProgress = useSharedValue(0);

  const toggleDarkMode = () => {
    const nextValue = isDarkMode ? 0 : 1;
    animationProgress.value = withTiming(nextValue, { duration: 300 });
    setIsDarkMode(!isDarkMode);
  };

  // 1. Container Background Animation (Light gray/white to Dark blue/slate)
  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      ["#FFFFFF", "#4A5B78"],
    );
    return { backgroundColor };
  });

  // 2. Sliding Circle Style (Handles both X position and internal background change)
  const animatedCircleStyle = useAnimatedStyle(() => {
    const translateX = animationProgress.value * SLIDE_DISTANCE;
    const backgroundColor = interpolateColor(
      animationProgress.value,
      [0, 1],
      ["#0B2240", "#FFFFFF"],
    );
    return {
      transform: [{ translateX }],
      backgroundColor,
    };
  });

  // 3. Text Fading & Opacity (Smoothly crossfades Light Mode/Dark Mode text layers)
  const lightTextStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDarkMode ? 0 : 1, { duration: 200 }),
  }));

  const darkTextStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDarkMode ? 1 : 0, { duration: 200 }),
  }));

  return (
    <View style={styles.headerContainer}>
      {/* Left Side: Language Picker */}
      <TouchableOpacity style={styles.languageDropdown} activeOpacity={0.7}>
        <Ionicons name="globe-outline" size={20} color={colors.primary} />
        <Text style={styles.languageText}>English</Text>
        <Ionicons
          name="chevron-down"
          size={14}
          color={colors.primary}
          style={styles.chevron}
        />
      </TouchableOpacity>

      {/* Right Side: Re-engineered Slide Switch */}
      <TouchableOpacity activeOpacity={0.9} onPress={toggleDarkMode}>
        <Animated.View style={[styles.togglePill, animatedContainerStyle]}>
          {/* Static Text Layers layer behind/beside the sliding path */}
          <Animated.View
            style={[styles.textWrapper, styles.lightTextPos, lightTextStyle]}
          >
            <Text style={styles.lightLabel}>Dark Mode</Text>
          </Animated.View>

          <Animated.View
            style={[styles.textWrapper, styles.darkTextPos, darkTextStyle]}
          >
            <Text style={styles.darkLabel}>Light Mode</Text>
          </Animated.View>

          {/* Smooth Sliding Circle Container */}
          <Animated.View style={[styles.iconCircle, animatedCircleStyle]}>
            <Ionicons
              name={isDarkMode ? "moon-outline" : "sunny-outline"}
              size={18}
              color={isDarkMode ? "#0B2240" : "#FFFFFF"}
            />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    width: "100%",
  },
  languageDropdown: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 6,
  },
  chevron: {
    marginLeft: 4,
    marginTop: 2,
  },
  togglePill: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    borderRadius: TOGGLE_HEIGHT / 2,
    position: "relative",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: MARGIN,
  },
  textWrapper: {
    position: "absolute",
    justifyContent: "center",
  },
  // When circle is left (Light mode), text aligns right
  lightTextPos: {
    right: 14,
  },
  // When circle is right (Dark mode), text aligns left
  darkTextPos: {
    left: 14,
  },
  lightLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0B2240",
  },
  darkLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
