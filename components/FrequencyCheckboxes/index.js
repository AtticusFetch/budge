import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/colors';
import { FREQUENCY_TYPES } from '../../utils/getFrequencyMultiplier';
import { globalStyles } from '../../utils/globalStyles';
import { LabeledCheckbox } from '../LabeledCheckbox';

export const FrequencyCheckboxes = (props) => {
  const { onChange, savedFrequency, required = false } = props;
  const [checkedSalaryType, setCheckedSalaryType] = useState();
  const [pristine, setPristine] = useState(true);

  const setFrequency = useCallback(
    (frequency) => {
      setPristine(false);
      if (!required && checkedSalaryType === frequency) {
        setCheckedSalaryType();
      } else {
        setCheckedSalaryType(frequency);
      }
    },
    [checkedSalaryType],
  );

  const onAnnualChecboxPress = useCallback(() => {
    setFrequency(FREQUENCY_TYPES.annual);
  }, [setFrequency]);
  const onMonthlyChecboxPress = useCallback(() => {
    setFrequency(FREQUENCY_TYPES.monthly);
  }, [setFrequency]);
  const onSemiMonthlyChecboxPress = useCallback(() => {
    setFrequency(FREQUENCY_TYPES.semiMonthly);
  }, [setFrequency]);
  const onWeeklyChecboxPress = useCallback(() => {
    setFrequency(FREQUENCY_TYPES.weekly);
  }, [setFrequency]);

  useEffect(() => {
    let salaryFrequency = checkedSalaryType || savedFrequency;
    if (!pristine) {
      salaryFrequency = checkedSalaryType;
    }
    if (!checkedSalaryType && savedFrequency && pristine) {
      setCheckedSalaryType(savedFrequency);
    }
    onChange(salaryFrequency);
  }, [checkedSalaryType, savedFrequency, pristine]);

  return (
    <View style={styles.checkboxContainer}>
      <Text style={styles.splitLabel}>Frequency</Text>
      <View style={globalStyles.row}>
        <LabeledCheckbox
          isChecked={checkedSalaryType === FREQUENCY_TYPES.annual}
          onPress={onAnnualChecboxPress}
          label="Annual"
        />
        <LabeledCheckbox
          isChecked={checkedSalaryType === FREQUENCY_TYPES.monthly}
          onPress={onMonthlyChecboxPress}
          label="Monthly"
        />
      </View>
      <View style={globalStyles.row}>
        <LabeledCheckbox
          isChecked={checkedSalaryType === FREQUENCY_TYPES.semiMonthly}
          onPress={onSemiMonthlyChecboxPress}
          label="Semi Monthly"
        />
        <LabeledCheckbox
          isChecked={checkedSalaryType === FREQUENCY_TYPES.weekly}
          onPress={onWeeklyChecboxPress}
          label="Weekly"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splitLabel: {
    color: colors.grey,
    marginBottom: 10,
    marginTop: 30,
  },
});
