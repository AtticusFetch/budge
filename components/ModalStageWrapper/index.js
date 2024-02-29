import { useCallback } from 'react';
import { Animated, KeyboardAvoidingView, StyleSheet, Text } from 'react-native';

import { colors } from '../../utils/colors';
import { ColorButton } from '../ColorButton';

export const StageWrapper = ({
  children,
  onSubmitStage,
  onCancel,
  style,
  header,
  submitLabel,
  contentWrapperStyle,
  ...rest
}) => {
  const onSubmit = useCallback(() => {
    onSubmitStage();
  }, [onSubmitStage]);

  return (
    <Animated.View style={[styles.animatedWrapper, style]} {...rest}>
      <KeyboardAvoidingView
        style={[styles.container, contentWrapperStyle]}
        behavior="padding"
      >
        {!!header && <Text style={styles.header}>{header}</Text>}
        {children}
        <ColorButton
          onPress={onSubmit}
          text={submitLabel || 'Next'}
          size="slim"
        />
        <ColorButton onPress={onCancel} text="Cancel" size="slim" />
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 30,
    color: colors.grey,
  },
  container: {
    flex: 0.5,
    backgroundColor: 'white',
    shadowColor: colors.grey,
    shadowOffset: { width: 2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 40,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 55,
  },
});
