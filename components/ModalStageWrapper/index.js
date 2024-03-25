import { useCallback } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../../utils/colors';
import { ColorButton } from '../ColorButton';
import { Icon } from '../Icon';

export const StageWrapper = ({
  children,
  onSubmitStage,
  onCancel,
  style,
  header,
  submitLabel,
  cancelLabel,
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
        {!!onCancel && (
          <TouchableOpacity style={styles.closeIcon} onPress={onCancel}>
            <Icon name="x" size={30} color={colors.grey} />
          </TouchableOpacity>
        )}
        {!!header && <Text style={styles.header}>{header}</Text>}
        {children}
        <View style={styles.buttonsWrapper}>
          {!!submitLabel && (
            <ColorButton onPress={onSubmit} text={submitLabel} size="slim" />
          )}
          {!!onCancel && (
            <ColorButton
              onPress={onCancel}
              text={cancelLabel || 'Cancel'}
              size="slim"
            />
          )}
        </View>
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
    marginBottom: 10,
    color: colors.grey,
  },
  container: {
    flex: 0.5,
    backgroundColor: 'white',
    shadowColor: colors.grey,
    shadowOffset: { width: 2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    alignItems: 'center',
    width: '100%',
    padding: 30,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 30,
  },
  buttonsWrapper: {
    width: '100%',
    paddingBottom: 40,
  },
  closeIcon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    backgroundColor: colors.seeThrough.grey,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.grey,
    top: 15,
    right: 5,
    padding: 5,
  },
});
