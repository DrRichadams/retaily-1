import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../theme/colors";

interface CustomInputProps extends TextInputProps {
  containerStyle?: ViewStyle; // Added to handle layout overrides
}

export default function CustomInput({
  style,
  containerStyle,
  ...restProps
}: CustomInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textMuted}
        {...restProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  input: {
    width: "100%",
    height: 54,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.primary,
  },
});
