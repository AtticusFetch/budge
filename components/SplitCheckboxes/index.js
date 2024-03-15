import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { LabeledCheckbox } from '../LabeledCheckbox';

const SPLIT_AMOUNT = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};

export const SplitCheckboxes = (props) => {
  const { savedSplitAmount, onChange } = props;
  const [splitAmount, setSplitAmount] = useState(null);
  const [split, setSplit] = useState(null);
  const [pristine, setPristine] = useState(true);

  const onTwoWayCheckboxPress = useCallback(() => {
    setPristine(false);
    if (split === SPLIT_AMOUNT['2']) {
      setSplitAmount(null);
    } else {
      setSplitAmount(SPLIT_AMOUNT['2']);
    }
  }, [split]);
  const onThreeWayCheckboxPress = useCallback(() => {
    setPristine(false);
    if (split === SPLIT_AMOUNT['3']) {
      setSplitAmount(null);
    } else {
      setSplitAmount(SPLIT_AMOUNT['3']);
    }
  }, [split]);
  const onFourWayCheckboxPress = useCallback(() => {
    setPristine(false);
    if (split === SPLIT_AMOUNT['4']) {
      setSplitAmount(null);
    } else {
      setSplitAmount(SPLIT_AMOUNT['4']);
    }
  }, [split]);
  const onFiveWayCheckboxPress = useCallback(() => {
    setPristine(false);
    if (split === SPLIT_AMOUNT['5']) {
      setSplitAmount(null);
    } else {
      setSplitAmount(SPLIT_AMOUNT['5']);
    }
  }, [split]);

  useEffect(() => {
    let amount = splitAmount || savedSplitAmount;
    if (!pristine) {
      amount = splitAmount;
    }
    setSplit(amount);
    onChange(amount);
  }, [splitAmount, savedSplitAmount, pristine]);

  return (
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
