import { ThemeContext } from "@/utils/themeContext";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const theme = useContext(ThemeContext);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        backgroundColor: "red",
      }}
    >
      <View style={[styles.container, { backgroundColor: "blue" }]}>
        <Text style={{ color: "red", flex: 1 }}>THIS IS A CONTAINER VIEW</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
