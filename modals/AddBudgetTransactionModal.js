import numbro from 'numbro';
import { useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { CategoryStage } from './AddTransactionModal/Stages/Category';
import { NoteStage } from './AddTransactionModal/Stages/Note';
import { ColorButton } from '../components/ColorButton';
import { DismissKeyboard } from '../components/DismissKeyboard';
import { FrequencyCheckboxes } from '../components/FrequencyCheckboxes';
import { Icon } from '../components/Icon';
import { LabeledCheckbox } from '../components/LabeledCheckbox';
import { SplitCheckboxes } from '../components/SplitCheckboxes';
import { StageTextInput } from '../components/TextInput';
import { colors } from '../utils/colors';
import { FREQUENCY_TYPES } from '../utils/constants';
import { getFrequencyMultiplier } from '../utils/getFrequencyMultiplier';

export const AddBudgetTransactionModal = (props) => {
  const { transactionToEdit, notes } = props;
  const [split, setSplit] = useState(transactionToEdit?.split);
  const [frequency, setFrequency] = useState(transactionToEdit?.frequency);
  const [amount, setAmount] = useState(transactionToEdit?.amount);
  const [category, setCategory] = useState(transactionToEdit?.category);
  const [shouldRememberNote, setShouldRememberNote] = useState(false);
  const [isIncome, setIsIncome] = useState(transactionToEdit?.isIncome);
  const [note, setNote] = useState(transactionToEdit?.note);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const onInputChange = useCallback((e) => {
    setAmount(e);
  }, []);
  const onFrequencyChange = useCallback((e) => {
    setFrequency(e);
  }, []);
  const onNoteChange = useCallback((e) => {
    if (typeof e === 'object') {
      setNote(e.name);
    } else {
      setNote(e);
    }
  }, []);
  const onSplitChange = useCallback((e) => {
    setSplit(e);
  }, []);

  const onCancel = useCallback(() => {
    props.onClose();
  }, []);

  const onCategoryModalClose = useCallback(() => {
    setIsCategoryModalVisible(false);
  }, []);

  const onCategoryModalShow = useCallback(() => {
    setIsCategoryModalVisible(true);
  }, []);

  const onIncomeCheckboxPress = useCallback(() => {
    setIsIncome(!isIncome);
  }, [isIncome]);

  const onCategoryChange = useCallback((e) => {
    setCategory(e);
  }, []);

  const onNoteModalClose = useCallback(() => {
    setIsNoteModalVisible(false);
  }, []);

  const onNoteModalShow = useCallback(() => {
    setIsNoteModalVisible(true);
  }, []);

  useEffect(() => {
    if (transactionToEdit) {
      setAmount(`${numbro(transactionToEdit?.amount).format({ mantissa: 2 })}`);
      setFrequency(transactionToEdit?.frequency);
      setSplit(transactionToEdit?.split);
      setSplit(transactionToEdit?.note);
      setIsIncome(transactionToEdit?.isIncome);
      setCategory(transactionToEdit?.category);
    }
  }, [transactionToEdit]);

  const onSubmit = useCallback(async () => {
    const valueMultiplier = frequency ? getFrequencyMultiplier(frequency) : 1;
    const splitAmount = parseInt(split, 10) || 1;
    const sign = isIncome ? -1 : 1;
    const weeklyValue = ((amount * valueMultiplier) / splitAmount) * sign;
    const data = {
      category,
      amount: weeklyValue,
      split,
      shouldRememberNote,
      frequency: FREQUENCY_TYPES.weekly,
      note,
      isIncome,
      id: transactionToEdit?.id,
    };
    props.onSubmit(data);
    props.onClose();
    setAmount();
    setFrequency();
    setSplit();
    setIsIncome(false);
    setCategory();
  }, [
    split,
    frequency,
    amount,
    isIncome,
    category,
    note,
    shouldRememberNote,
    transactionToEdit,
  ]);

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      style={styles.modal}
      onRequestClose={props.onClose}
    >
      <DismissKeyboard style={styles.contentWrapepr}>
        <View style={styles.wrapper}>
          <StageTextInput
            onChange={onInputChange}
            value={amount}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            autoFocus
            keyboardType="numeric"
            textAlign="start"
          />
          <FrequencyCheckboxes
            savedFrequency={frequency}
            onChange={onFrequencyChange}
          />
          <SplitCheckboxes savedSplitAmount={split} onChange={onSplitChange} />
          <LabeledCheckbox
            isChecked={isIncome}
            onPress={onIncomeCheckboxPress}
            style={styles.checkbox}
            label="Is this income?"
          />
          <ColorButton
            colorName="yellow"
            childrenWrapperStyle={styles.categoryBtnContent}
            onPress={onCategoryModalShow}
            style={styles.categoryBtn}
          >
            <Icon size={25} style={styles.categoryIcon} name={category?.icon} />
            <Text style={styles.categoryName}>
              {category?.name || 'Choose Category'}
            </Text>
          </ColorButton>
          <ColorButton
            colorName="yellow"
            childrenWrapperStyle={styles.categoryBtnContent}
            onPress={onNoteModalShow}
            style={[styles.modifierBtn, styles.noteBtn]}
            text="Note"
          >
            <Text style={styles.categoryName}>{note || 'Note'}</Text>
          </ColorButton>
        </View>
        <ColorButton
          colorName="blue"
          onPress={onSubmit}
          text="Add Transaction"
        />
        <ColorButton onPress={onCancel} text="Cancel" />
      </DismissKeyboard>
      <Modal
        animationType="slide"
        visible={isCategoryModalVisible}
        transparent
        onRequestClose={onCategoryModalClose}
      >
        <CategoryStage
          stageProps={{
            onCancel: onCategoryModalClose,
            cancelLabel: 'Done',
          }}
          onChange={onCategoryChange}
          userCategories={props.userCategories}
          categories={props.categories}
          category={category}
        />
      </Modal>
      <Modal
        animationType="slide"
        visible={isNoteModalVisible}
        transparent
        onRequestClose={onNoteModalClose}
      >
        <NoteStage
          stageProps={{
            onCancel: onNoteModalClose,
            cancelLabel: 'Done',
          }}
          rememberCheckboxVisible
          setShouldRememberNote={setShouldRememberNote}
          onChange={onNoteChange}
          notes={notes}
          note={note}
        />
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'white',
  },
  categoryBtn: {
    height: 40,
  },
  categoryBtnContent: {
    borderWidth: 0,
    padding: 0,
    backgroundColor: colors.seeThrough.grey,
  },
  modifierBtnContent: {
    padding: 0,
  },
  categoryIcon: {
    marginRight: 10,
  },
  categoryName: {
    fontSize: 15,
  },
  contentWrapepr: {
    paddingBottom: '10%',
    paddingTop: '20%',
    paddingHorizontal: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 10,
    flex: 0,
  },
  input: {},
  checkbox: {
    flex: 0,
    alignSelf: 'center',
    marginTop: 20,
    borderColor: colors.yellow,
    borderWidth: 2,
  },
});
