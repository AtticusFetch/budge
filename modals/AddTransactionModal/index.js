import moment from 'moment';
import numbro from 'numbro';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Modal,
  StyleSheet,
  View,
} from 'react-native';

import { AmountStage } from './Stages/Amount';
import { DismissKeyboard } from '../../components/DismissKeyboard';
import { getTipAmount } from '../../utils/getTipAmount';

export default function AddTransactionModal(props) {
  const { transaction, userCategories } = props;
  const tipMultiplier = getTipAmount(transaction?.tTip) || 0;
  const initialAmount =
    (parseFloat(transaction?.amount) * (transaction?.splitWith?.length + 1)) /
    (tipMultiplier + 1);
  const [amount, setAmount] = useState(
    transaction?.amount ? numbro(initialAmount).format({ mantissa: 0 }) : '',
  );
  const [isIncome, setIsIncome] = useState(transaction?.isIncome);
  const [note, setNote] = useState(transaction?.note || '');
  const [date, setDate] = useState(moment(transaction?.date));
  const [rememberCheckboxVisible, setRememberCheckboxVisible] = useState(true);
  const [splitWith, setSplitWith] = useState(transaction?.splitWith || []);
  const [tips, setTips] = useState(transaction?.tip || null);
  const [category, setCategory] = useState(transaction?.category);
  const [shouldRememberNote, setShouldRememberNote] = useState(false);

  const slideOutAnim = useRef(new Animated.Value(0)).current;

  const slideOutStyle = {
    transform: [{ translateX: slideOutAnim }],
  };

  const onAmountChange = useCallback((e) => {
    setAmount(e);
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
    setAmount(finalAmount);
    props.onSubmit({
      ...transaction,
      amount: finalAmount,
      category,
      note,
      date,
      tips,
      splitWith,
      isIncome,
      shouldRememberNote,
    });
  }, [
    amount,
    category,
    note,
    shouldRememberNote,
    tips,
    isIncome,
    transaction,
    splitWith,
  ]);

  const onCancel = useCallback(() => {
    props.onClose();
  }, []);

  const onDateChange = useCallback((e) => {
    setDate(e);
  }, []);

  const onCategoryChange = useCallback((e) => {
    setCategory(e);
  }, []);

  const onIncomeCheckboxPress = useCallback(() => {
    setIsIncome(!isIncome);
  }, [isIncome]);

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
      setNote(e?.name || e);
    },
    [rememberCheckboxVisible],
  );

  useEffect(() => {
    if (transaction) {
      setAmount(`${transaction?.amount}`);
      setCategory(transaction?.category);
      setIsIncome(transaction?.isIncome);
      setNote(transaction?.note);
      if (transaction?.date) {
        setDate(moment(transaction?.date));
      }
      setSplitWith(transaction?.splitWith);
      setTips(transaction?.tips);
    }
  }, [transaction]);

  const stageProps = {
    style: slideOutStyle,
    submitLabel: 'Create',
    onSubmitStage: onSubmitTransaction,
    onCancel,
  };

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      transparent
      onRequestClose={props.onRequestClose}
    >
      <DismissKeyboard>
        <View style={styles.wrapper}>
          <AmountStage
            rememberCheckboxVisible={rememberCheckboxVisible}
            setShouldRememberNote={setShouldRememberNote}
            onIncomeCheckboxPress={onIncomeCheckboxPress}
            onCategoryChange={onCategoryChange}
            userCategories={userCategories}
            categories={props.categories}
            onDateChange={onDateChange}
            setSplitWith={setSplitWith}
            onNoteChange={onNoteChange}
            onChange={onAmountChange}
            stageProps={stageProps}
            friends={props.friends}
            splitWith={splitWith}
            isIncome={isIncome}
            notes={props.notes}
            category={category}
            setTips={setTips}
            amount={amount}
            date={date}
            tips={tips}
            note={note}
          />
        </View>
      </DismissKeyboard>
    </Modal>
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
