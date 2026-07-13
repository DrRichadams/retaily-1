import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function CashierLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 20,
          height: 70,
          borderRadius: 35,
          elevation: 8,
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
          marginHorizontal: 8,
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#94A3B8",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Sell",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#2563EB" : "transparent",
                borderRadius: 20,
                padding: 8,
              }}
            >
              <Ionicons
                name={focused ? "cart" : "cart-outline"}
                color={focused ? "#FFF" : color}
                size={22}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen name="products" options={{ headerShown: false }} />
      <Tabs.Screen name="customers" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
    </Tabs>
  );
}
