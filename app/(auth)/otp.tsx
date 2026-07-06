import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/TopBar";
import { ThemeContext } from "../_layout";

export default function OTPScreen() {
  const router = useRouter();
  const { identity } = useLocalSearchParams<{ identity: string }>();
  const { isDarkMode, colors } = useContext(ThemeContext);

  const gradientColors = isDarkMode
    ? ["#0F172A", "#1E293B", "#0F172A"]
    : ["#E1E6F0", "#D3DAE8", "#C3CDE3"];

  const [otp, setOtp] = useState<string[]>(() => new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(59);
  const inputRefs = useRef<TextInput[]>([]);

  // Stable Memoized condition tracker to catch when typing ends
  const isComplete = useMemo(() => {
    return otp.every((val) => val !== undefined && val.trim() !== "");
  }, [otp]);

  // Unified pass-through submission to Route 4: Fork Pathway Selection
  const handleVerifyOTP = () => {
    const code = otp.join("");
    if (code.length === 6) {
      router.push("/(auth)/accounttype");
    }
  };

  // Instant execution trigger when 6th digit lands
  useEffect(() => {
    if (isComplete) {
      handleVerifyOTP();
    }
  }, [isComplete]);

  // Clock Countdown Management for Resending Actions
  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, "");
    const newOtp = [...otp];

    // Support seamless copy/paste actions
    if (cleanText.length > 1) {
      const splitText = cleanText.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newOtp[i] = splitText[i] || "";
      }
      setOtp(newOtp);
      inputRefs.current[Math.min(splitText.length - 1, 5)]?.focus();
      return;
    }

    newOtp[index] = cleanText;
    setOtp(newOtp);

    // Forward digit auto-jumping focus controls
    if (cleanText !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Backward destructive focus shifting on delete click
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(59);
    }
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
        {/* FIX: KeyboardAvoidingView sits inside the full viewport constraint mapping */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined} // Stripping behavior from Android completely resolves soft layout shifts
          style={styles.keyboardAvoidView}
        >
          <View style={styles.outerLayoutStructure}>
            <ScrollView
              contentContainerStyle={styles.scrollGrowContainer}
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.topAndFormFlowContainer}>
                <View style={styles.headerRow}>
                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={24}
                      color={colors.primaryText}
                    />
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <TopBar />
                  </View>
                </View>

                <Animated.View
                  entering={FadeIn.duration(200)}
                  style={styles.textSection}
                >
                  <Text style={[styles.title, { color: colors.primaryText }]}>
                    Verify Security Code
                  </Text>
                  <Text
                    style={[styles.subtitle, { color: colors.secondaryText }]}
                  >
                    We sent a verification authorization code token directly to
                    your identity node at{" "}
                    <Text
                      style={{ fontWeight: "700", color: colors.primaryText }}
                    >
                      {identity || "your credential identifier"}
                    </Text>
                    .
                  </Text>
                </Animated.View>

                {/* THE MASKED 6-DIGIT FIELD ARRAY */}
                <View style={styles.otpOuterWrapper}>
                  {otp.map((digit, index) => (
                    <React.Fragment key={index}>
                      <View
                        style={[
                          styles.otpBox,
                          {
                            backgroundColor: colors.inputBg,
                            borderColor: digit
                              ? colors.accent
                              : colors.inputBorder,
                          },
                        ]}
                      >
                        <TextInput
                          ref={(el) =>
                            (inputRefs.current[index] = el as TextInput)
                          }
                          value={digit}
                          onChangeText={(text) => handleOtpChange(text, index)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                          keyboardType="number-pad"
                          maxLength={1}
                          selectTextOnFocus
                          style={[
                            styles.otpInput,
                            { color: colors.primaryText },
                          ]}
                          textAlign="center"
                        />
                      </View>
                      {index === 2 && (
                        <View
                          style={[
                            styles.centerHyphen,
                            { backgroundColor: colors.inputBorder },
                          ]}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </View>

                {/* TIMERS & HELP ACTION CONTROLS */}
                <View style={styles.assistanceLinkRow}>
                  {resendTimer > 0 ? (
                    <Text
                      style={[
                        styles.timerText,
                        { color: colors.secondaryText },
                      ]}
                    >
                      Resend authorization pass code in{" "}
                      <Text style={{ fontWeight: "600", color: colors.accent }}>
                        {resendTimer}s
                      </Text>
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={handleResend}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.resendActionLink,
                          { color: colors.accent },
                        ]}
                      >
                        Request a new access code
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>

            {/* FIX: Moving the footer completely OUTSIDE the ScrollView keeps it pinned at the baseline, entirely immune to keyboard layout flickering */}
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
                name="lock-closed-outline"
                size={13}
                color={colors.secondaryText}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[styles.secureText, { color: colors.secondaryText }]}
              >
                Secured End-to-End by Retaily Ecosystem Engine
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootWrapper: { flex: 1 },
  safeAreaContainer: { flex: 1 },
  keyboardAvoidView: { flex: 1 },
  outerLayoutStructure: { flex: 1, justifyContent: "space-between" }, // Coordinates the main page and the solid footer block
  scrollGrowContainer: { flexGrow: 1, paddingBottom: 24 },
  topAndFormFlowContainer: { width: "100%" },

  headerRow: { flexDirection: "row", alignItems: "center", paddingRight: 4 },
  backButton: {
    paddingLeft: 24,
    paddingRight: 4,
    height: 56,
    justifyContent: "center",
  },
  textSection: { paddingHorizontal: 24, marginTop: 12 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 6 },
  subtitle: { fontSize: 14, lineHeight: 20 },

  otpOuterWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 24,
    marginTop: 32,
    width: "100%",
  },
  otpBox: {
    width: 44,
    height: 54,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  otpInput: {
    width: "100%",
    height: "100%",
    fontSize: 20,
    fontWeight: "700",
    padding: 0,
  },
  centerHyphen: { width: 10, height: 2, marginHorizontal: 2, opacity: 0.6 },

  assistanceLinkRow: { alignItems: "center", marginTop: 24, width: "100%" },
  timerText: { fontSize: 13, fontWeight: "500" },
  resendActionLink: {
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  // Cleaned Fixed Footer Matrix
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
