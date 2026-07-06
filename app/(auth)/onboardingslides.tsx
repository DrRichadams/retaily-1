import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/TopBar";
import { ThemeContext } from "../_layout"; // Global Context Subscriber

export interface SlideItem {
  id: string;
  title: string;
  description: string;
  type: "ai" | "loyalty" | "offline";
}

const ONBOARDING_SLIDES: SlideItem[] = [
  {
    id: "1",
    title: "AI-Powered Checkout",
    description:
      "Scan multiple counter products instantly using your phone's rear camera. No more manual searching or long queue delays.",
    type: "ai",
  },
  {
    id: "2",
    title: "Shared Loyalty Network",
    description:
      "Connect to a massive shared customer ecosystem. Bring shoppers back to your store with platform-wide rewards.",
    type: "loyalty",
  },
  {
    id: "3",
    title: "100% Offline-First",
    description:
      "Keep selling, syncing inventory, and tracking loyalty points even with zero internet. Syncs seamlessly when connection returns.",
    type: "offline",
  },
];

interface GraphicProps {
  isDarkMode: boolean;
  colors: any;
}

// Slide 1 Layouts (AI Scanner)
function AIScannerGraphic({ isDarkMode, colors }: GraphicProps) {
  const laserY = useSharedValue(0);
  const floatingY = useSharedValue(0);

  useEffect(() => {
    laserY.value = withRepeat(withTiming(120, { duration: 1500 }), -1, true);
    floatingY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1200 }),
        withTiming(0, { duration: 1200 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingY.value }],
  }));
  const animatedLaserStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: laserY.value }],
  }));

  return (
    <View style={styles.graphicCanvas}>
      <Animated.View
        style={[
          styles.productBox,
          { backgroundColor: colors.inputBg },
          animatedFloatStyle,
        ]}
      >
        <View style={styles.productItemMock}>
          <MaterialCommunityIcons
            name="bottle-tonic-plus"
            size={32}
            color={colors.accent}
          />
        </View>
        <View style={styles.productItemMock}>
          <MaterialCommunityIcons name="food-apple" size={32} color="#EF4444" />
        </View>
        <View style={styles.productItemMock}>
          <MaterialCommunityIcons
            name="bread-slice"
            size={32}
            color="#F59E0B"
          />
        </View>
      </Animated.View>
      <View style={[styles.scanFrame, { borderColor: colors.accent }]}>
        <Animated.View
          style={[
            styles.scanLaser,
            { backgroundColor: colors.accent },
            animatedLaserStyle,
          ]}
        />
      </View>
    </View>
  );
}

// Slide 2 Layouts (Ecosystem Badge)
function LoyaltyGraphic({ isDarkMode, colors }: GraphicProps) {
  const badgeScale = useSharedValue(1);
  const floatingY = useSharedValue(0);

  useEffect(() => {
    badgeScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600 }),
        withTiming(1, { duration: 600 }),
      ),
      -1,
      true,
    );
    floatingY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1200 }),
        withTiming(0, { duration: 1200 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }, { translateY: floatingY.value }],
  }));

  return (
    <View style={styles.graphicCanvas}>
      <View
        style={[
          styles.networkRing,
          {
            borderColor: colors.accent,
            opacity: 0.15,
            width: 180,
            height: 180,
          },
        ]}
      />
      <View
        style={[
          styles.networkRing,
          {
            borderColor: colors.accent,
            opacity: 0.25,
            width: 130,
            height: 130,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.loyaltyBadge,
          { backgroundColor: isDarkMode ? colors.surface : colors.primaryText },
          animatedPulseStyle,
        ]}
      >
        <FontAwesome5 name="gem" size={42} color={colors.accent} />
        <Text style={styles.badgeText}>RM-4832</Text>
      </Animated.View>
      <View
        style={[
          styles.satelliteStore,
          { top: 20, left: 30, backgroundColor: "#10B981" },
        ]}
      >
        <Ionicons name="storefront" size={16} color="#FFF" />
      </View>
      <View
        style={[
          styles.satelliteStore,
          { bottom: 20, right: 30, backgroundColor: "#3B82F6" },
        ]}
      >
        <Ionicons name="cart" size={16} color="#FFF" />
      </View>
    </View>
  );
}

// Slide 3 Layouts (Offline Engine)
function OfflineGraphic({ isDarkMode, colors }: GraphicProps) {
  const syncRotate = useSharedValue(0);
  const floatingY = useSharedValue(0);

  useEffect(() => {
    syncRotate.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false,
    );
    floatingY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1200 }),
        withTiming(0, { duration: 1200 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingY.value }],
  }));
  const animatedSpinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${syncRotate.value}deg` }],
  }));

  return (
    <View style={styles.graphicCanvas}>
      <Animated.View
        style={[
          styles.phoneChassis,
          { backgroundColor: colors.inputBg, borderColor: colors.inputBorder },
          animatedFloatStyle,
        ]}
      >
        <View style={styles.phoneScreenHeader} />
        <Ionicons
          name="shield-checkmark-outline"
          size={48}
          color="#10B981"
          style={{ marginTop: 20 }}
        />
        <Text style={[styles.offlineStatusText, { color: colors.primaryText }]}>
          Offline Secure Mode
        </Text>
        <Animated.View style={[styles.syncIconContainer, animatedSpinnerStyle]}>
          <Ionicons name="sync-outline" size={24} color={colors.accent} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default function OnboardingSlidesScreen() {
  const router = useRouter();
  const { isDarkMode, colors } = useContext(ThemeContext);
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const gradientColors = isDarkMode
    ? ["#0F172A", "#1E293B", "#0F172A"]
    : ["#E1E6F0", "#D3DAE8", "#C3CDE3"];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleFinish = () => {
    router.replace("/(auth)/login");
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const renderSlide = ({ item }: { item: SlideItem }) => {
    return (
      <View style={[styles.slideWrapper, { width: SCREEN_WIDTH }]}>
        <View style={styles.imageDisplayContainer}>
          {item.type === "ai" && (
            <AIScannerGraphic isDarkMode={isDarkMode} colors={colors} />
          )}
          {item.type === "loyalty" && (
            <LoyaltyGraphic isDarkMode={isDarkMode} colors={colors} />
          )}
          {item.type === "offline" && (
            <OfflineGraphic isDarkMode={isDarkMode} colors={colors} />
          )}
        </View>
        <Text style={[styles.slideTitle, { color: colors.primaryText }]}>
          {item.title}
        </Text>
        <Text
          style={[styles.slideDescription, { color: colors.secondaryText }]}
        >
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.headerRow}>
          <TopBar />
        </View>

        <FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />

        <View style={styles.footerContainer}>
          <View style={styles.indicatorRow}>
            {ONBOARDING_SLIDES.map((_, index) => {
              const animatedDotStyle = useAnimatedStyle(() => {
                const inputRange = [
                  (index - 1) * SCREEN_WIDTH,
                  index * SCREEN_WIDTH,
                  (index + 1) * SCREEN_WIDTH,
                ];
                const dotWidth = interpolate(
                  scrollX.value,
                  inputRange,
                  [8, 22, 8],
                  Extrapolate.CLAMP,
                );
                const opacity = interpolate(
                  scrollX.value,
                  inputRange,
                  [0.3, 1, 0.3],
                  Extrapolate.CLAMP,
                );
                return { width: dotWidth, opacity };
              });
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    { backgroundColor: colors.accent },
                    animatedDotStyle,
                  ]}
                />
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primaryText }]}
            onPress={handleNext}
            activeOpacity={0.9}
          >
            <Text
              style={[
                styles.nextButtonText,
                { color: isDarkMode ? "#0F172A" : "#FFFFFF" },
              ]}
            >
              {currentIndex === ONBOARDING_SLIDES.length - 1
                ? "Get Started"
                : "Next"}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={isDarkMode ? "#0F172A" : "#FFFFFF"}
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeAreaContainer: { flex: 1 },
  headerRow: { width: "100%" },
  slideWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
  },
  imageDisplayContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  graphicCanvas: {
    width: 220,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  // Graphic sub-layouts
  scanFrame: {
    width: 150,
    height: 140,
    borderWidth: 2,
    borderRadius: 12,
    borderStyle: "dashed",
    position: "relative",
    overflow: "hidden",
    padding: 8,
    justifyContent: "center",
  },
  scanLaser: { width: "100%", height: 3, position: "absolute", left: 0 },
  productBox: {
    width: 110,
    height: 100,
    borderRadius: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  productItemMock: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  loyaltyBadge: {
    width: 120,
    height: 120,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    zIndex: 5,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
    letterSpacing: 1,
  },
  networkRing: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  satelliteStore: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    zIndex: 10,
  },
  phoneChassis: {
    width: 110,
    height: 160,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    padding: 6,
    position: "relative",
  },
  phoneScreenHeader: {
    width: 40,
    height: 4,
    backgroundColor: "#64748B",
    borderRadius: 2,
    marginBottom: 8,
  },
  offlineStatusText: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
    opacity: 0.8,
  },
  syncIconContainer: {
    position: "absolute",
    bottom: 12,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  slideTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 14,
  },
  slideDescription: { fontSize: 14, textAlign: "center", lineHeight: 22 },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 36,
  },
  indicatorRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { height: 8, borderRadius: 4 },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 2,
  },
  nextButtonText: { fontSize: 14, fontWeight: "700" },
});
