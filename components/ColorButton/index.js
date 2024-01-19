import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../utils/colors';

export const ColorButton = (props) => {
  const { text, onPress, children, colorName = 'orange', size = '' } = props;
  const color = colors[colorName];
  const colorSeeThrough = colors.seeThrough[colorName];
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  const containerStyle = {
    backgroundColor: colorSeeThrough,
  };
  const buttonStyle = {
    opacity: buttonOpacity,
    borderColor: color,
  };
  const textColor = { color: colors.grey };

  return (
    <Pressable
      style={[
        styles.buttonWrapper,
        sizedStyles[size]?.buttonWrapper,
        containerStyle,
      ]}
      onPress={onPress}
      onPressIn={() => {
        Animated.sequence([
          Animated.timing(buttonOpacity, {
            toValue: 0.5,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }}
    >
      <Animated.View
        style={[styles.button, sizedStyles[size]?.button, buttonStyle]}
      >
        {children || (
          <Text style={[styles.label, sizedStyles[size]?.label, textColor]}>
            {text}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

const sizedStyles = StyleSheet.create({
  slim: {
    buttonWrapper: {
      height: 50,
    },
    button: {
      padding: 10,
    },
    label: {
      fontSize: 15,
    },
  },
});

const styles = StyleSheet.create({
  buttonWrapper: {
    marginVertical: 10,
    width: '100%',
    borderRadius: 8,
    height: 70,
  },
  button: {
    flex: 1,
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
  },
});
