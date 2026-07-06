import React, { useContext } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { ThemeContext } from "../app/_layout";

interface CustomInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

const CustomInput = React.forwardRef<TextInput, CustomInputProps>(
  ({ style, containerStyle, ...restProps }, ref) => {
    const { colors } = useContext(ThemeContext);

    return (
      <View style={[styles.container, containerStyle]}>
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputBorder,
              color: colors.primaryText,
            },
            style,
          ]}
          placeholderTextColor={colors.secondaryText}
          autoCapitalize="none"
          autoCorrect={false}
          {...restProps}
        />
      </View>
    );
  },
);

CustomInput.displayName = "CustomInput";

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 16 },
  input: {
    width: "100%",
    height: 54,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

export default CustomInput;
