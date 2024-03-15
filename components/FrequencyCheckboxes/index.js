import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/colors';
import { FREQUENCY_TYPES } from '../../utils/getFrequencyMultiplier';
import { globalStyles } from '../../utils/globalStyles';
import { LabeledCheckbox } from '../LabeledCheckbox';

export const FrequencyCheckboxes = (props) => {
  const { onChange, savedFrequency } = props;
  const [checkedSalaryType, setCheckedSalaryType] = useState();
  const [pristine, setPristine] = useState(true);

  const onAnnualChecboxPress = useCallback(() => {
    setPristine(false);
    if (checkedSalaryType === FREQUENCY_TYPES.annual) {
      setCheckedSalaryType();
    } else {
      setCheckedSalaryType(FREQUENCY_TYPES.annual);
    }
  }, [checkedSalaryType]);
  const onMonthlyChecboxPress = useCallback(() => {
    setPristine(false);
    if (checkedSalaryType === FREQUENCY_TYPES.monthly) {
      setCheckedSalaryType();
    } else {
      setCheckedSalaryType(FREQUENCY_TYPES.monthly);
    }
  }, [checkedSalaryType]);
  const onSemiMonthlyChecboxPress = useCallback(() => {
    setPristine(false);
    if (checkedSalaryType === FREQUENCY_TYPES.semiMonthly) {
      setCheckedSalaryType();
    } else {
      setCheckedSalaryType(FREQUENCY_TYPES.semiMonthly);
    }
  }, [checkedSalaryType]);
  const onWeeklyChecboxPress = useCallback(() => {
    setPristine(false);
    if (checkedSalaryType === FREQUENCY_TYPES.weekly) {
      setCheckedSalaryType();
    } else {
      setCheckedSalaryType(FREQUENCY_TYPES.weekly);
    }
  }, [checkedSalaryType]);

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
