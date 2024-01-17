import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { getTextColor } from "../../utils/getTextColor";

export const ColorButton = (props) => {
  const { text, onPress, children, inverted } = props;
  const [randomColor, setRandomColor] = useState('purple');
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    setRandomColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
  }, [text, inverted]);
  let containerStyle = {
    backgroundColor: randomColor,
  };
  let buttonStyle = {
    opacity: buttonOpacity,
    borderColor: randomColor,
    backgroundColor: 'white',
  };
  let textColor = { color: 'black' };

  if (inverted) {
    containerStyle = {
      backgroundColor: 'white',
    };
    buttonStyle = {
      opacity: buttonOpacity,
      borderColor: randomColor,
      backgroundColor: randomColor,
    };
    textColor = { color: getTextColor(randomColor) };
  }

  return (
    <Pressable
      style={[styles.buttonWrapper, containerStyle]}
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
          })
        ]).start();
      }}
    >
      <Animated.View style={[styles.button, buttonStyle]}>
        {children || <Text style={[styles.label, textColor]}>{text}</Text>}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    height: 'auto',
    marginVertical: 10,
    borderColor: 'white',
    borderRadius: 8,
    width: '100%',
    height: 70,
  },
  button: {
    flex: 1,
    padding: 20,
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
  },
});
