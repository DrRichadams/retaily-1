import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/TopBar";
import { ThemeContext } from "../_layout";

export default function AccountTypeScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useContext(ThemeContext);

  const gradientColors = isDarkMode
    ? ["#0F172A", "#1E293B", "#0F172A"]
    : ["#E1E6F0", "#D3DAE8", "#C3CDE3"];

  const handleSelectRole = (role: "Merchant" | "Staff") => {
    // Navigate straight to Screen 5/6: Registration Form Passing Selected Role Query Params
    router.push({
      pathname: "/(auth)/registration",
      params: { selectedRole: role },
    });
  };

  return (
    <View style={styles.rootWrapper}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeAreaContainer}>
        <TopBar />

        <View style={styles.contentContainer}>
          {/* Header Typography with Slide Fade Effects */}
          <Animated.View
            entering={FadeInUp.duration(400).delay(100)}
            style={styles.headerBlock}
          >
            <Text style={[styles.title, { color: colors.primaryText }]}>
              Choose Account Type
            </Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Are you setting up an enterprise workspace as a business owner, or
              connecting to an existing shop as a cashier or manager?
            </Text>
          </Animated.View>

          {/* CHANNELS FLOW FORK */}
          <View style={styles.cardsTrack}>
            {/* OPTION 1: MERCHANT CORE CONTAINER */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(200)}
              style={styles.fullWidth}
            >
              <TouchableOpacity
                onPress={() => handleSelectRole("Merchant")}
                activeOpacity={0.85}
                style={[
                  styles.roleCard,
                  {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    borderWidth: isDarkMode ? 0:2
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(56, 189, 248, 0.15)"
                        : "rgba(26, 68, 184, 0.15)",
                    },
                  ]}
                >
                  <Ionicons name="business" size={28} color={colors.accent} />
                </View>

                <View style={styles.cardTextContent}>
                  <Text
                    style={[styles.cardTitle, { color: colors.primaryText }]}
                  >
                    Store Owner / Merchant
                  </Text>
                  <Text
                    style={[
                      styles.cardDescription,
                      { color: colors.secondaryText },
                    ]}
                  >
                    Create multi-branch organizations, track inventory defaults,
                    manage currency configurations, and analyze system sales
                    metrics.
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.secondaryText}
                  style={styles.chevron}
                />
              </TouchableOpacity>
            </Animated.View>

            {/* OPTION 2: STORE STAFF CORE CONTAINER */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(350)}
              style={styles.fullWidth}
            >
              <TouchableOpacity
                onPress={() => handleSelectRole("Staff")}
                activeOpacity={0.85}
                style={[
                  styles.roleCard,
                  {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(16, 185, 129, 0.15)",
                    },
                  ]}
                >
                  <FontAwesome5
                    name="id-badge"
                    size={26}
                    color={isDarkMode ? "#10B981" : "#059669"}
                  />
                </View>

                <View style={styles.cardTextContent}>
                  <Text
                    style={[styles.cardTitle, { color: colors.primaryText }]}
                  >
                    Cashier / Shop Manager
                  </Text>
                  <Text
                    style={[
                      styles.cardDescription,
                      { color: colors.secondaryText },
                    ]}
                  >
                    Secure point-of-sale terminal clearance, run register shift
                    checkouts, lookup ecosystem loyalty accounts, and process
                    purchases.
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.secondaryText}
                  style={styles.chevron}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* SECURE STATIONARY SYSTEM FOOTER */}
        <View
          style={[
            styles.footerContainer,
            {
              borderTopColor: isDarkMode
                ? "rgba(255,255,255,0.03)"
                : "rgba(11,34,64,0.03)",
            },
          ]}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={13}
            color={colors.secondaryText}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.secureText, { color: colors.secondaryText }]}>
            Hierarchy Enforcement Core • Retaily OS
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootWrapper: { flex: 1 },
  safeAreaContainer: { flex: 1, justifyContent: "space-between" },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  headerBlock: { marginBottom: 36 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 8,
  },

  cardsTrack: { gap: 16, width: "100%" },
  fullWidth: { width: "100%" },

  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.02,
    //     shadowRadius: 3,
    //   },
    //   android: {
    //     elevation: 1,
    //   },
    // }),
  },
  iconWrapper: {
    backgroundColor: "red",
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTextContent: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  cardDescription: { fontSize: 13, lineHeight: 18, opacity: 0.9 },
  chevron: { marginLeft: 4 },

  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    width: "100%",
    opacity: 0.7,
    borderTopWidth: 1,
  },
  secureText: { fontSize: 11, fontWeight: "600", letterSpacing: 0.3 },
});
