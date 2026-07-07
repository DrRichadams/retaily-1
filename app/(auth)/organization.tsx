import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import TopBar from "../../components/TopBar";
import { ThemeContext } from "../_layout";

interface Organization {
  id: string;
  name: string;
  roleInOrg: string;
  status: "accepted" | "pending_admin_approval";
}

export default function OrganizationScreen() {
  const router = useRouter();
  // FIX: Read userRole from parameters passed forward by registration process
  const { userRole = "Merchant", targetOrgId = "DEMO-ID" } = useLocalSearchParams<{ userRole: string; targetOrgId: string }>();
  const { isDarkMode, colors } = useContext(ThemeContext);

  // FIX: Matches parameter payload strings perfectly to trap and isolate cashiers
  const isStaff = userRole === "Staff";

  const gradientColors = isDarkMode ? ["#0F172A", "#1E293B", "#0F172A"] : ["#F8FAFC", "#E2E8F0", "#CBD5E1"];

  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    if (userRole === "Staff") {
      return [{ id: targetOrgId, name: `Workspace (ID: ${targetOrgId})`, roleInOrg: "Store Staff", status: "pending_admin_approval" }];
    }
    return [
      { id: "1", name: "Retaily Retail CBD Wholesale", roleInOrg: "Merchant", status: "accepted" },
      { id: "2", name: "Retaily Avondale Express", roleInOrg: "Merchant", status: "accepted" },
    ];
  });

  const [viewState, setViewState] = useState<"list" | "create" | "awaiting">("list");
  const [newOrgName, setNewOrgName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- STAFF LOCKDOWN ENFORCEMENT ENGINE ---
  useEffect(() => {
    if (isStaff && organizations.length > 0) {
      const activeStaffOrg = organizations[0];
      if (activeStaffOrg.status === "pending_admin_approval") {
        setViewState("awaiting");
      } else if (activeStaffOrg.status === "accepted") {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          router.replace("/(staff)/terminal");
        }, 1000);
      }
    }
  }, [isStaff, organizations]);

  const hourglassRotation = useSharedValue(0);
  useEffect(() => {
    if (viewState === "awaiting") {
      hourglassRotation.value = withRepeat(withSequence(withTiming(180, { duration: 1200 }), withTiming(180, { duration: 400 })), -1, false);
    }
  }, [viewState]);

  const animatedHourglassStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${hourglassRotation.value}deg` }] }));

  const handleSelectOrg = (org: Organization) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(merchant)/dashboard");
    }, 1200);
  };

  const handleCreateOrganization = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newOrg: Organization = { id: Math.random().toString(), name: newOrgName.trim(), roleInOrg: "Merchant", status: "accepted" };
      setOrganizations([newOrg, ...organizations]);
      setNewOrgName("");
      setViewState("list");
    }, 1500);
  };

  const handleCancelRequest = () => {
    Alert.alert(
      "Disconnect Terminal Link",
      "Are you sure you want to cancel your workspace terminal link request?",
      [
        { text: "Keep Waiting", style: "cancel" },
        { text: "Disconnect", style: "destructive", onPress: () => router.replace("/(auth)/accounttype") },
      ]
    );
  };

  return (
    <View style={styles.rootWrapper}>
      <LinearGradient colors={gradientColors} start={{ x: 0.0, y: 0.0 }} end={{ x: 1.0, y: 1.0 }} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safeAreaContainer}>
        <TopBar />
        <ScrollView contentContainerStyle={styles.scrollGrowContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          
          {viewState === "list" && !isStaff && (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.fullWidth}>
              <View style={styles.textSection}>
                <Text style={[styles.title, { color: colors.primaryText }]}>Select Store Dashboard</Text>
                <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Select a branch container to access inventory and cloud business metrics.</Text>
              </View>
              <View style={styles.listContainer}>
                {organizations.map((org) => (
                  <TouchableOpacity key={org.id} onPress={() => handleSelectOrg(org)} activeOpacity={0.8} style={[styles.orgCard, { backgroundColor: isDarkMode ? colors.inputBg : "#FFFFFF", borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1" }]}>
                    <View style={[styles.monogramCircle, { backgroundColor: colors.accent }]}><Text style={styles.monogramText}>{org.name.charAt(0).toUpperCase()}</Text></View>
                    <View style={styles.textMetadataBlock}>
                      <Text style={[styles.orgName, { color: colors.primaryText }]} numberOfLines={1}>{org.name}</Text>
                      <Text style={[styles.roleSubText, { color: colors.secondaryText }]}>Access Rights: <Text style={{ fontWeight: "600", color: colors.accent }}>{org.roleInOrg}</Text></Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={[styles.dividerLine, { backgroundColor: isDarkMode ? colors.inputBorder : "#CBD5E1" }]} />
              <View style={styles.actionButtonRow}>
                <TouchableOpacity style={[styles.actionOptionCard, { backgroundColor: isDarkMode ? colors.inputBg : "#FFFFFF", borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1" }]} onPress={() => setViewState("create")} activeOpacity={0.8}>
                  <View style={[styles.actionIconOuter, { backgroundColor: "rgba(56,189,248,0.12)" }]}><Ionicons name="add-circle" size={24} color={colors.accent} /></View>
                  <Text style={[styles.actionCardText, { color: colors.primaryText }]}>Create New Org Container</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {viewState === "create" && (
            <Animated.View entering={FadeIn} style={styles.fullWidth}>
              <View style={styles.textSection}>
                <Text style={[styles.title, { color: colors.primaryText }]}>Register New Branch Space</Text>
                <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Deploy an isolated database infrastructure volume container to coordinate store metrics.</Text>
              </View>
              <View style={styles.formContainer}>
                <CustomInput placeholder="Business Store Identity (e.g., Retaily Borrowdale)" value={newOrgName} onChangeText={setNewOrgName} style={!isDarkMode && styles.lightInputOverride} />
                <View style={styles.btnWrapper}>
                  <CustomButton title="Initialize Branch Space" disabled={!newOrgName.trim() || isLoading} onPress={handleCreateOrganization} style={!isDarkMode ? { backgroundColor: colors.primaryText } : undefined} />
                  <TouchableOpacity style={styles.cancelLinkTextRow} onPress={() => setViewState("list")} activeOpacity={0.7}><Text style={[styles.cancelLinkText, { color: colors.secondaryText }]}>Cancel and Return</Text></TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )}

          {/* FIX: Staff members land directly here, entirely bypassing dashboard lists */}
          {viewState === "awaiting" && (
            <Animated.View entering={FadeIn} style={styles.centerFlowState}>
              <Animated.View style={[styles.statusIconContainer, { backgroundColor: isDarkMode ? colors.inputBg : "rgba(245,158,11,0.12)" }, animatedHourglassStyle]}><FontAwesome5 name="hourglass-half" size={36} color="#F59E0B" /></Animated.View>
              <Text style={[styles.title, styles.centerText, { color: colors.primaryText }]}>Awaiting Authorization Pass</Text>
              <Text style={[styles.subtitle, styles.centerText, { color: colors.secondaryText }]}>Your point-of-sale terminal link request has been locked inside the registration pipeline queue.</Text>
              <View style={[styles.statusNotificationCard, { backgroundColor: isDarkMode ? colors.inputBg : "#FFFFFF", borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1" }]}>
                <Text style={[styles.statusCardTitle, { color: colors.primaryText }]}>Verification Token Link State:</Text>
                <Text style={styles.statusHighlightText}>⏳ Pending Merchant Handshake Check</Text>
                <Text style={[styles.statusCardBody, { color: colors.secondaryText }]}>Please contact your designated store system administrator or merchant supervisor to cross-verify this device signature inside their active workspace layout configuration settings.</Text>
              </View>
              <TouchableOpacity style={styles.refreshTextRow} onPress={handleCancelRequest} activeOpacity={0.7}><Text style={[styles.refreshText, { color: "#EF4444" }]}>Cancel and Disconnect Request</Text></TouchableOpacity>
            </Animated.View>
          )}

        </ScrollView>
        {isLoading && <View style={styles.loadingOverlay}><View style={[styles.loadingBox, { backgroundColor: colors.surface }]}/><ActivityIndicator size="large" color={colors.accent} /></View>}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootWrapper: { flex: 1 },
  safeAreaContainer: { flex: 1 },
  scrollGrowContainer: { paddingBottom: 32, flexGrow: 1, justifyContent: "center" },
  fullWidth: { width: "100%" },
  textSection: { paddingHorizontal: 24, alignItems: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 14, lineHeight: 20, textAlign: "center", paddingHorizontal: 16 },
  listContainer: { gap: 12, paddingHorizontal: 24, width: "100%" },
  orgCard: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 12, borderWidth: 1 },
  monogramCircle: { width: 44, height: 44, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  monogramText: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
  textMetadataBlock: { marginLeft: 16, flex: 1 },
  orgName: { fontSize: 16, fontWeight: "700" },
  roleSubText: { fontSize: 13, marginTop: 2 },
  dividerLine: { height: 1, width: "100%", marginVertical: 24, opacity: 0.4 },
  actionButtonRow: { paddingHorizontal: 24, width: "100%" },
  actionOptionCard: { width: "100%", borderWidth: 1, borderRadius: 12, padding: 20, alignItems: "center", flexDirection: "row" },
  actionIconOuter: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", marginRight: 16 },
  actionCardText: { fontSize: 15, fontWeight: "700" },
  formContainer: { paddingHorizontal: 24, width: "100%" },
  btnWrapper: { marginTop: 8 },
  cancelLinkTextRow: { alignSelf: "center", marginTop: 16, padding: 8 },
  cancelLinkText: { fontSize: 14, fontWeight: "600", textDecorationLine: "underline" },
  centerFlowState: { alignItems: "center", paddingHorizontal: 24, width: "100%" },
  centerText: { textAlign: "center" },
  statusIconContainer: { width: 84, height: 84, borderRadius: 42, justifyContent: "center", alignItems: "center", marginBottom: 24 },
  statusNotificationCard: { width: "100%", padding: 20, borderRadius: 12, borderWidth: 1, marginTop: 16, gap: 8 },
  statusCardTitle: { fontSize: 14, fontWeight: "700" },
  statusHighlightText: { fontSize: 15, fontWeight: "800", color: "#D97706" },
  statusCardBody: { fontSize: 13, lineHeight: 19 },
  refreshTextRow: { marginTop: 28, padding: 8 },
  refreshText: { fontSize: 14, fontWeight: "700", textDecorationLine: "underline" },
  lightInputOverride: { backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", color: "#0B2240" },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15,23,42,0.2)", justifyContent: "center", alignItems: "center", zIndex: 999 },
  loadingBox: { position: 'absolute', width: 80, height: 80, borderRadius: 16, elevation: 4 },
});