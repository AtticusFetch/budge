import { useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { CategoryStage } from './AddTransactionModal/Stages/Category';
import { ColorButton } from '../components/ColorButton';
import { DismissKeyboard } from '../components/DismissKeyboard';
import { FrequencyCheckboxes } from '../components/FrequencyCheckboxes';
import { Icon } from '../components/Icon';
import { LabeledCheckbox } from '../components/LabeledCheckbox';
import { SplitCheckboxes } from '../components/SplitCheckboxes';
import { StageTextInput } from '../components/TextInput';
import { colors } from '../utils/colors';
import { getFrequencyMultiplier } from '../utils/getFrequencyMultiplier';

export const AddBudgetTransactionModal = (props) => {
  const { transactionToEdit } = props;
  const [split, setSplit] = useState(transactionToEdit?.split);
  const [frequency, setFrequency] = useState(transactionToEdit?.frequency);
  const [value, setValue] = useState(transactionToEdit?.value);
  const [category, setCategory] = useState(transactionToEdit?.category);
  const [isIncome, setIsIncome] = useState(transactionToEdit?.isIncome);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const onInputChange = useCallback((e) => {
    setValue(e);
  }, []);
  const onFrequencyChange = useCallback((e) => {
    setFrequency(e);
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

  useEffect(() => {
    if (transactionToEdit) {
      setValue(transactionToEdit?.value);
      setFrequency(transactionToEdit?.frequency);
      setSplit(transactionToEdit?.split);
      setIsIncome(transactionToEdit?.isIncome);
      setCategory(transactionToEdit?.category);
    }
  }, [transactionToEdit]);

  const onSubmit = useCallback(async () => {
    const valueMultiplier = frequency ? getFrequencyMultiplier(frequency) : 1;
    const splitAmount = parseInt(split, 10) || 1;
    const sign = isIncome ? -1 : 1;
    const weeklyValue = ((value * valueMultiplier) / splitAmount) * sign;
    const data = {
      category,
      amount: weeklyValue,
      split,
      frequency,
      value,
      isIncome,
    };
    props.onSubmit(data);
    props.onClose();
    setValue();
    setFrequency();
    setSplit();
    setIsIncome(false);
    setCategory();
  }, [split, frequency, value, isIncome, category]);

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
            value={value}
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
            childrenWrapperStyle={styles.modifierBtnContent}
            onPress={onCategoryModalShow}
            style={styles.categoryBtn}
            text="Category"
          />
          {category && (
            <Icon
              style={styles.categoryIcon}
              color={colors.grey}
              name={category?.icon}
              size={30}
            />
          )}
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
  categoryBtn: {
    height: 40,
    width: '30%',
    alignSelf: 'center',
  },
  categoryIcon: {
    alignSelf: 'center',
  },
  modifierBtnContent: {
    padding: 0,
  },
});
