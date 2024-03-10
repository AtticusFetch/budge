import numbro from 'numbro';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

import { StageWrapper } from '../../../components/ModalStageWrapper';
import { SplitCheckboxes } from '../../../components/SplitCheckboxes';
import { StageTextInput } from '../../../components/TextInput';
import { colors } from '../../../utils/colors';
import { formatCurrency } from '../../../utils/formatCurrency';

export const UtilitiesStage = (props) => {
  const { onChange, utilities, savedSplitAmount } = props;
  const [split, setSplit] = useState(null);

  const onSubmitStage = useCallback(() => {
    const carPaymentValue = parseFloat(utilities);
    props.stageProps.onSubmitStage(
      numbro(carPaymentValue / split).format({ mantissa: 2 }),
      split,
    );
  }, [split, utilities, props.stageProps.onSubmitStage, savedSplitAmount]);

  return (
    <StageWrapper
      {...props.stageProps}
      onSubmitStage={onSubmitStage}
      contentWrapperStyle={styles.contentWrapperStyle}
      header="Utility Bills:"
    >
      <StageTextInput
        onChange={onChange}
        value={utilities}
        placeholder={formatCurrency(0)}
        autoFocus
        keyboardType="numeric"
        enterKeyHint="next"
        returnKeyType="done"
      />
      <SplitCheckboxes
        savedSplitAmount={savedSplitAmount}
        onChange={setSplit}
      />
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
