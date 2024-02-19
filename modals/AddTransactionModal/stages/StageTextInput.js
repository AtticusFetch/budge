import { StyleSheet, TextInput, View } from 'react-native';

import { colors } from '../../../utils/colors';

export const StageTextInput = (props) => {
  const { value, onChange, ...rest } = props;
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        onChangeText={onChange}
        value={value}
        enablesReturnKeyAutomatically
        textAlign="center"
        autoComplete="off"
        autoCapitalize="none"
        selectionColor={colors.orange}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    marginBottom: 80,
  },
  input: {
    height: 60,
    padding: 10,
    width: '100%',
    fontSize: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
