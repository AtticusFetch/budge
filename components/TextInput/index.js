import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TextInput } from 'react-native';

import { colors } from '../../utils/colors';

export const StageTextInput = (props) => {
  const { value, onChange, hasError, ...rest } = props;
  const jumpAnim = useRef(new Animated.Value(0)).current;

  const animateContainerError = {
    transform: [
      {
        translateX: jumpAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 10, 0],
        }),
      },
    ],
  };

  useEffect(() => {
    if (hasError) {
      Animated.spring(jumpAnim, {
        toValue: 1,
        duration: 250,
        delay: 0,
        useNativeDriver: true,
      }).start(() => jumpAnim.setValue(0));
    }
  }, [hasError]);
  return (
    <Animated.View
      style={[
        styles.inputWrapper,
        hasError && animateContainerError,
        props.containerStyle,
      ]}
    >
      <TextInput
        style={[styles.input, hasError && styles.error, props.inputStyle]}
        onChangeText={onChange}
        value={value}
        enablesReturnKeyAutomatically
        textAlign="center"
        autoComplete="off"
        autoCapitalize="none"
        selectionColor={colors.orange}
        {...rest}
      />
      {hasError?.message && (
        <Text style={styles.errorMessage}>
          {hasError.message || 'Something went wrong'}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flex: 1,
    width: '100%',
  },
  input: {
    height: 60,
    padding: 10,
    width: '100%',
    fontSize: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  error: {
    borderWidth: 1.5,
    borderColor: colors.red,
  },
  errorMessage: {
    color: colors.red,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
});
