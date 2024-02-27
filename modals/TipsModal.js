import numbro from 'numbro';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CategoriesList } from '../components/CategoriesList';
import { StageWrapper } from '../components/ModalStageWrapper';
import { StageTextInput } from '../components/TextInput';

const tipsPercentages = ['10%', '15%', '18%', '20%'];

export default function TipsModal(props) {
  const { onDone, onClose } = props;
  const [tipsAmount, setTipsAmount] = useState(null);

  const onInputChange = useCallback((e) => {
    setTipsAmount(e);
  }, []);

  const onSubmitInput = useCallback(() => {
    onDone(tipsAmount);
  }, [tipsAmount]);

  const onCancel = useCallback(() => {
    onClose();
  }, []);

  return (
    <View style={styles.wrapper}>
      <StageWrapper
        submitLabel="Set Tips"
        onSubmitStage={onSubmitInput}
        onCancel={onCancel}
        style={styles.container}
      >
        <StageTextInput
          onChange={onInputChange}
          value={tipsAmount}
          placeholder={numbro(0).formatCurrency({ mantissa: 2 })}
          autoFocus
          keyboardType="numeric"
        />
        <CategoriesList
          categories={tipsPercentages}
          onSelectedCategoryChange={onInputChange}
        />
      </StageWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  },
});
