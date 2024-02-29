import numbro from 'numbro';
import { useCallback, useEffect, useState } from 'react';
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

export const CarPaymentStage = (props) => {
  const { onChange, carPayment, savedSplitAmount } = props;
  const [splitAmount, setSplitAmount] = useState(null);
  const [split, setSplit] = useState(null);

  const onTwoWayCheckboxPress = useCallback(() => {
    setSplitAmount(SPLIT_AMOUNT['2']);
  }, []);
  const onThreeWayCheckboxPress = useCallback(() => {
    setSplitAmount(SPLIT_AMOUNT['3']);
  }, []);
  const onFourWayCheckboxPress = useCallback(() => {
    setSplitAmount(SPLIT_AMOUNT['4']);
  }, []);
  const onFiveWayCheckboxPress = useCallback(() => {
    setSplitAmount(SPLIT_AMOUNT['5']);
  }, []);

  const onSubmitStage = useCallback(() => {
    const carPaymentValue = parseFloat(carPayment);
    props.stageProps.onSubmitStage(
      numbro(carPaymentValue / split).format({ mantissa: 2 }),
      split,
    );
  }, [split, carPayment, props.stageProps.onSubmitStage, savedSplitAmount]);

  useEffect(() => {
    setSplit(splitAmount || savedSplitAmount);
  }, [splitAmount, savedSplitAmount]);

  return (
    <StageWrapper
      {...props.stageProps}
      onSubmitStage={onSubmitStage}
      contentWrapperStyle={styles.contentWrapperStyle}
      header="Any car payments?"
    >
      <StageTextInput
        onChange={onChange}
        value={carPayment}
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
            isChecked={split === SPLIT_AMOUNT['2']}
            onPress={onTwoWayCheckboxPress}
            label="2-way"
          />
          <LabeledCheckbox
            isChecked={split === SPLIT_AMOUNT['3']}
            onPress={onThreeWayCheckboxPress}
            label="3-way"
          />
        </View>
        <View style={globalStyles.row}>
          <LabeledCheckbox
            isChecked={split === SPLIT_AMOUNT['4']}
            onPress={onFourWayCheckboxPress}
            label="4-way"
          />
          <LabeledCheckbox
            isChecked={split === SPLIT_AMOUNT['5']}
            onPress={onFiveWayCheckboxPress}
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
