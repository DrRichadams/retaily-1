// import {
//   FontAwesome5,
//   Ionicons,
//   MaterialCommunityIcons,
// } from "@expo/vector-icons";
// import React, { useState } from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Animated, {
//   FadeIn,
//   FadeOut,
//   LinearTransition,
// } from "react-native-reanimated";
// import { SafeAreaView } from "react-native-safe-area-context";
// import CustomButton from "../components/CustomButton";
// import CustomInput from "../components/CustomInput";
// import TopBar from "../components/TopBar";

// const lightColors = {
//   background: "#E1E6F0",
//   primary: "#0B2240",
//   accent: "#1A44B8",
//   inputBg: "#D5DDEB",
//   inputBorder: "#B0BCCF",
//   textMuted: "#7E8B9B",
// };

// const darkColors = {
//   background: "#1E293B",
//   primary: "#F8FAFC",
//   accent: "#38BDF8",
//   inputBg: "#334155",
//   inputBorder: "#475569",
//   textMuted: "#94A3B8",
// };

// export default function LoginScreen() {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
//   const [countryCode, setCountryCode] = useState("+ 1");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const colors = isDarkMode ? darkColors : lightColors;

//   const isButtonDisabled = activeTab === "email" ? !email || !password : !phone;

//   return (
//     <SafeAreaView
//       style={[styles.container, { backgroundColor: colors.background }]}
//     >
//       <TopBar
//         isDarkMode={isDarkMode}
//         onToggleTheme={() => setIsDarkMode(!isDarkMode)}
//       />

//       {/* SECTION 1: Fixed Branding & Tabs */}
//       <View style={styles.topSection}>
//         <Image
//           source={require("../assets/common-graphics/logo-mini.png")}
//           style={styles.logo}
//         />
//         <Text style={[styles.title, { color: colors.primary }]}>
//           Continue to Retaily
//         </Text>
//         <Text style={[styles.subtitle, { color: colors.primary }]}>
//           Sign in to manage your stores, employees and customers.
//         </Text>

//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             onPress={() => setActiveTab("email")}
//             style={[
//               styles.tab,
//               activeTab === "email" && { borderBottomColor: colors.accent },
//             ]}
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 {
//                   color:
//                     activeTab === "email" ? colors.accent : colors.textMuted,
//                 },
//               ]}
//             >
//               Email Address
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => setActiveTab("phone")}
//             style={[
//               styles.tab,
//               activeTab === "phone" && { borderBottomColor: colors.accent },
//             ]}
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 {
//                   color:
//                     activeTab === "phone" ? colors.accent : colors.textMuted,
//                 },
//               ]}
//             >
//               Phone Number
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* SECTION 2: Dynamic Form Area */}
//       <View style={styles.mainContentArea}>
//         {/* Unified Animated Container: Buttons and inputs react together */}
//         <Animated.View
//           layout={LinearTransition.springify().damping(16).mass(0.8)}
//           style={styles.fullWidth}
//         >
//           {activeTab === "email" ? (
//             <Animated.View
//               entering={FadeIn.duration(180)}
//               exiting={FadeOut.duration(100)}
//               style={styles.fullWidth}
//             >
//               <CustomInput
//                 placeholder="Enter your email address"
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//               />
//               <CustomInput
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry
//               />
//             </Animated.View>
//           ) : (
//             <Animated.View
//               entering={FadeIn.duration(180)}
//               exiting={FadeOut.duration(100)}
//               style={styles.fullWidth}
//             >
//               <View
//                 style={[
//                   styles.phoneInputGroup,
//                   {
//                     backgroundColor: colors.inputBg,
//                     borderColor: colors.inputBorder,
//                   },
//                 ]}
//               >
//                 <TouchableOpacity style={styles.countryPickerButton}>
//                   <Text
//                     style={[styles.countryCodeText, { color: colors.primary }]}
//                   >
//                     {countryCode}
//                   </Text>
//                   <Ionicons
//                     name="chevron-down"
//                     size={14}
//                     color={colors.textMuted}
//                     style={styles.dropdownChevron}
//                   />
//                 </TouchableOpacity>

//                 <View
//                   style={[
//                     styles.verticalDivider,
//                     { backgroundColor: colors.inputBorder },
//                   ]}
//                 />

//                 <CustomInput
//                   placeholder="Enter your phone number"
//                   value={phone}
//                   onChangeText={setPhone}
//                   keyboardType="phone-pad"
//                   style={styles.inlineInputOverride}
//                   containerStyle={styles.inlineContainerOverride}
//                 />
//               </View>
//             </Animated.View>
//           )}

//           {/* The Next Button is now nested inside the layout wrapper, keeping it directly below the inputs */}
//           <View style={styles.buttonSpacer}>
//             <CustomButton
//               title="Next"
//               disabled={isButtonDisabled}
//               onPress={() => {}}
//             />
//           </View>

//           <Text style={[styles.footerText, { color: colors.primary }]}>
//             By continuing you agree to the{" "}
//             <Text style={[styles.link, { color: colors.accent }]}>
//               Terms of Service
//             </Text>{" "}
//             and{" "}
//             <Text style={[styles.link, { color: colors.accent }]}>
//               Privacy Policy
//             </Text>
//             .
//           </Text>
//         </Animated.View>
//       </View>

//       {/* SECTION 3: Fixed Bottom Social Row */}
//       <View style={styles.alternativeLoginContainer}>
//         <Text style={[styles.orText, { color: colors.textMuted }]}>
//           or log in with
//         </Text>

//         <View style={styles.socialRow}>
//           <TouchableOpacity
//             style={[
//               styles.socialIconCircle,
//               {
//                 backgroundColor: colors.inputBg,
//                 borderColor: colors.inputBorder,
//               },
//             ]}
//           >
//             <FontAwesome5 name="google" size={22} color="#EA4335" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.socialIconCircle,
//               {
//                 backgroundColor: colors.inputBg,
//                 borderColor: colors.inputBorder,
//               },
//             ]}
//           >
//             <Ionicons
//               name="logo-apple"
//               size={24}
//               color={isDarkMode ? "#FFFFFF" : "#000000"}
//             />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.socialIconCircle,
//               {
//                 backgroundColor: colors.inputBg,
//                 borderColor: colors.inputBorder,
//               },
//             ]}
//           >
//             <MaterialCommunityIcons
//               name="microsoft"
//               size={24}
//               color="#F25022"
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   topSection: { paddingHorizontal: 24, paddingTop: 24 },
//   logo: { width: 60, height: 60, marginBottom: 24, borderRadius: 12 },
//   title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
//   subtitle: { fontSize: 16, opacity: 0.8, marginBottom: 32, lineHeight: 22 },
//   tabContainer: { flexDirection: "row", marginBottom: 20 },
//   tab: {
//     paddingBottom: 8,
//     marginRight: 24,
//     borderBottomWidth: 3,
//     borderBottomColor: "transparent",
//   },
//   tabText: { fontSize: 18, fontWeight: "600" },

//   mainContentArea: {
//     flex: 1,
//     paddingHorizontal: 24,
//     justifyContent: "flex-start",
//   },
//   fullWidth: {
//     width: "100%",
//   },
//   buttonSpacer: {
//     marginTop: 16, // Clean spacing directly under whichever input layout is visible
//     width: "100%",
//   },

//   // Lark Phone Layout Styling
//   phoneInputGroup: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     height: 54,
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//   },
//   countryPickerButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     height: "100%",
//     paddingRight: 8,
//   },
//   countryCodeText: { fontSize: 16, fontWeight: "500" },
//   dropdownChevron: { marginLeft: 6 },
//   verticalDivider: { width: 1, height: 24, marginHorizontal: 4 },
//   inlineContainerOverride: { flex: 1, marginBottom: 0 },
//   inlineInputOverride: {
//     borderWidth: 0,
//     backgroundColor: "transparent",
//     paddingHorizontal: 8,
//     height: "100%",
//   },

//   footerText: {
//     textAlign: "center",
//     fontSize: 14,
//     marginTop: 16,
//     lineHeight: 20,
//   },
//   link: { fontWeight: "600" },

//   alternativeLoginContainer: {
//     alignItems: "center",
//     paddingBottom: 36,
//     paddingHorizontal: 24,
//   },
//   orText: { fontSize: 14, fontWeight: "500", marginBottom: 16 },
//   socialRow: { flexDirection: "row", justifyContent: "center", gap: 20 },
//   socialIconCircle: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     borderWidth: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
// });
