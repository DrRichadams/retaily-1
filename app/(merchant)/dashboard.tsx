import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp, LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/TopBar";
import { ThemeContext } from "../_layout";

interface PendingStaff {
  id: string;
  name: string;
  deviceToken: string;
  requestedAt: string;
}

interface BranchMetric {
  id: string;
  name: string;
  sales: string;
  transactions: number;
}

export default function MerchantDashboardScreen() {
  const { isDarkMode, colors } = useContext(ThemeContext);

  const gradientColors = isDarkMode
    ? ["#0F172A", "#1E293B", "#0F172A"]
    : ["#F8FAFC", "#E2E8F0", "#CBD5E1"];

  // --- MOCK STATE PARAMETERS ---
  const [activeTab, setActiveTab] = useState<"metrics" | "staff" | "settings">(
    "metrics",
  );

  const [pendingStaffList, setPendingStaffList] = useState<PendingStaff[]>([
    {
      id: "staff-1",
      name: "Tinashe Moyo",
      deviceToken: "RET-NODE-89F2",
      requestedAt: "10 mins ago",
    },
    {
      id: "staff-2",
      name: "Chipo Chani",
      deviceToken: "RET-NODE-41B7",
      requestedAt: "32 mins ago",
    },
  ]);

  const [branchMetrics] = useState<BranchMetric[]>([
    {
      id: "b1",
      name: "Retaily CBD Wholesale",
      sales: "$4,850.00",
      transactions: 142,
    },
    {
      id: "b2",
      name: "Retaily Avondale Express",
      sales: "$1,920.45",
      transactions: 68,
    },
  ]);

  // --- ACTION HANDLERS ---
  const handleStaffApproval = (id: string, name: string, approve: boolean) => {
    Alert.alert(
      approve ? "Authorize Device" : "Deny Access Request",
      `Are you sure you want to ${approve ? "approve" : "reject"} access for ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: approve ? "Approve" : "Reject",
          style: approve ? "default" : "destructive",
          onPress: () => {
            setPendingStaffList((prev) =>
              prev.filter((staff) => staff.id !== id),
            );
          },
        },
      ],
    );
  };

  return (
    <View style={styles.rootWrapper}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView
        style={styles.safeAreaContainer}
        edges={["top", "left", "right"]}
      >
        <TopBar />

        {/* ECOSYSTEM DASHBOARD TABS NAVIGATION PANEL */}
        <View style={styles.dashboardTabsTrack}>
          <TouchableOpacity
            onPress={() => setActiveTab("metrics")}
            style={[
              styles.tabButton,
              activeTab === "metrics" && { backgroundColor: colors.accent },
            ]}
            activeOpacity={0.8}
          >
            <Ionicons
              name="bar-chart"
              size={16}
              color={activeTab === "metrics" ? "#FFFFFF" : colors.secondaryText}
            />
            <Text
              style={[
                styles.tabButtonText,
                {
                  color:
                    activeTab === "metrics" ? "#FFFFFF" : colors.secondaryText,
                },
              ]}
            >
              Metrics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("staff")}
            style={[
              styles.tabButton,
              activeTab === "staff" && { backgroundColor: colors.accent },
            ]}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="users-cog"
              size={14}
              color={activeTab === "staff" ? "#FFFFFF" : colors.secondaryText}
            />
            <Text
              style={[
                styles.tabButtonText,
                {
                  color:
                    activeTab === "staff" ? "#FFFFFF" : colors.secondaryText,
                },
              ]}
            >
              Staff{" "}
              {pendingStaffList.length > 0 && `(${pendingStaffList.length})`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("settings")}
            style={[
              styles.tabButton,
              activeTab === "settings" && { backgroundColor: colors.accent },
            ]}
            activeOpacity={0.8}
          >
            <Ionicons
              name="options"
              size={16}
              color={
                activeTab === "settings" ? "#FFFFFF" : colors.secondaryText
              }
            />
            <Text
              style={[
                styles.tabButtonText,
                {
                  color:
                    activeTab === "settings" ? "#FFFFFF" : colors.secondaryText,
                },
              ]}
            >
              Controls
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollGrowContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* TAB CONTENT STATE 1: ECOSYSTEM CROSS-BRANCH METRICS */}
          {activeTab === "metrics" && (
            <Animated.View
              entering={FadeInUp.duration(300)}
              style={styles.tabContentCanvas}
            >
              <View style={styles.sectionHeaderBlock}>
                <Text
                  style={[styles.sectionTitle, { color: colors.primaryText }]}
                >
                  Enterprise Overview
                </Text>
                <Text
                  style={[
                    styles.sectionSubtitle,
                    { color: colors.secondaryText },
                  ]}
                >
                  Consolidated data summary across active business hubs.
                </Text>
              </View>

              {/* OVERVIEW SUMMARY GRID CHASSIS */}
              <View style={styles.metricsSummaryGrid}>
                <View
                  style={[
                    styles.metricSummaryCard,
                    {
                      backgroundColor: isDarkMode ? colors.inputBg : "#FFFFFF",
                      borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.metricCardLabel,
                      { color: colors.secondaryText },
                    ]}
                  >
                    Total Day Sales
                  </Text>
                  <Text
                    style={[
                      styles.metricCardValue,
                      { color: colors.primaryText },
                    ]}
                  >
                    $6,770.45
                  </Text>
                  <Text style={styles.metricCardTrend}>
                    ▲ +14% vs yesterday
                  </Text>
                </View>

                <View
                  style={[
                    styles.metricSummaryCard,
                    {
                      backgroundColor: isDarkMode ? colors.inputBg : "#FFFFFF",
                      borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.metricCardLabel,
                      { color: colors.secondaryText },
                    ]}
                  >
                    Ecosystem Transactions
                  </Text>
                  <Text
                    style={[
                      styles.metricCardValue,
                      { color: colors.primaryText },
                    ]}
                  >
                    210
                  </Text>
                  <Text
                    style={[styles.metricCardTrend, { color: colors.accent }]}
                  >
                    ● Active POS Nodes
                  </Text>
                </View>
              </View>

              {/* DETAILED OUTLET BREAKDOWN MATRIX */}
              <Text
                style={[styles.subsectionTitle, { color: colors.primaryText }]}
              >
                Active Branches
              </Text>
              <View style={styles.branchBreakdownList}>
                {branchMetrics.map((branch) => (
                  <View
                    key={branch.id}
                    style={[
                      styles.branchCard,
                      {
                        backgroundColor: isDarkMode
                          ? colors.inputBg
                          : "#FFFFFF",
                        borderColor: isDarkMode
                          ? colors.inputBorder
                          : "#CBD5E1",
                      },
                    ]}
                  >
                    <View style={styles.branchMeta}>
                      <Ionicons
                        name="storefront"
                        size={20}
                        color={colors.accent}
                      />
                      <Text
                        style={[
                          styles.branchNameText,
                          { color: colors.primaryText },
                        ]}
                      >
                        {branch.name}
                      </Text>
                    </View>
                    <View style={styles.branchPerformanceData}>
                      <Text
                        style={[
                          styles.branchSalesText,
                          { color: colors.primaryText },
                        ]}
                      >
                        {branch.sales}
                      </Text>
                      <Text
                        style={[
                          styles.branchTxText,
                          { color: colors.secondaryText },
                        ]}
                      >
                        {branch.transactions} tickets
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* TAB CONTENT STATE 2: LIVE STAFF DEVICE AUTHORIZATION GATEWAY */}
          {activeTab === "staff" && (
            <Animated.View
              entering={FadeInUp.duration(300)}
              style={styles.tabContentCanvas}
            >
              <View style={styles.sectionHeaderBlock}>
                <Text
                  style={[styles.sectionTitle, { color: colors.primaryText }]}
                >
                  Pending Personnel Access
                </Text>
                <Text
                  style={[
                    styles.sectionSubtitle,
                    { color: colors.secondaryText },
                  ]}
                >
                  Approve hardware node links and authorize checkout clearance
                  permissions.
                </Text>
              </View>

              <FlatList
                data={pendingStaffList}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                itemLayoutAnimation={LinearTransition}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.staffRequestCard,
                      {
                        backgroundColor: isDarkMode
                          ? colors.inputBg
                          : "#FFFFFF",
                        borderColor: isDarkMode
                          ? colors.inputBorder
                          : "#CBD5E1",
                      },
                    ]}
                  >
                    <View style={styles.staffCardHeader}>
                      <View style={styles.staffCardProfileInfo}>
                        <View
                          style={[
                            styles.profileAvatarIcon,
                            { backgroundColor: colors.accent },
                          ]}
                        >
                          <Text style={styles.profileAvatarText}>
                            {item.name.charAt(0)}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.staffProfileName,
                              { color: colors.primaryText },
                            ]}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={[
                              styles.staffProfileTimestamp,
                              { color: colors.secondaryText },
                            ]}
                          >
                            {item.requestedAt}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.hardwareSignatureBadge,
                          {
                            backgroundColor: isDarkMode ? "#334155" : "#F1F5F9",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.hardwareSignatureText,
                            { color: colors.secondaryText },
                          ]}
                        >
                          {item.deviceToken}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.staffActionButtonsTrack}>
                      <TouchableOpacity
                        onPress={() =>
                          handleStaffApproval(item.id, item.name, false)
                        }
                        style={[
                          styles.staffActionBtn,
                          styles.denyBtn,
                          {
                            borderColor: isDarkMode
                              ? "#EF4444"
                              : "rgba(239,68,68,0.4)",
                          },
                        ]}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color="#EF4444"
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.denyBtnText}>Deny Access</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          handleStaffApproval(item.id, item.name, true)
                        }
                        style={[
                          styles.staffActionBtn,
                          styles.approveBtn,
                          {
                            backgroundColor: isDarkMode
                              ? "#10B981"
                              : colors.primaryText,
                          },
                        ]}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#FFFFFF"
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.approveBtnText}>Approve Node</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyQueueBox}>
                    <MaterialCommunityIcons
                      name="shield-check"
                      size={42}
                      color="#10B981"
                      style={{ marginBottom: 12 }}
                    />
                    <Text
                      style={[
                        styles.emptyQueueTitle,
                        { color: colors.primaryText },
                      ]}
                    >
                      Personnel Pipeline Clear
                    </Text>
                    <Text
                      style={[
                        styles.emptyQueueSubtitle,
                        { color: colors.secondaryText },
                      ]}
                    >
                      No pending cashier terminal handshake validation packets
                      found inside this organization scope.
                    </Text>
                  </View>
                }
              />
            </Animated.View>
          )}

          {/* TAB CONTENT STATE 3: INVENTORY AND EXCHANGE CONTROLS */}
          {activeTab === "settings" && (
            <Animated.View
              entering={FadeInUp.duration(300)}
              style={styles.tabContentCanvas}
            >
              <View style={styles.sectionHeaderBlock}>
                <Text
                  style={[styles.sectionTitle, { color: colors.primaryText }]}
                >
                  Operational Configurations
                </Text>
                <Text
                  style={[
                    styles.sectionSubtitle,
                    { color: colors.secondaryText },
                  ]}
                >
                  Adjust global currency pairs and manage ecosystem rules.
                </Text>
              </View>

              <View style={styles.controlsList}>
                <TouchableOpacity
                  style={[
                    styles.controlOptionItem,
                    {
                      backgroundColor: isDarkMode ? colors.inputBg : "#FFFFFF",
                      borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1",
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={styles.controlMetaGroup}>
                    <MaterialCommunityIcons
                      name="currency-usd"
                      size={22}
                      color={colors.accent}
                    />
                    <View>
                      <Text
                        style={[
                          styles.controlOptionTitle,
                          { color: colors.primaryText },
                        ]}
                      >
                        Multi-Currency Adjustments
                      </Text>
                      <Text
                        style={[
                          styles.controlOptionDesc,
                          { color: colors.secondaryText },
                        ]}
                      >
                        Update multipliers between USD, ZiG, and ZAR tokens.
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.secondaryText}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.controlOptionItem,
                    {
                      backgroundColor: isDarkMode ? colors.inputBg : "#FFFFFF",
                      borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1",
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={styles.controlMetaGroup}>
                    <MaterialCommunityIcons
                      name="clipboard-list-outline"
                      size={22}
                      color="#10B981"
                    />
                    <View>
                      <Text
                        style={[
                          styles.controlOptionTitle,
                          { color: colors.primaryText },
                        ]}
                      >
                        Global Inventory Rules
                      </Text>
                      <Text
                        style={[
                          styles.controlOptionDesc,
                          { color: colors.secondaryText },
                        ]}
                      >
                        Manage universal SKU values and inventory counts.
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.secondaryText}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootWrapper: { flex: 1 },
  safeAreaContainer: { flex: 1 },
  scrollGrowContainer: { paddingBottom: 24, paddingHorizontal: 24 },
  fullWidth: { width: "100%" },

  // Tabs layout formatting
  dashboardTabsTrack: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 24,
    marginVertical: 14,
    width: "100%",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(100,116,139,0.08)",
  },
  tabButtonText: { fontSize: 13, fontWeight: "700" },

  tabContentCanvas: { width: "100%" },
  sectionHeaderBlock: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "800", letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 13.5, lineHeight: 19, marginTop: 2 },

  // Metrics segment styles
  metricsSummaryGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
  metricSummaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  metricCardLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  metricCardValue: { fontSize: 22, fontWeight: "900" },
  metricCardTrend: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
    marginTop: 4,
  },

  subsectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  branchBreakdownList: { gap: 10 },
  branchCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  branchMeta: { flexDirection: "row", alignItems: "center", gap: 12 },
  branchNameText: { fontSize: 15, fontWeight: "700" },
  branchPerformanceData: { alignItems: "end" },
  branchSalesText: { fontSize: 15, fontWeight: "800" },
  branchTxText: { fontSize: 12, marginTop: 1 },

  // Pending staff card elements
  staffRequestCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 16,
  },
  staffCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  staffCardProfileInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  profileAvatarIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatarText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  staffProfileName: { fontSize: 15, fontWeight: "700" },
  staffProfileTimestamp: { fontSize: 12, marginTop: 1 },
  hardwareSignatureBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hardwareSignatureText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  staffActionButtonsTrack: { flexDirection: "row", gap: 10 },
  staffActionBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  denyBtn: { borderWidth: 1, backgroundColor: "transparent" },
  denyBtnText: { color: "#EF4444", fontSize: 13, fontWeight: "700" },
  approveBtn: { backgroundColor: "#0B2240" },
  approveBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },

  emptyQueueBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
    textAlign: "center",
  },
  emptyQueueTitle: { fontSize: 16, fontWeight: "800", marginBottom: 4 },
  emptyQueueSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    opacity: 0.8,
  },

  // Config adjustments lists
  controlsList: { gap: 10 },
  controlOptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  controlMetaGroup: { flexDirection: "row", alignItems: "center", gap: 14 },
  controlOptionTitle: { fontSize: 15, fontWeight: "700" },
  controlOptionDesc: { fontSize: 12, marginTop: 2, opacity: 0.9 },
});
