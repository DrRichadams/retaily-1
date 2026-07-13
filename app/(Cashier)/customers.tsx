import { ThemeContext } from "@/utils/themeContext";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Customers() {
  const theme = useContext(ThemeContext);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={{ color: "red", flex: 1 }}>Customers</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 2,
    // marginTop: 12,
  },
  box: {
    flex: 1,
    height: 100,
  },
});
