import numbro from 'numbro';
import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  LayoutAnimation,
  StyleSheet,
  View,
} from 'react-native';

import { AmountStage } from './Stages/Amount';
import { CategoryStage } from './Stages/Category';
import { DateStage } from './Stages/Date';
import { NoteStage } from './Stages/Note';

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
  const [date, setdate] = useState(new Date());
  const [rememberCheckboxVisible, setRememberCheckboxVisible] = useState(true);
  const [splitWith, setSplitWith] = useState([]);
  const [tips, setTips] = useState(null);
  const [category, setcategory] = useState(null);
  const [stage, setstage] = useState(STAGES.amount);
  const [shouldRememberNote, setShouldRememberNote] = useState(false);

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
    (e) => {
      switch (stage) {
        case STAGES.amount:
          setamount(e);
          break;
        case STAGES.category:
          setcategory(e);
          break;
        case STAGES.date:
          setdate(e);
          break;
        case STAGES.note:
          if (!e && rememberCheckboxVisible) {
            break;
          }
          LayoutAnimation.configureNext({
            duration: 700,
            create: { type: 'linear', property: 'opacity', duration: 350 },
            update: { type: 'spring', springDamping: 0.4 },
          });
          if (e?.id) {
            setRememberCheckboxVisible(false);
          } else {
            setRememberCheckboxVisible(true);
          }
          setnote(e?.name || e);
          break;
      }
    },
    [stage, rememberCheckboxVisible],
  );

  const onSubmitInput = useCallback(() => {
    const isLastStage = stage === STAGES.note;
    if (isLastStage) {
      props.onSubmit({
        amount,
        category,
        note,
        date,
        tips,
        splitWith,
        shouldRememberNote,
      });
    }
    if (stage === STAGES.amount) {
      let tipAmount = 0;
      const amountNum = parseFloat(amount);
      if (tips?.includes('%')) {
        tipAmount = numbro.unformat(tips) * amountNum;
      } else if (tips) {
        tipAmount = parseFloat(tips);
      }
      const finalAmount = `${amountNum + tipAmount}`;
      setamount(finalAmount);
    }
    setstage(stage + 1);
    animateSlide();
  }, [stage, amount, category, note, shouldRememberNote, tips]);

  const onCancel = useCallback(() => {
    props.onClose();
  }, []);

  const stageProps = {
    style: slideOutStyle,
    onSubmitStage: onSubmitInput,
    onCancel,
  };

  return (
    <View style={styles.wrapper}>
      <AmountStage
        setSplitWith={setSplitWith}
        stageProps={stageProps}
        splitWith={splitWith}
        onChange={onInputChange}
        friends={props.friends}
        setTips={setTips}
        amount={amount}
        tips={tips}
      />
      <CategoryStage
        stageProps={stageProps}
        onChange={onInputChange}
        categories={props.categories}
      />
      <DateStage stageProps={stageProps} onChange={onInputChange} date={date} />
      <NoteStage
        stageProps={stageProps}
        rememberCheckboxVisible={rememberCheckboxVisible}
        setShouldRememberNote={setShouldRememberNote}
        onChange={onInputChange}
        notes={props.notes}
        note={note}
      />
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
