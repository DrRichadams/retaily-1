import React, { useContext } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ThemeContext } from "../app/_layout";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function CustomButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: CustomButtonProps) {
  const { colors, isDarkMode } = useContext(ThemeContext);

  // Dynamic style calculations mapping Retaily palette specs perfectly
  const buttonBgColor = disabled
    ? isDarkMode
      ? "rgba(56, 189, 248, 0.2)"
      : "rgba(11, 34, 64, 0.25)"
    : colors.primaryText;

  const buttonTextColor = disabled
    ? colors.secondaryText
    : isDarkMode
      ? "#0F172A"
      : "#FFFFFF";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.buttonContainer,
        { backgroundColor: buttonBgColor },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={buttonTextColor} />
      ) : (
        <Text
          style={[styles.buttonText, { color: buttonTextColor }, textStyle]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: 54,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    // elevation: 1,
  },
  buttonText: { fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
});
