import numbro from 'numbro';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

import { FrequencyCheckboxes } from '../../../components/FrequencyCheckboxes';
import { StageWrapper } from '../../../components/ModalStageWrapper';
import { StageTextInput } from '../../../components/TextInput';
import { formatCurrency } from '../../../utils/formatCurrency';
import {
  FREQUENCY_TYPES,
  getFrequencyMultiplier,
} from '../../../utils/getFrequencyMultiplier';

export const IncomeStage = (props) => {
  const { onChange, income } = props;
  const [checkedSalaryType, setCheckedSalaryType] = useState(
    FREQUENCY_TYPES.semiMonthly,
  );

  const onSubmitStage = useCallback(() => {
    if (!income) {
      props.stageProps.onSubmitStage();
      return;
    }
    const incomeValue = parseFloat(income);
    const weeklyMultiplier = getFrequencyMultiplier(checkedSalaryType);
    const weeklyIncome = incomeValue * weeklyMultiplier;
    props.stageProps.onSubmitStage(
      numbro(weeklyIncome).format({ mantissa: 2 }),
    );
  }, [income, props.stageProps.onSubmitStage, checkedSalaryType]);

  return (
    <StageWrapper
      {...props.stageProps}
      onSubmitStage={onSubmitStage}
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
      <FrequencyCheckboxes onChange={setCheckedSalaryType} />
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
