import numbro from 'numbro';
import { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

import { StageTextInput } from './stages/StageTextInput';
import { StageWrapper } from './stages/StageWrapper';
import { CategoriesList } from '../../components/CategoriesList';

const deviceWidth = Dimensions.get('window').width;

const STAGES = {
  amount: 1,
  category: 2,
  date: 3,
  note: 4,
};

export default function AddTransactionModal(props) {
  const [amount, setamount] = useState('');
  const [note, setnote] = useState('');
  const [date, setdate] = useState('');
  const [category, setcategory] = useState(null);
  const [stage, setstage] = useState(STAGES.amount);

  const slideOutAnim = useRef(new Animated.Value(0)).current;

  const slideOutStyle = {
    transform: [{ translateX: slideOutAnim }],
  };

  const animateSlide = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideOutAnim, {
        toValue: -(stage * deviceWidth),
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [stage]);

  const onInputChange = useCallback(
    (value) => {
      switch (stage) {
        case STAGES.amount:
          setamount(value);
          break;
        case STAGES.category:
          setcategory(value);
          break;
        case STAGES.date:
          setdate(value);
          break;
        case STAGES.note:
          setnote(value);
          break;
      }
    },
    [stage],
  );

  const onSubmitInput = useCallback(() => {
    const isLastStage = stage === STAGES.note;
    if (isLastStage) {
      props.onSubmit({ amount, category, note });
    }
    setstage(stage + 1);
    animateSlide();
  }, [stage, amount, category, note]);

  const onCancel = useCallback(() => {
    props.onClose();
  }, []);

  return (
    <View style={styles.wrapper}>
      <StageWrapper
        style={slideOutStyle}
        onSubmitStage={onSubmitInput}
        onCancel={onCancel}
      >
        <StageTextInput
          onChange={onInputChange}
          value={amount}
          placeholder={numbro(0).formatCurrency({ mantissa: 2 })}
          autoFocus
          keyboardType="numeric"
          enterKeyHint="next"
          returnKeyType="next"
        />
      </StageWrapper>
      <StageWrapper
        style={slideOutStyle}
        onSubmitStage={onSubmitInput}
        onCancel={onCancel}
      >
        <CategoriesList
          categories={props.categories}
          onSelectedCategoryChange={onInputChange}
        />
      </StageWrapper>
      <StageWrapper
        style={slideOutStyle}
        onSubmitStage={onSubmitInput}
        onCancel={onCancel}
      >
        <StageTextInput
          onChange={onInputChange}
          value={note}
          placeholder="Note"
          keyboardType="default"
          enterKeyHint="next"
          returnKeyType="next"
        />
      </StageWrapper>
      <StageWrapper
        style={slideOutStyle}
        onSubmitStage={onSubmitInput}
        onCancel={onCancel}
      >
        <StageTextInput
          onChange={onInputChange}
          value={date}
          placeholder="Date"
          keyboardType="default"
          enterKeyHint="next"
          returnKeyType="next"
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
    borderColor: 'green',
    width: `${Object.keys(STAGES).length * 100}%`,
  },
  overlay: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'grey',
    opacity: 0.5,
    zIndex: 99999,
  },
});
