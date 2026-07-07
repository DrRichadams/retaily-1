import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    FadeInRight,
    FadeOutLeft,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import TopBar from "../../components/TopBar";
import { ThemeContext } from "../_layout";

const BUSINESS_CATEGORIES = ["Grocery Store / Supermarket", "Apparel & Boutique", "Restaurant / Cafe", "Pharmacy", "Electronics & Wholesale", "Hardware & Construction"];
const PREFERRED_CURRENCIES = ["USD ($)", "ZWL (ZiG)", "ZAR (R)", "EUR (€)"];

function ActivePulseCircle({ colors, num }: { colors: any; num: number }) {
  const scaleValue = useSharedValue(1);
  useEffect(() => {
    scaleValue.value = withRepeat(withSequence(withTiming(1.2, { duration: 900 }), withTiming(1, { duration: 900 })), -1, true);
  }, []);
  const pulseRingStyle = useAnimatedStyle(() => ({ transform: [{ scale: scaleValue.value }], opacity: withTiming(0.35) }));
  return (
    <View style={styles.stepCircleOuter}>
      <Animated.View style={[styles.pulseRing, { borderColor: colors.accent }, pulseRingStyle]} />
      <View style={[styles.stepCircle, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
        <Text style={styles.stepNumberTextActive}>{num}</Text>
      </View>
    </View>
  );
}

export default function RegistrationScreen() {
  const router = useRouter();
  const { selectedRole } = useLocalSearchParams<{ selectedRole: "Merchant" | "Staff" }>();
  const { isDarkMode, colors } = useContext(ThemeContext);

  const isMerchant = selectedRole === "Merchant";
  const [currentStep, setCurrentStep] = useState(1);
  const activeBrandColor = isMerchant ? colors.accent : "#10B981";

  const gradientColors = isDarkMode ? ["#0F172A", "#1E293B", "#0F172A"] : ["#F8FAFC", "#E2E8F0", "#CBD5E1"];
  const lineProgress = useSharedValue(0);

  useEffect(() => {
    lineProgress.value = withSpring(currentStep > 1 ? 1 : 0, { damping: 15, stiffness: 100 });
  }, [currentStep]);

  const animatedLineStyle = useAnimatedStyle(() => ({ width: `${lineProgress.value * 100}%` }));

  const [orgName, setOrgName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [currency, setCurrency] = useState("");
  const [address, setAddress] = useState("");
  const [numShops, setNumShops] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const [staffName, setStaffName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isMerchantStep1Valid = useMemo(() => orgName.trim() !== "" && businessCategory !== "" && currency !== "", [orgName, businessCategory, currency]);
  const isMerchantStep2Valid = useMemo(() => address.trim() !== "" && numShops.trim() !== "", [address, numShops]);
  const isStaffValid = useMemo(() => staffName.trim() !== "" && organizationId.trim().length >= 4, [staffName, organizationId]);

  const handleNextOrSubmit = () => {
    if (isMerchant && currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // FIX: Standardized string parameter matching to accurately lock out staff
      router.push({
        pathname: "/(auth)/organization",
        params: { 
          userRole: selectedRole, // Passes "Staff" or "Merchant"
          targetOrgId: organizationId.trim().toUpperCase()
        }
      });
    }, 1500);
  };

  const handleBack = () => {
    if (isMerchant && currentStep === 2) {
      setCurrentStep(1);
      return;
    }
    router.back();
  };

  return (
    <View style={styles.rootWrapper}>
      <LinearGradient colors={gradientColors} start={{ x: 0.0, y: 0.0 }} end={{ x: 1.0, y: 1.0 }} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safeAreaContainer}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardAvoidView}>
          <View style={styles.outerLayoutStructure}>
            <ScrollView contentContainerStyle={styles.scrollGrowContainer} bounces={false} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={styles.topAndFormFlowContainer}>
                <View style={styles.headerRow}>
                  <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}><Ionicons name="chevron-back" size={24} color={colors.primaryText} /></TouchableOpacity>
                  <View style={{ flex: 1 }}><TopBar /></View>
                </View>

                <View style={styles.progressIndicatorTrack}>
                  <View style={styles.stepNodeBlock}>
                    {currentStep > 1 ? (
                      <View style={[styles.stepCircle, styles.stepCircleDone, { backgroundColor: isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(11,34,64,0.12)" }]}><Ionicons name="checkmark" size={13} color={isDarkMode ? colors.secondaryText : "#475569"} /></View>
                    ) : (
                      <ActivePulseCircle colors={{ ...colors, accent: activeBrandColor }} num={1} />
                    )}
                    <Text style={[styles.stepNodeLabel, { color: currentStep === 1 ? activeBrandColor : colors.secondaryText, fontWeight: currentStep === 1 ? "700" : "500" }]}>{isMerchant ? "Core Setup" : "Staff Profile"}</Text>
                  </View>
                  <View style={[styles.lineContainerContainer, { backgroundColor: isDarkMode ? "#334155" : "#E2E8F0" }]}><Animated.View style={[styles.animatedProgressBar, { backgroundColor: activeBrandColor }, animatedLineStyle]} /></View>
                  <View style={[styles.stepNodeBlock, !isMerchant && { opacity: 0.25 }]}>
                    {currentStep === 2 && isMerchant ? (
                      <ActivePulseCircle colors={{ ...colors, accent: activeBrandColor }} num={2} />
                    ) : (
                      <View style={[styles.stepCircle, { backgroundColor: isDarkMode ? colors.inputBg : "rgba(15,23,42,0.05)", borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1" }]}><Text style={[styles.stepNumberText, { color: colors.secondaryText }]}>2</Text></View>
                    )}
                    <Text style={[styles.stepNodeLabel, { color: currentStep === 2 ? activeBrandColor : colors.secondaryText, fontWeight: currentStep === 2 ? "700" : "500" }]}>{isMerchant ? "Localization" : "Awaiting Pass"}</Text>
                  </View>
                </View>

                <Animated.View layout={LinearTransition} style={styles.textSection}>
                  <Text style={[styles.title, { color: colors.primaryText }]}>{isMerchant ? (currentStep === 1 ? "Core Business Parameters" : "Localization & Outlets") : "Link Terminal Workspace"}</Text>
                  <Text style={[styles.subtitle, { color: colors.secondaryText }]}>{isMerchant ? (currentStep === 1 ? "Define your business workspace container name, unique industrial niche category, and preferred functional base operating currency setup." : "Specify your primary cloud backend physical office address and approximate initial store branch infrastructure count configurations.") : "Create your employee credential signature and enter the dynamic Organization ID token provided by your shop owner to join the register checkout queue."}</Text>
                </Animated.View>

                <View style={styles.mainContentArea}>
                  {isMerchant ? (
                    <View style={styles.fullWidth}>
                      {currentStep === 1 ? (
                        <Animated.View entering={FadeInRight.duration(250)} exiting={FadeOutLeft.duration(200)} style={styles.fullWidth}>
                          <CustomInput placeholder="Organization Name (e.g., Retaily CBD Wholesale)" value={orgName} onChangeText={setOrgName} placeholderTextColor={isDarkMode ? undefined : "#64748B"} style={!isDarkMode && styles.lightInputOverride} />
                          <TouchableOpacity style={[styles.dropdownSelector, { backgroundColor: isDarkMode ? colors.inputBg : "#FFFFFF", borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1" }]} onPress={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowCurrencyDropdown(false); }} activeOpacity={0.8}><Text style={[styles.dropdownValue, { color: businessCategory ? colors.primaryText : "#64748B" }]}>{businessCategory || "Select Business Category Niche"}</Text><Ionicons name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={16} color={colors.secondaryText} /></TouchableOpacity>
                          {showCategoryDropdown && (
                            <View style={[styles.dropdownMenu, { backgroundColor: isDarkMode ? colors.cardBg : "#FFFFFF", borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1" }]}>{BUSINESS_CATEGORIES.map((cat) => (<TouchableOpacity key={cat} style={[styles.dropdownItem, { borderBottomColor: isDarkMode ? "#334155" : "#F1F5F9" }]} onPress={() => { setBusinessCategory(cat); setShowCategoryDropdown(false); }}><Text style={[styles.dropdownItemText, { color: colors.primaryText }]}>{cat}</Text></TouchableOpacity>))}</View>
                          )}
                          <TouchableOpacity style={[styles.dropdownSelector, { backgroundColor: isDarkMode ? colors.inputBg : "#FFFFFF", borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1", marginTop: 16 }]} onPress={() => { setShowCurrencyDropdown(!showCurrencyDropdown); setShowCategoryDropdown(false); }} activeOpacity={0.8}><Text style={[styles.dropdownValue, { color: currency ? colors.primaryText : "#64748B" }]}>{currency || "Select Default Operating Currency"}</Text><Ionicons name={showCurrencyDropdown ? "chevron-up" : "chevron-down"} size={16} color={colors.secondaryText} /></TouchableOpacity>
                          {showCurrencyDropdown && (
                            <View style={[styles.dropdownMenu, { backgroundColor: isDarkMode ? colors.cardBg : "#FFFFFF", borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1" }]}>{PREFERRED_CURRENCIES.map((cur) => (<TouchableOpacity key={cur} style={[styles.dropdownItem, { borderBottomColor: isDarkMode ? "#334155" : "#F1F5F9" }]} onPress={() => { setCurrency(cur); setShowCurrencyDropdown(false); }}><Text style={[styles.dropdownItemText, { color: colors.primaryText }]}>{cur}</Text></TouchableOpacity>))}</View>
                          )}
                        </Animated.View>
                      ) : (
                        <Animated.View entering={FadeInRight.duration(250)} exiting={FadeOutLeft.duration(200)} style={styles.fullWidth}>
                          <CustomInput placeholder="Organization Physical Address" value={address} onChangeText={setAddress} multiline placeholderTextColor={isDarkMode ? undefined : "#64748B"} style={[styles.textareaStyle, !isDarkMode && styles.lightInputOverride]} />
                          <CustomInput placeholder="Estimated Number of Operating Shops/Outlets" value={numShops} onChangeText={setNumShops} keyboardType="numeric" placeholderTextColor={isDarkMode ? undefined : "#64748B"} style={!isDarkMode && styles.lightInputOverride} />
                        </Animated.View>
                      )}
                    </View>
                  ) : (
                    <Animated.View entering={FadeInRight.duration(250)} style={styles.fullWidth}>
                      <CustomInput placeholder="Your Full Name & Surname" value={staffName} onChangeText={setStaffName} placeholderTextColor={isDarkMode ? undefined : "#64748B"} style={!isDarkMode && styles.lightInputOverride} />
                      <CustomInput placeholder="Enter Organization ID (Get this from employer)" value={organizationId} onChangeText={setOrganizationId} autoCapitalize="characters" autoCorrect={false} maxLength={12} placeholderTextColor={isDarkMode ? undefined : "#64748B"} style={[styles.idInputField, !isDarkMode && styles.lightInputOverride]} />
                      <View style={[styles.assistanceNotificationBox, { backgroundColor: isDarkMode ? "rgba(16,185,129,0.06)" : "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.2)" }]}><Ionicons name="information-circle-outline" size={16} color="#10B981" style={{ marginRight: 8, marginTop: 1 }} /><Text style={styles.assistanceNotificationText}>Once you submit this code, your phone device will register its unique hardware node key inside that company's system. You will instantly move to the approval screen to wait for your manager's confirmation.</Text></View>
                    </Animated.View>
                  )}

                  <View style={styles.buttonWrapper}>
                    <CustomButton 
                      title={isMerchant ? (currentStep === 1 ? "Continue Setup" : "Initialize Business Space") : "Request Terminal Access"} 
                      disabled={isMerchant ? (currentStep === 1 ? !isMerchantStep1Valid : !isMerchantStep2Valid) : !isStaffValid} 
                      loading={isLoading}
                      onPress={handleNextOrSubmit}
                      style={!isDarkMode ? { backgroundColor: colors.primaryText } : undefined}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={[styles.footerContainer, { borderTopColor: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.06)" }]}><MaterialCommunityIcons name="server-security" size={13} color={colors.secondaryText} style={{ marginRight: 6 }} /><Text style={[styles.secureText, { color: colors.secondaryText }]}>Secured Cloud Space Database Initialization Node • Retaily OS</Text></View>
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
  outerLayoutStructure: { flex: 1, justifyContent: "space-between" },
  scrollGrowContainer: { flexGrow: 1, paddingBottom: 16 },
  topAndFormFlowContainer: { width: "100%" },
  headerRow: { flexDirection: "row", alignItems: "center", paddingRight: 4 },
  backButton: { paddingLeft: 24, paddingRight: 4, height: 56, justifyContent: "center" },
  progressIndicatorTrack: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 48, marginTop: 14, marginBottom: 16, width: "100%" },
  stepNodeBlock: { alignItems: "center", width: 74 },
  stepCircleOuter: { width: 34, height: 34, justifyContent: "center", alignItems: "center", position: "relative" },
  pulseRing: { position: "absolute", width: 34, height: 34, borderRadius: 17, borderWidth: 1.5 },
  stepCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, justifyContent: "center", alignItems: "center", zIndex: 2 },
  stepCircleDone: { borderWidth: 0 },
  stepNumberText: { fontSize: 11, fontWeight: "800" },
  stepNumberTextActive: { color: "#FFFFFF", fontSize: 11, fontWeight: "800", bottom: Platform.OS === 'ios' ? 0.5 : 0 },
  stepNodeLabel: { fontSize: 11, marginTop: 6, letterSpacing: 0.3, textAlign: "center" },
  lineContainerContainer: { flex: 1, height: 3, marginHorizontal: -8, bottom: 9, borderRadius: 1.5, overflow: "hidden" },
  animatedProgressBar: { height: "100%", width: "0%" },
  textSection: { paddingHorizontal: 24, marginTop: 12, width: '100%', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8, textAlign: "center", width: '100%' },
  subtitle: { fontSize: 13.5, lineHeight: 21, textAlign: "center", width: '100%', paddingHorizontal: 4 },
  mainContentArea: { paddingHorizontal: 24, marginTop: 24, width: "100%" },
  fullWidth: { width: "100%" },
  buttonWrapper: { marginTop: 12, width: "100%" },
  dropdownSelector: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: 54, borderWidth: 1, borderRadius: 8, paddingHorizontal: 16 },
  dropdownValue: { fontSize: 15, fontWeight: "600" },
  dropdownMenu: { width: "100%", borderWidth: 1, borderRadius: 8, marginTop: 6, overflow: "hidden", zIndex: 999, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  dropdownItem: { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1 },
  dropdownItemText: { fontSize: 15, fontWeight: "600" },
  idInputField: { fontWeight: "700", letterSpacing: 1, fontSize: 17 },
  assistanceNotificationBox: { padding: 14, borderRadius: 8, borderWidth: 1, width: "100%", flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  assistanceNotificationText: { flex: 1, fontSize: 12, lineHeight: 18, color: "#10B981", fontWeight: "600" },
  textareaStyle: { height: 86, paddingTop: 14, textAlignVertical: "top" },
  lightInputOverride: { backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", color: "#0B2240" },
  footerContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 20, width: "100%", opacity: 0.7, borderTopWidth: 1 },
  secureText: { fontSize: 11, fontWeight: "600", letterSpacing: 0.3 }
});