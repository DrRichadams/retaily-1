import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface CustomInputProps {
  title: string;
  disabled: boolean;
  onPress: (text: string) => void;
  isGoogleButton?: boolean;
}

export default function CustomButton({
  title,
  disabled,
  onPress,
}: CustomInputProps) {
  return (
    <Pressable style={styles.button}>
      <Text style={{ color: "#fff" }}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#123CBB",
    padding: 15,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
