import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function CashierLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          // left: 16,
          // left: ((100 % -80) % width) / 2,
          right: 16,
          bottom: 20,
          height: 70,
          borderRadius: 35,
          // width: "80%",
          // elevation: 8,
          // shadowOpacity: 0.15,
          // shadowRadius: 12,
          // shadowOffset: { width: 0, height: 8 },
          // marginHorizontal: 8,
          marginHorizontal: 45,
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarShowLabel: false,

        tabBarIconStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },

        // 2. Adjust the tab bar item styling if needed to remove default margins
        tabBarItemStyle: {
          justifyContent: "center",
          alignContent: "center",
        },
        tabBarActiveBackgroundColor: "transparent",
      }}
    >
      <Tabs.Screen
        name="products"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                // backgroundColor: focused ? "#2563EB" : "transparent",
                // borderRadius: 20,
                padding: 0,
              }}
            >
              <Ionicons
                name={focused ? "cube" : "cube-outline"}
                color={focused ? "#2563EB" : color}
                size={30}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Sell",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                // backgroundColor: focused ? "#2563EB" : "transparent",
                // borderRadius: 20,
                padding: 0,
              }}
            >
              <Ionicons
                name={focused ? "wallet" : "wallet-outline"}
                color={focused ? "#2563EB" : color}
                size={30}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                // backgroundColor: focused ? "#2563EB" : "transparent",
                // borderRadius: 20,
                padding: 0,
              }}
            >
              <Ionicons
                name={focused ? "people-circle" : "people-circle-outline"}
                color={focused ? "#2563EB" : color}
                size={30}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
