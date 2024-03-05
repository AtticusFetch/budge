import numbro from 'numbro';
import { useCallback, useRef, useState } from 'react';
import { Animated, LayoutAnimation, StyleSheet, View } from 'react-native';

import { AmountStage } from './Stages/Amount';
import { getTipAmount } from '../../utils/getTipAmount';

export default function AddTransactionModal(props) {
  const { transaction = {} } = props;
  const {
    tips: tTip,
    amount: tAmount,
    note: tNote,
    splitWith: tSplitWith,
    date: tDate,
    category: tCategory,
  } = transaction;
  const tipMultiplier = getTipAmount(tTip) || 1;
  const initialAmount =
    (parseFloat(tAmount) * (tSplitWith?.length + 1)) / (1 + tipMultiplier);
  const [amount, setamount] = useState(
    tAmount ? numbro(initialAmount).format({ mantissa: 0 }) : '',
  );
  const [note, setnote] = useState(tNote || '');
  const [date, setdate] = useState(tDate ? new Date(tDate) : new Date());
  const [rememberCheckboxVisible, setRememberCheckboxVisible] = useState(true);
  const [splitWith, setSplitWith] = useState(tSplitWith || []);
  const [tips, setTips] = useState(tTip || null);
  const [category, setcategory] = useState(tCategory || null);
  const [shouldRememberNote, setShouldRememberNote] = useState(false);

  const slideOutAnim = useRef(new Animated.Value(0)).current;

  const slideOutStyle = {
    transform: [{ translateX: slideOutAnim }],
  };

  const onAmountChange = useCallback((e) => {
    setamount(e);
  }, []);

  const onSubmitTransaction = useCallback(() => {
    let tipAmount = 0;
    const amountNum = parseFloat(amount);
    if (tips?.includes('%')) {
      tipAmount = numbro.unformat(tips) * amountNum;
    } else if (tips) {
      tipAmount = parseFloat(tips);
    }
    const finalAmount = `${amountNum + tipAmount}`;
    setamount(finalAmount);
    props.onSubmit({
      amount: finalAmount,
      category,
      note,
      date,
      tips,
      id: transaction.id,
      splitWith,
      shouldRememberNote,
    });
  }, [amount, category, note, shouldRememberNote, tips, transaction]);

  const onCancel = useCallback(() => {
    props.onClose();
  }, []);

  const onDateChange = useCallback((e) => {
    setdate(e);
  }, []);

  const onCategoryChange = useCallback((e) => {
    setcategory(e);
  }, []);

  const onNoteChange = useCallback(
    (e) => {
      if (!e && rememberCheckboxVisible) {
        return;
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
    },
    [rememberCheckboxVisible],
  );

  const stageProps = {
    style: slideOutStyle,
    submitLabel: 'Create',
    onSubmitStage: onSubmitTransaction,
    onCancel,
  };

  return (
    <View style={styles.wrapper}>
      <AmountStage
        rememberCheckboxVisible={rememberCheckboxVisible}
        setShouldRememberNote={setShouldRememberNote}
        onCategoryChange={onCategoryChange}
        categories={props.categories}
        onDateChange={onDateChange}
        setSplitWith={setSplitWith}
        onNoteChange={onNoteChange}
        onChange={onAmountChange}
        stageProps={stageProps}
        friends={props.friends}
        splitWith={splitWith}
        notes={props.notes}
        category={category}
        setTips={setTips}
        amount={amount}
        date={date}
        tips={tips}
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
    width: '100%',
  },
});
