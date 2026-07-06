import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const lightColors = {
  background: "#E1E6F0",
  primary: "#0B2240",
  accent: "#1A44B8",
  inputBg: "#D5DDEB",
  inputBorder: "#B0BCCF",
  textMuted: "#7E8B9B",
  danger: "#DC2626",
};

const darkColors = {
  background: "#1E293B",
  primary: "#F8FAFC",
  accent: "#38BDF8",
  inputBg: "#334155",
  inputBorder: "#475569",
  textMuted: "#94A3B8",
  danger: "#EF4444",
};

type UserRole = "Merchant" | "Manager" | "Cashier";

interface Organization {
  id: string;
  name: string;
  roleInOrg: UserRole;
  status: "accepted" | "pending_admin_approval";
}

interface OrganizationScreenProps {
  isDarkMode?: boolean;
  userEmailOrPhone?: string;
  userRole?: UserRole; // Passed from initial auth step (e.g., loaded from user profile data)
  onBack?: () => void;
  onEnterDashboard: (orgId: string) => void;
}

export default function OrganizationScreen({
  isDarkMode = false,
  userEmailOrPhone = "pro***@gmail.com",
  userRole = "Merchant", // Change to "Merchant" or "Manager" to test different UI states
  onBack,
  onEnterDashboard,
}: OrganizationScreenProps) {
  const colors = isDarkMode ? darkColors : lightColors;

  // Mock organizations tracking state
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: "1",
      name: "Harare Central Branch",
      roleInOrg: "Cashier",
      status: "accepted",
    },
  ]);

  const [viewState, setViewState] = useState<
    "list" | "join" | "create" | "awaiting"
  >("list");
  const [orgIdInput, setOrgIdInput] = useState("");
  const [newOrgName, setNewOrgName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Helper flags based on business logic
  const isStaff = userRole === "Cashier" || userRole === "Manager";
  const hasActiveOrg = organizations.length > 0;

  const handleSelectOrg = (org: Organization) => {
    if (org.status === "pending_admin_approval") {
      setViewState("awaiting");
      return;
    }
    onEnterDashboard(org.id);
  };

  const handleLeaveOrganization = (orgId: string, orgName: string) => {
    Alert.alert(
      "Leave Organization",
      `Are you sure you want to leave "${orgName}"? You will lose terminal access until a manager or admin accepts you into a new shop.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              setOrganizations([]); // Clears out their single allowed slot
              Alert.alert(
                "Success",
                "You have successfully left the organization.",
              );
            }, 1000);
          },
        },
      ],
    );
  };

  const handleJoinOrganization = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Mocking a pending link request for the cashier/manager
      const pendingOrg: Organization = {
        id: "temp-id",
        name: `Pending Terminal Request (${orgIdInput})`,
        roleInOrg: userRole,
        status: "pending_admin_approval",
      };
      setOrganizations([pendingOrg]);
      setViewState("awaiting");
    }, 1500);
  };

  const handleCreateOrganization = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newOrg: Organization = {
        id: Math.random().toString(),
        name: newOrgName,
        roleInOrg: "Merchant",
        status: "accepted",
      };
      setOrganizations([newOrg, ...organizations]);
      setViewState("list");
    }, 1500);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() =>
            viewState === "list" ? onBack?.() : setViewState("list")
          }
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={colors.primary} />
        </TouchableOpacity>

        {/* Simple Role Badge on Top Right */}
        <View style={[styles.roleBadge, { backgroundColor: colors.inputBg }]}>
          <Text style={[styles.roleBadgeText, { color: colors.accent }]}>
            {userRole}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* STATE 1: ACTIVE STORE / STORES LIST */}
        {viewState === "list" && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.fullWidth}
          >
            <Text style={[styles.title, { color: colors.primary }]}>
              {isStaff ? "Your Store Organization" : "Select Store Dashboard"}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Account:{" "}
              <Text style={{ fontWeight: "bold", color: colors.primary }}>
                {userEmailOrPhone}
              </Text>
            </Text>

            {hasActiveOrg ? (
              <View style={styles.listContainer}>
                {organizations.map((org) => (
                  <View
                    key={org.id}
                    style={[
                      styles.orgCard,
                      {
                        backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                        borderColor: colors.inputBorder,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.cardLeftContent}
                      onPress={() => handleSelectOrg(org)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.monogramCircle,
                          { backgroundColor: isStaff ? "#10B981" : "#3B82F6" },
                        ]}
                      >
                        <Text style={styles.monogramText}>
                          {org.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.textMetadataBlock}>
                        <Text
                          style={[styles.orgName, { color: colors.primary }]}
                          numberOfLines={1}
                        >
                          {org.name}
                        </Text>
                        <Text
                          style={[
                            styles.roleSubText,
                            { color: colors.textMuted },
                          ]}
                        >
                          Assigned Role:{" "}
                          <Text style={{ fontWeight: "600" }}>
                            {org.roleInOrg}
                          </Text>
                        </Text>
                      </View>
                      {org.status === "accepted" && (
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={colors.textMuted}
                          style={{ marginRight: 8 }}
                        />
                      )}
                    </TouchableOpacity>

                    {/* Staff Actions: Render a "Leave" button right inside the layout card if restricted */}
                    {isStaff && (
                      <TouchableOpacity
                        style={[
                          styles.leaveButton,
                          { borderColor: colors.danger },
                        ]}
                        onPress={() =>
                          handleLeaveOrganization(org.id, org.name)
                        }
                      >
                        <Text
                          style={[
                            styles.leaveButtonText,
                            { color: colors.danger },
                          ]}
                        >
                          Leave
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              /* Empty Placeholder State for managers/cashiers who haven't joined a terminal yet */
              <View
                style={[
                  styles.emptyCard,
                  {
                    backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                    borderColor: colors.inputBorder,
                  },
                ]}
              >
                <FontAwesome5
                  name="store-slash"
                  size={32}
                  color={colors.textMuted}
                />
                <Text style={[styles.emptyTitle, { color: colors.primary }]}>
                  No Active Store Connected
                </Text>
                <Text
                  style={[styles.emptySubtitle, { color: colors.textMuted }]}
                >
                  You are not currently linked to an organization. Please join
                  an organization terminal below using the ID provided by your
                  merchant.
                </Text>
              </View>
            )}

            {/* DYNAMIC ACTION GATEWAYS BASED ON ACCESS CONTROLS */}
            {(!isStaff || !hasActiveOrg) && (
              <>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: colors.inputBorder },
                  ]}
                />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  {isStaff
                    ? "Connect to a Retail Shop"
                    : "Manage Organizations"}
                </Text>

                <View style={styles.actionButtonRow}>
                  <TouchableOpacity
                    style={[
                      styles.actionOptionCard,
                      {
                        backgroundColor: colors.inputBg,
                        borderColor: colors.inputBorder,
                      },
                    ]}
                    onPress={() => setViewState("join")}
                  >
                    <MaterialCommunityIcons
                      name="enter"
                      size={24}
                      color={colors.accent}
                    />
                    <Text
                      style={[styles.actionCardText, { color: colors.primary }]}
                    >
                      Join via Org ID
                    </Text>
                  </TouchableOpacity>

                  {/* Strictly preserve the creation panel pathway for Merchants/Admins */}
                  {!isStaff && (
                    <TouchableOpacity
                      style={[
                        styles.actionOptionCard,
                        {
                          backgroundColor: colors.inputBg,
                          borderColor: colors.inputBorder,
                        },
                      ]}
                      onPress={() => setViewState("create")}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color={colors.accent}
                      />
                      <Text
                        style={[
                          styles.actionCardText,
                          { color: colors.primary },
                        ]}
                      >
                        Create New Org
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </Animated.View>
        )}

        {/* STATE 2: JOIN VIA ID */}
        {viewState === "join" && (
          <Animated.View entering={FadeIn} style={styles.fullWidth}>
            <Text style={[styles.title, { color: colors.primary }]}>
              Join Store Terminal
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Enter the unique Organization code provided by your Store Manager
              or Merchant to request point-of-sale login clearance.
            </Text>

            <CustomInput
              placeholder="e.g. RET-HARARE-01"
              value={orgIdInput}
              onChangeText={setOrgIdInput}
              autoCapitalize="characters"
            />

            <View style={styles.btnWrapper}>
              <CustomButton
                title="Request Terminal Access"
                disabled={!orgIdInput || isLoading}
                onPress={handleJoinOrganization}
              />
            </View>
          </Animated.View>
        )}

        {/* STATE 3: CREATE AN ORGANIZATION */}
        {viewState === "create" && (
          <Animated.View entering={FadeIn} style={styles.fullWidth}>
            <Text style={[styles.title, { color: colors.primary }]}>
              Register Your Business
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Set up a brand-new cloud database container for your store
              franchise network.
            </Text>

            <CustomInput
              placeholder="Store Name (e.g., Retaily CBD Wholesale)"
              value={newOrgName}
              onChangeText={setNewOrgName}
            />

            <View style={styles.btnWrapper}>
              <CustomButton
                title="Initialize Business Container"
                disabled={!newOrgName || isLoading}
                onPress={handleCreateOrganization}
              />
            </View>
          </Animated.View>
        )}

        {/* STATE 4: AWAITING APPROVAL HOLD SCREEN */}
        {viewState === "awaiting" && (
          <Animated.View entering={FadeIn} style={styles.centerFlowState}>
            <View
              style={[
                styles.statusIconContainer,
                { backgroundColor: colors.inputBg },
              ]}
            >
              <Ionicons name="time-outline" size={48} color={colors.accent} />
            </View>
            <Text
              style={[
                styles.title,
                styles.centerText,
                { color: colors.primary },
              ]}
            >
              Awaiting Authorization
            </Text>
            <Text
              style={[
                styles.subtitle,
                styles.centerText,
                { color: colors.textMuted },
              ]}
            >
              Your terminal link request has been forwarded to the shop owner's
              validation dashboard.
            </Text>
            <View
              style={[
                styles.statusNotificationCard,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.inputBorder,
                },
              ]}
            >
              <Text style={[styles.statusCardTitle, { color: colors.primary }]}>
                Terminal Status:
              </Text>
              <Text style={styles.statusHighlightText}>
                ⏳ Pending Verification Pass
              </Text>
              <Text
                style={[styles.statusCardBody, { color: colors.textMuted }]}
              >
                Contact your store manager or merchant to approve this device
                link. You can safely disconnect your device link below if
                needed.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.refreshTextRow}
              onPress={() => {
                setOrganizations([]);
                setViewState("list");
              }}
            >
              <Text style={[styles.refreshText, { color: colors.danger }]}>
                Cancel and Disconnect Request
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  backButton: { padding: 8 },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  roleBadgeText: { fontSize: 12, fontWeight: "700" },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40 },
  fullWidth: { width: "100%" },
  title: { fontSize: 24, fontWeight: "bold", lineHeight: 32, marginBottom: 4 },
  subtitle: { fontSize: 14, lineHeight: 22, marginBottom: 24 },

  listContainer: { gap: 12, width: "100%", marginBottom: 24 },
  orgCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardLeftContent: { flexDirection: "row", alignItems: "center", flex: 1 },
  monogramCircle: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  monogramText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  textMetadataBlock: { marginLeft: 12, flex: 1 },
  orgName: { fontSize: 16, fontWeight: "700" },
  roleSubText: { fontSize: 13, marginTop: 2 },

  leaveButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  leaveButtonText: { fontSize: 12, fontWeight: "700" },

  emptyCard: {
    width: "100%",
    padding: 24,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    borderStyle: "dashed",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: { fontSize: 13, textAlign: "center", lineHeight: 18 },

  dividerLine: { height: 1, width: "100%", marginVertical: 20, opacity: 0.5 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  actionButtonRow: { flexDirection: "row", gap: 12, width: "100%" },
  actionOptionCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  actionCardText: { fontSize: 13, fontWeight: "600" },
  btnWrapper: { marginTop: 12 },

  centerFlowState: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
    width: "100%",
  },
  centerText: { textAlign: "center" },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  statusNotificationCard: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    gap: 6,
  },
  statusCardTitle: { fontSize: 14, fontWeight: "700" },
  statusHighlightText: { fontSize: 15, fontWeight: "bold", color: "#D97706" },
  statusCardBody: { fontSize: 13, lineHeight: 18 },
  refreshTextRow: { marginTop: 24, padding: 8 },
  refreshText: { fontSize: 14, fontWeight: "700" },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingBox: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
