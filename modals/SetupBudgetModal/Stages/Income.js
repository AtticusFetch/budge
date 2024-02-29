import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LabeledCheckbox } from '../../../components/LabeledCheckbox';
import { StageWrapper } from '../../../components/ModalStageWrapper';
import { StageTextInput } from '../../../components/TextInput';
import { formatCurrency } from '../../../utils/formatCurrency';
import { globalStyles } from '../../../utils/globalStyles';

const SALARY_TYPES = {
  annual: 'annual',
  monthly: 'monthly',
  semiMonthly: 'semiMonthly',
  weekly: 'weekly',
};

export const IncomeStage = (props) => {
  const { onChange, income } = props;
  const [checkedSalaryType, setCheckedSalaryType] = useState(null);

  const onAnnualChecboxPress = useCallback(() => {
    setCheckedSalaryType(SALARY_TYPES.annual);
  }, []);
  const onMonthlyChecboxPress = useCallback(() => {
    setCheckedSalaryType(SALARY_TYPES.monthly);
  }, []);
  const onSemiMonthlyChecboxPress = useCallback(() => {
    setCheckedSalaryType(SALARY_TYPES.semiMonthly);
  }, []);
  const onWeeklyChecboxPress = useCallback(() => {
    setCheckedSalaryType(SALARY_TYPES.weekly);
  }, []);

  return (
    <StageWrapper
      {...props.stageProps}
      contentWrapperStyle={styles.contentWrapperStyle}
      header="Your paycheck:"
    >
      <StageTextInput
        onChange={onChange}
        value={income}
        placeholder={formatCurrency(0)}
        autoFocus
        keyboardType="numeric"
        enterKeyHint="next"
        returnKeyType="done"
      />
      <View style={styles.checkboxContainer}>
        <View style={globalStyles.row}>
          <LabeledCheckbox
            isChecked={checkedSalaryType === SALARY_TYPES.annual}
            onPress={onAnnualChecboxPress}
            label="Annual"
          />
          <LabeledCheckbox
            isChecked={checkedSalaryType === SALARY_TYPES.monthly}
            onPress={onMonthlyChecboxPress}
            label="Monthly"
          />
        </View>
        <View style={globalStyles.row}>
          <LabeledCheckbox
            isChecked={checkedSalaryType === SALARY_TYPES.semiMonthly}
            onPress={onSemiMonthlyChecboxPress}
            label="Semi Monthly"
          />
          <LabeledCheckbox
            isChecked={checkedSalaryType === SALARY_TYPES.weekly}
            onPress={onWeeklyChecboxPress}
            label="Weekly"
          />
        </View>
      </View>
    </StageWrapper>
  );
};

const styles = StyleSheet.create({
  modifierButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  contentWrapperStyle: {},
  checkboxContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
