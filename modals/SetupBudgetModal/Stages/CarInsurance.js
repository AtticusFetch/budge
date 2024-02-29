import numbro from 'numbro';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LabeledCheckbox } from '../../../components/LabeledCheckbox';
import { StageWrapper } from '../../../components/ModalStageWrapper';
import { StageTextInput } from '../../../components/TextInput';
import { colors } from '../../../utils/colors';
import { formatCurrency } from '../../../utils/formatCurrency';
import { globalStyles } from '../../../utils/globalStyles';

const SPLIT_AMOUNT = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};

export const CarInsuranceStage = (props) => {
  const { onChange, carInsurance } = props;
  const [splitAmount, setSplitAmount] = useState(null);

  const onAnnualChecboxPress = useCallback(() => {
    setSplitAmount(SPLIT_AMOUNT['2']);
  }, []);
  const onMonthlyChecboxPress = useCallback(() => {
    setSplitAmount(SPLIT_AMOUNT['3']);
  }, []);
  const onSemiMonthlyChecboxPress = useCallback(() => {
    setSplitAmount(SPLIT_AMOUNT['4']);
  }, []);
  const onWeeklyChecboxPress = useCallback(() => {
    setSplitAmount(SPLIT_AMOUNT['5']);
  }, []);

  const onSubmitStage = useCallback(() => {
    const carInsuranceValue = parseFloat(carInsurance);
    const splitValue = parseFloat(splitAmount);
    props.stageProps.onSubmitStage(
      numbro(carInsuranceValue / splitValue).format({ mantissa: 2 }),
    );
  }, [splitAmount, carInsurance, props.stageProps.onSubmitStage]);

  return (
    <StageWrapper
      {...props.stageProps}
      onSubmitStage={onSubmitStage}
      contentWrapperStyle={styles.contentWrapperStyle}
      header="Car insurance?"
    >
      <StageTextInput
        onChange={onChange}
        value={carInsurance}
        placeholder={formatCurrency(0)}
        autoFocus
        keyboardType="numeric"
        enterKeyHint="next"
        returnKeyType="done"
      />
      <View style={styles.checkboxContainer}>
        <Text style={styles.splitLabel}>Splitting with someone?</Text>
        <View style={globalStyles.row}>
          <LabeledCheckbox
            isChecked={splitAmount === SPLIT_AMOUNT['2']}
            onPress={onAnnualChecboxPress}
            label="2-way"
          />
          <LabeledCheckbox
            isChecked={splitAmount === SPLIT_AMOUNT['3']}
            onPress={onMonthlyChecboxPress}
            label="3-way"
          />
        </View>
        <View style={globalStyles.row}>
          <LabeledCheckbox
            isChecked={splitAmount === SPLIT_AMOUNT['4']}
            onPress={onSemiMonthlyChecboxPress}
            label="4-way"
          />
          <LabeledCheckbox
            isChecked={splitAmount === SPLIT_AMOUNT['5']}
            onPress={onWeeklyChecboxPress}
            label="5-way"
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
  contentWrapperStyle: {
    flex: 0.6,
  },
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
