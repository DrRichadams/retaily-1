import { Tabs } from "expo-router";

export default function CashierLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 20,
          height: 68,
          borderRadius: 30,
          elevation: 8,
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
          marginHorizontal: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabel: "Sell",
          // tabBarIcon: () => (
          //   <Image
          //     source={require("../../assets/common-graphics/logo-mini.png")}
          //     style={{ width: 20, height: 20 }}
          //   />
          // ),
        }}
      />
      <Tabs.Screen name="products" options={{ headerShown: false }} />
      <Tabs.Screen name="customers" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
    </Tabs>
  );
}
