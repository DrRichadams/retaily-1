import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import TopBar from "../../components/TopBar";
import { ThemeContext } from "../_layout"; // Subscribed to centralized layout context

export default function LoginScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useContext(ThemeContext);

  // Gradient transitions automatically respond to theme context shifts
  const gradientColors = isDarkMode
    ? ["#0F172A", "#1E293B", "#0F172A"]
    : ["#E1E6F0", "#D3DAE8", "#C3CDE3"];

  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [countryCode, setCountryCode] = useState("+263");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const isButtonDisabled =
    activeTab === "email" ? !email.trim() : !phone.trim();

  const handleNextStep = () => {
    const userIdentity =
      activeTab === "email" ? email.trim() : `${countryCode}${phone.trim()}`;
    router.push({
      pathname: "/(auth)/otp",
      params: { identity: userIdentity, type: activeTab },
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
        >
          <ScrollView
            contentContainerStyle={styles.scrollGrowContainer}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentLayoutInner}>
              <View style={styles.topAndFormFlowContainer}>
                <TopBar />

                <View style={styles.topSection}>
                  <Image
                    source={require("../../assets/common-graphics/logo-mini.png")}
                    style={styles.logo}
                  />
                  <Text style={[styles.title, { color: colors.primaryText }]}>
                    Continue to Retaily
                  </Text>
                  <Text
                    style={[styles.subtitle, { color: colors.primaryText }]}
                  >
                    Sign in to access your organizations, point-of-sale checkout
                    terminals, and cloud business metrics.
                  </Text>

                  {/* Dynamic Underlined Segment Tabs */}
                  <View style={styles.tabContainer}>
                    <TouchableOpacity
                      onPress={() => setActiveTab("email")}
                      style={[
                        styles.tab,
                        activeTab === "email" && {
                          borderBottomColor: colors.accent,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          {
                            color:
                              activeTab === "email"
                                ? colors.accent
                                : colors.secondaryText,
                          },
                        ]}
                      >
                        Email Address
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setActiveTab("phone")}
                      style={[
                        styles.tab,
                        activeTab === "phone" && {
                          borderBottomColor: colors.accent,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          {
                            color:
                              activeTab === "phone"
                                ? colors.accent
                                : colors.secondaryText,
                          },
                        ]}
                      >
                        Phone Number
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Form Inputs Container */}
                <View style={styles.mainContentArea}>
                  <Animated.View
                    layout={LinearTransition.springify().damping(16).mass(0.8)}
                    style={styles.fullWidth}
                  >
                    {activeTab === "email" ? (
                      <Animated.View
                        entering={FadeIn.duration(180)}
                        exiting={FadeOut.duration(100)}
                        style={styles.fullWidth}
                      >
                        <CustomInput
                          placeholder="Enter your email address"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                        />
                      </Animated.View>
                    ) : (
                      <Animated.View
                        entering={FadeIn.duration(180)}
                        exiting={FadeOut.duration(100)}
                        style={styles.fullWidth}
                      >
                        <View
                          style={[
                            styles.phoneInputGroup,
                            {
                              backgroundColor: colors.inputBg,
                              borderColor: colors.inputBorder,
                            },
                          ]}
                        >
                          <TouchableOpacity
                            style={styles.countryPickerButton}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.countryCodeText,
                                { color: colors.primaryText },
                              ]}
                            >
                              {countryCode}
                            </Text>
                            <Ionicons
                              name="chevron-down"
                              size={14}
                              color={colors.secondaryText}
                              style={styles.dropdownChevron}
                            />
                          </TouchableOpacity>
                          <View
                            style={[
                              styles.verticalDivider,
                              { backgroundColor: colors.inputBorder },
                            ]}
                          />
                          <CustomInput
                            placeholder="Enter phone number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            style={styles.inlineInputOverride}
                            containerStyle={styles.inlineContainerOverride}
                          />
                        </View>
                      </Animated.View>
                    )}

                    <View style={styles.buttonSpacer}>
                      <CustomButton
                        title="Next"
                        disabled={isButtonDisabled}
                        onPress={handleNextStep}
                      />
                    </View>

                    <Text
                      style={[styles.footerText, { color: colors.primaryText }]}
                    >
                      By continuing, you agree to the{" "}
                      <Text style={[styles.link, { color: colors.accent }]}>
                        Terms of Service
                      </Text>{" "}
                      and{" "}
                      <Text style={[styles.link, { color: colors.accent }]}>
                        Privacy Policy
                      </Text>
                      .
                    </Text>
                  </Animated.View>
                </View>
              </View>

              {/* SSO Loyalty Ecosystem Connection Grid */}
              <View style={styles.alternativeLoginContainer}>
                <Text style={[styles.orText, { color: colors.secondaryText }]}>
                  or connect account with
                </Text>
                <View style={styles.socialRow}>
                  <TouchableOpacity
                    style={[
                      styles.socialIconCircle,
                      {
                        backgroundColor: colors.inputBg,
                        borderColor: colors.inputBorder,
                      },
                    ]}
                  >
                    <FontAwesome5 name="google" size={20} color="#EA4335" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.socialIconCircle,
                      {
                        backgroundColor: colors.inputBg,
                        borderColor: colors.inputBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="logo-apple"
                      size={22}
                      color={isDarkMode ? "#FFFFFF" : "#000000"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.socialIconCircle,
                      {
                        backgroundColor: colors.inputBg,
                        borderColor: colors.inputBorder,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="microsoft"
                      size={22}
                      color="#F25022"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootWrapper: { flex: 1 },
  safeAreaContainer: { flex: 1 },
  keyboardAvoidView: { flex: 1 },
  scrollGrowContainer: { flexGrow: 1 },
  contentLayoutInner: { flex: 1, justifyContent: "space-between" },

  topAndFormFlowContainer: { width: "100%" },
  topSection: { paddingHorizontal: 24, paddingTop: 8 },
  logo: { width: 54, height: 54, marginBottom: 14, borderRadius: 12 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 6 },
  subtitle: { fontSize: 14, opacity: 0.8, marginBottom: 20, lineHeight: 20 },
  tabContainer: { flexDirection: "row", marginBottom: 16 },
  tab: {
    paddingBottom: 8,
    marginRight: 24,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabText: { fontSize: 16, fontWeight: "700" },

  mainContentArea: { paddingHorizontal: 24, width: "100%" },
  fullWidth: { width: "100%" },
  buttonSpacer: { marginTop: 12, width: "100%" },

  phoneInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 54,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  countryPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    paddingRight: 4,
  },
  countryCodeText: { fontSize: 16, fontWeight: "600" },
  dropdownChevron: { marginLeft: 4 },
  verticalDivider: { width: 1, height: 22, marginHorizontal: 6 },
  inlineContainerOverride: { flex: 1, marginBottom: 0 },
  inlineInputOverride: {
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 4,
    height: "100%",
    color: "inherit",
  },

  footerText: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 14,
    lineHeight: 18,
  },
  link: { fontWeight: "600" },

  alternativeLoginContainer: {
    alignItems: "center",
    paddingBottom: 24,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  orText: { fontSize: 13, fontWeight: "600", marginBottom: 12 },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 16 },
  socialIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
