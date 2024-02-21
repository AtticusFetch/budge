import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../../utils/colors';

export const StageTextInput = (props) => {
  const { value, onChange, hasError, ...rest } = props;
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={[styles.input, hasError && styles.error]}
        onChangeText={onChange}
        value={value}
        enablesReturnKeyAutomatically
        textAlign="center"
        autoComplete="off"
        autoCapitalize="none"
        selectionColor={colors.orange}
        {...rest}
      />
      {hasError && (
        <Text style={styles.errorMessage}>
          {hasError.message || 'Something went wrong'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
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
