import React, { useState, useContext, useEffect } from "react";
import { saveTransactionLocally, getUnsyncedCount } from '../../services/db';
import { triggerBackgroundSync } from '../../services/syncEngine';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, FadeIn, LinearTransition } from "react-native-reanimated";
import { ThemeContext } from "../_layout";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import TopBar from "../../components/TopBar";

interface BasketItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function StaffTerminalScreen() {
  const { isDarkMode, colors } = useContext(ThemeContext);

  const gradientColors = isDarkMode
    ? ["#0F172A", "#1E293B", "#0F172A"] 
    : ["#F8FAFC", "#E2E8F0", "#CBD5E1"];

  // --- STATE PARAMETERS ---
  const [loyaltySearch, setLoyaltySearch] = useState("");
  const [activeCustomer, setActiveCustomer] = useState<{ name: string; points: number } | null>(null);
  const [offlineCacheCount, setOfflineCacheCount] = useState(0);
  
  const [basket, setBasket] = useState<BasketItem[]>([
    { id: "1", name: "2L Cooking Oil", price: 3.50, quantity: 2 },
    { id: "2", name: "1kg Brown Sugar", price: 1.20, quantity: 1 },
  ]);

  // --- SIMULATED AI CAMERA SCANNER ANIMATION ---
  const laserY = useSharedValue(0);
  useEffect(() => {
    laserY.value = withRepeat(withTiming(140, { duration: 1500 }), -1, true);
  }, []);

  const animatedLaserStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: laserY.value }]
  }));

  // --- CALCULATED TOTALS ---
  const basketTotal = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleLookupLoyalty = () => {
    if (loyaltySearch.trim() !== "") {
      // Simulate checking the Retaily shared ecosystem registry via phone layout
      setActiveCustomer({
        name: "Richard Hove",
        points: 480
      });
      setLoyaltySearch("");
    }
  };

  const handleSimulateAIScan = () => {
    // Mimic the backend engine identifying an apple or bread item via camera computer vision frame loops
    const mockItems = [
      { id: "3", name: "Loaf of Bread", price: 1.00 },
      { id: "4", name: "500g Sea Salt", price: 0.85 },
      { id: "5", name: "1L Fresh Milk", price: 1.45 }
    ];
    const scanned = mockItems[Math.floor(Math.random() * mockItems.length)];
    
    setBasket((prev) => {
      const existing = prev.find(item => item.id === scanned.id);
      if (existing) {
        return prev.map(item => item.id === scanned.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...scanned, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setBasket((prev) => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean) as BasketItem[]);
  };

  return (
    <View style={styles.rootWrapper}>
      <LinearGradient colors={gradientColors} start={{ x: 0.0, y: 0.0 }} end={{ x: 1.0, y: 1.0 }} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={styles.safeAreaContainer} edges={['top', 'left', 'right']}>
        {/* TOP COMPONENT HOOK */}
        <TopBar />

        {/* SYSTEM STATUS ROW: Tracks connectivity chassis safely */}
        <View style={styles.systemStatusRow}>
          <View style={styles.terminalBadge}>
            <MaterialCommunityIcons name="bus-stop" size={14} color="#10B981" />
            <Text style={[styles.statusText, { color: colors.primaryText }]}>Terminal Active</Text>
          </View>
          
          <View style={[styles.syncBadge, { backgroundColor: offlineCacheCount > 0 ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)" }]}>
            <Ionicons name="cloud-offline" size={13} color={offlineCacheCount > 0 ? "#D97706" : "#10B981"} />
            <Text style={[styles.syncText, { color: offlineCacheCount > 0 ? "#D97706" : "#10B981" }]}>
              {offlineCacheCount > 0 ? `${offlineCacheCount} Tx Local Cache` : "Database Synced"}
            </Text>
          </View>
        </View>

        <View style={styles.mainWorkspaceLayout}>
          
          {/* SECTION 1: SYSTEM LOYALTY GRID & AI MATRIX */}
          <View style={styles.leftInteractionColumn}>
            
            {/* LOYALTY ACCOUNT HOOK MATRIX */}
            <View style={[styles.posSectionCard, { backgroundColor: isDarkMode ? colors.inputBg : "#FFFFFF", borderColor: isDarkMode : colors.inputBorder }]}>
              <Text style={[styles.sectionHeaderTitle, { color: colors.primaryText }]}>Ecosystem Loyalty Lookup</Text>
              
              {activeCustomer ? (
                <Animated.View entering={FadeIn} style={styles.activeCustomerCard}>
                  <View style={styles.customerMeta}>
                    <Ionicons name="person-circle" size={24} color={colors.accent} />
                    <Text style={[styles.customerName, { color: colors.primaryText }]}>{activeCustomer.name}</Text>
                  </View>
                  <Text style={[styles.customerPoints, { color: colors.accent }]}>{activeCustomer.points} Tier Points Available</Text>
                  <TouchableOpacity onPress={() => setActiveCustomer(null)} style={styles.detachLink}><Text style={styles.detachLinkText}>Clear Account</Text></TouchableOpacity>
                </Animated.View>
              ) : (
                <View style={styles.searchRowLayout}>
                  <CustomInput 
                    placeholder="Scan phone number / code..." 
                    value={loyaltySearch} 
                    onChangeText={setLoyaltySearch} 
                    containerStyle={styles.searchOverrideContainer}
                    style={!isDarkMode && styles.lightInputOverride}
                  />
                  <TouchableOpacity onPress={handleLookupLoyalty} style={[styles.searchExecuteButton, { backgroundColor: colors.accent }]} activeOpacity={0.8}>
                    <Ionicons name="search" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* AI COMPUTER VISION VIEWPORT BOX */}
            <View style={[styles.posSectionCard, styles.flexExpand, { backgroundColor: isDarkMode ? colors.inputBg : "#FFFFFF", borderColor: isDarkMode : colors.inputBorder }]}>
              <Text style={[styles.sectionHeaderTitle, { color: colors.primaryText }]}>AI Scanner Module</Text>
              
              <View style={[styles.cameraViewportSimulation, { backgroundColor: isDarkMode ? "#0F172A" : "#E2E8F0" }]}>
                {/* Simulated Target Reticle Grid */}
                <View style={[styles.reticleCorner, styles.topLeft]} />
                <View style={[styles.reticleCorner, styles.topRight]} />
                <View style={[styles.reticleCorner, styles.bottomLeft]} />
                <View style={[styles.reticleCorner, styles.bottomRight]} />

                <Animated.View style={[styles.scannerLaserLine, animatedLaserStyle]} />

                <MaterialCommunityIcons name="barcode-scan" size={48} color={isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(11,34,64,0.15)"} />
                <Text style={[styles.cameraStatusLabel, { color: colors.secondaryText }]}>Hold items inside grid bounds</Text>
              </View>

              <TouchableOpacity onPress={handleSimulateAIScan} style={[styles.triggerScanMockButton, { borderColor: colors.accent }]} activeOpacity={0.7}>
                <Ionicons name="camera" size={16} color={colors.accent} style={{ marginRight: 6 }} />
                <Text style={[styles.triggerScanMockText, { color: colors.accent }]}>Trigger Simulated AI Scan Pass</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* SECTION 2: CHECKOUT BASKET BAR CHASSIS */}
          <View style={[styles.basketColumnPanel, { backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.7)" : "#FFFFFF", borderColor: isDarkMode ? colors.inputBorder : "#CBD5E1" }]}>
            <View style={styles.basketHeaderBlock}>
              <Text style={[styles.basketTitleText, { color: colors.primaryText }]}>Current Basket</Text>
              <View style={[styles.counterBadge, { backgroundColor: colors.accent }]}><Text style={styles.counterBadgeText}>{basket.length}</Text></View>
            </View>

            {/* TICKETS LIST TRACKER */}
            <FlatList
              data={basket}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.basketScrollLayout}
              layout={LinearTransition}
              renderItem={({ item }) => (
                <View style={[styles.basketItemRow, { borderBottomColor: isDarkMode ? "#334155" : "#F1F5F9" }]}>
                  <View style={styles.itemMetaColumn}>
                    <Text style={[styles.itemNameText, { color: colors.primaryText }]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[styles.itemPriceLabel, { color: colors.secondaryText }]}>${item.price.toFixed(2)} each</Text>
                  </View>
                  
                  {/* Quantity Counter Switch */}
                  <View style={styles.quantityStepperTrack}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={[styles.stepBtn, { backgroundColor: isDarkMode ? "#334155" : "#F1F5F9" }]}><Ionicons name="remove" size={14} color={colors.primaryText} /></TouchableOpacity>
                    <Text style={[styles.quantityValueLabel, { color: colors.primaryText }]}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={[styles.stepBtn, { backgroundColor: isDarkMode ? "#334155" : "#F1F5F9" }]}><Ionicons name="add" size={14} color={colors.primaryText} /></TouchableOpacity>
                  </View>

                  <Text style={[styles.itemSubtotalPrice, { color: colors.primaryText }]}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyBasketView}>
                  <Ionicons name="cart-outline" size={32} color={colors.secondaryText} style={{ marginBottom: 8 }} />
                  <Text style={[styles.emptyBasketText, { color: colors.secondaryText }]}>Register basket is currently empty.</Text>
                </View>
              }
            />

            {/* BASE BILL SECTOR SUMMARY CONTROL PANEL */}
            <View style={[styles.billSummaryCalculationBlock, { borderTopColor: isDarkMode ? "#334155" : "#E2E8F0" }]}>
              <View style={styles.totalSummaryRow}>
                <Text style={[styles.grandTotalLabel, { color: colors.primaryText }]}>Grand Total:</Text>
                <Text style={[styles.grandTotalPrice, { color: colors.primaryText }]}>${basketTotal.toFixed(2)}</Text>
              </View>

              <CustomButton 
                title="Process Cash Checkout" 
                disabled={basket.length === 0} 
                onPress={() => {
                  alert(`Transaction settled successfully: $${basketTotal.toFixed(2)}`);
                  setBasket([]);
                  setActiveCustomer(null);
                }} 
                style={!isDarkMode ? { backgroundColor: colors.primaryText } : undefined}
              />
            </View>

          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootWrapper: { flex: 1 },
  safeAreaContainer: { flex: 1 },
  flexExpand: { flex: 1 },
  fullWidth: { width: "100%" },

  // System status parameters bar layout
  systemStatusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 12 },
  terminalBadge: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusText: { fontSize: 13, fontWeight: "700" },
  syncBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  syncText: { fontSize: 11, fontWeight: "700" },

  // Split-pane alignment structure
  mainWorkspaceLayout: { flex: 1, flexDirection: "row", paddingHorizontal: 24, gap: 16, paddingBottom: Platform.OS === 'ios' ? 12 : 16 },
  leftInteractionColumn: { flex: 1.1, gap: 14 },
  basketColumnPanel: { flex: 1, borderRadius: 16, borderWidth: 1, overflow: "hidden", justifyContent: "space-between" },

  posSectionCard: { padding: 16, borderRadius: 14, borderWidth: 1 },
  sectionHeaderTitle: { fontSize: 14, fontWeight: "800", letterSpacing: 0.3, marginBottom: 12, textTransform: "uppercase", opacity: 0.8 },
  
  // Loyalty Lookup rows layout
  searchRowLayout: { flexDirection: "row", width: "100%", gap: 8, height: 48, alignItems: "center" },
  searchOverrideContainer: { flex: 1, marginBottom: 0 },
  searchExecuteButton: { width: 48, height: 48, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  activeCustomerCard: { width: "100%", padding: 10, borderRadius: 8, backgroundColor: "rgba(56, 189, 248, 0.05)", position: "relative" },
  customerMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  customerName: { fontSize: 15, fontWeight: "700" },
  customerPoints: { fontSize: 12, fontWeight: "600", marginTop: 4 },
  detachLink: { position: "absolute", right: 10, top: 14 },
  detachLinkText: { color: "#EF4444", fontSize: 11, fontWeight: "700", textDecorationLine: "underline" },

  // AI Camera Simulator styling limits
  cameraViewportSimulation: { flex: 1, width: "100%", borderRadius: 10, position: "relative", minHeight: 140, justifyContent: "center", alignItems: "center", overflow: "hidden" },
  reticleCorner: { position: "absolute", width: 14, height: 14, borderColor: "#10B981", borderWidth: 2 },
  topLeft: { top: 12, left: 12, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 12, right: 12, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 12, left: 12, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 12, right: 12, borderLeftWidth: 0, borderTopWidth: 0 },
  scannerLaserLine: { position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: "#10B981", shadowColor: "#10B981", shadowOpacity: 0.8, shadowRadius: 4, elevation: 3 },
  cameraStatusLabel: { fontSize: 11, fontWeight: "600", marginTop: 8, opacity: 0.7 },
  triggerScanMockButton: { width: "100%", borderStyle: "dashed", borderWidth: 1, height: 42, borderRadius: 8, marginTop: 12, flexDirection: "row", justifyContent: "center", alignItems: "center" },
  triggerScanMockText: { fontSize: 12, fontWeight: "700" },

  // Right column checkout basket styles
  basketHeaderBlock: { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
  basketTitleText: { fontSize: 16, fontWeight: "800" },
  counterBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  counterBadgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  basketScrollLayout: { paddingHorizontal: 16, paddingBottom: 16 },
  basketItemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1 },
  itemMetaColumn: { flex: 1, paddingRight: 4 },
  itemNameText: { fontSize: 14, fontWeight: "700" },
  itemPriceLabel: { fontSize: 12, marginTop: 2 },
  quantityStepperTrack: { flexDirection: "row", alignItems: "center", gap: 8, marginRight: 12 },
  stepBtn: { width: 26, height: 26, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  quantityValueLabel: { fontSize: 14, fontWeight: "700", minWidth: 14, textAlign: "center" },
  itemSubtotalPrice: { fontSize: 14, fontWeight: "700", minWidth: 54, textAlign: "right" },
  emptyBasketView: { alignItems: "center", paddingVertical: 48 },
  emptyBasketText: { fontSize: 12, fontWeight: "500", textAlign: "center" },

  billSummaryCalculationBlock: { padding: 16, borderTopWidth: 1 },
  totalSummaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  grandTotalLabel: { fontSize: 16, fontWeight: "800" },
  grandTotalPrice: { fontSize: 20, fontWeight: "900" },
  lightInputOverride: { backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", color: "#0B2240" }
});