import { StyleSheet, Text } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import { colors } from '../../utils/colors';

export const LabeledCheckbox = (props) => (
  <BouncyCheckbox
    size={25}
    fillColor={props.color || colors.blue}
    unfillColor="white"
    style={[styles.checkbox, props.style]}
    isChecked={props.isChecked}
    textComponent={<Text style={styles.checkboxLabel}>{props.label}</Text>}
    onPress={props.onPress}
    disableBuiltInState
  />
);

const styles = StyleSheet.create({
  checkboxLabel: {
    marginLeft: 10,
  },
  checkbox: {
    marginBottom: 5,
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderColor: colors.blue,
    borderRadius: 8,
    marginHorizontal: 5,
  },
});
