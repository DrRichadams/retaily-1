import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemeContext } from "../app/_layout";

export default function TopBar() {
  const { isDarkMode, colors, toggleTheme } = useContext(ThemeContext);

  // Shared value tracking switch position: 0 for Light, 1 for Dark
  const switchProgress = useSharedValue(isDarkMode ? 1 : 0);

  // Keep animation value perfectly in sync with state context alterations
  useEffect(() => {
    switchProgress.value = withSpring(isDarkMode ? 1 : 0, {
      damping: 15,
      stiffness: 120,
    });
  }, [isDarkMode]);

  // Animated style moving the internal sliding knob left or right
  const animatedKnobStyle = useAnimatedStyle(() => {
    const translation = switchProgress.value * 22; // Distance range of the slider track track
    return {
      transform: [{ translateX: translation }],
    };
  });

  // Animated track color shift matching Retaily profiles
  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      switchProgress.value,
      [0, 1],
      ["rgba(11, 34, 64, 0.15)", "rgba(56, 189, 248, 0.3)"], // Soft light track vs glowing dark mode track
    );
    return { backgroundColor };
  });

  return (
    <View style={styles.container}>
      {/* LEFT SIDE: Premium Glassmorphic System Status Pill */}
      <View
        style={[
          styles.systemPill,
          {
            backgroundColor: isDarkMode
              ? "rgba(30, 41, 59, 0.45)"
              : "rgba(255, 255, 255, 0.45)",
            borderColor: isDarkMode
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(11, 34, 64, 0.08)",
          },
        ]}
      >
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isDarkMode ? "#38BDF8" : "#1A44B8" },
          ]}
        />
        <Text style={[styles.systemPillText, { color: colors.primaryText }]}>
          RETAILY{" "}
          <Text style={{ fontWeight: "400", opacity: 0.7 }}>OS v1.0</Text>
        </Text>
      </View>

      {/* RIGHT SIDE: Smooth Slide Switch Toggle Container */}
      <View style={styles.rightControlBlock}>
        {/* Ambient Mode Icon indicators flanking the switch */}
        <Ionicons
          name="sunny"
          size={16}
          color={isDarkMode ? "rgba(245, 158, 11, 0.4)" : "#F59E0B"}
          style={styles.flankingIcon}
        />

        <TouchableOpacity
          onPress={toggleTheme}
          activeOpacity={0.9}
          style={styles.switchTouchTarget}
        >
          {/* Animated Track backdrop */}
          <Animated.View style={[styles.switchTrack, animatedTrackStyle]}>
            {/* Animated Sliding Knob Capsule */}
            <Animated.View
              style={[
                styles.switchKnob,
                { backgroundColor: isDarkMode ? "#38BDF8" : "#0B2240" },
                animatedKnobStyle,
              ]}
            />
          </Animated.View>
        </TouchableOpacity>

        <Ionicons
          name="moon"
          size={14}
          color={isDarkMode ? "#38BDF8" : "rgba(11, 34, 64, 0.4)"}
          style={styles.flankingIcon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: Platform.OS === "android" ? 4 : 0,
  },
  systemPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  systemPillText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  // Custom Slider Layout Structure
  rightControlBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  flankingIcon: {
    alignSelf: "center",
  },
  switchTouchTarget: {
    paddingVertical: 4,
  },
  switchTrack: {
    width: 48,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: "center",
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
  },
});
