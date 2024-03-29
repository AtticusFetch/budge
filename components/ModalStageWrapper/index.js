import { Animated, KeyboardAvoidingView, StyleSheet } from 'react-native';

import { colors } from '../../utils/colors';
import { ColorButton } from '../ColorButton';

export const StageWrapper = ({
  children,
  onSubmitStage,
  onCancel,
  style,
  submitLabel,
}) => {
  return (
    <Animated.View style={[styles.animatedWrapper, style]}>
      <KeyboardAvoidingView style={[styles.container]} behavior="padding">
        {children}
        <ColorButton
          onPress={onSubmitStage}
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
  container: {
    flex: 0.5,
    backgroundColor: 'white',
    shadowColor: colors.grey,
    shadowOffset: { width: 2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 40,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 55,
  },
});
