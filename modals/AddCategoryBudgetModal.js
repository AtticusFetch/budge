import numbro from 'numbro';
import { useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { CategoryStage } from './AddTransactionModal/Stages/Category';
import { ColorButton } from '../components/ColorButton';
import { DismissKeyboard } from '../components/DismissKeyboard';
import { FrequencyCheckboxes } from '../components/FrequencyCheckboxes';
import { Icon } from '../components/Icon';
import { StageWrapper } from '../components/ModalStageWrapper';
import { StageTextInput } from '../components/TextInput';
import { useUserContext, userActions } from '../context/User';
import { colors } from '../utils/colors';
import {
  FREQUENCY_TYPES,
  getFrequencyMultiplier,
} from '../utils/getFrequencyMultiplier';
import { globalStyles } from '../utils/globalStyles';
import { createCategoryBudget, updateCategoryBudget } from '../utils/plaidApi';

export const AddCategoryBudgetModal = (props) => {
  const { visible, onRequestClose, categories, selectedCategory } = props;
  const {
    state: { user = {} },
    dispatch,
  } = useUserContext();
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState();
  const [frequency, setFrequency] = useState();

  const onCategoryModalClose = useCallback(() => {
    setIsCategoryModalVisible(false);
  }, []);

  const onCategoryModalShow = useCallback(() => {
    setIsCategoryModalVisible(true);
  }, []);

  const onCategoryChange = useCallback((e) => {
    setCategory(e);
    onCategoryModalClose();
  }, []);

  const onFrequencyChange = useCallback((e) => {
    setFrequency(e);
  }, []);

  const onCancel = useCallback(() => {
    onRequestClose();
    reset();
  }, []);

  const reset = useCallback(() => {
    setAmount();
    setCategory();
    setFrequency();
  });

  useEffect(() => {
    if (selectedCategory) {
      let finalAmount = selectedCategory.amount;
      if (selectedCategory.frequency !== FREQUENCY_TYPES.weekly) {
        const multiplier = getFrequencyMultiplier(selectedCategory.frequency);
        finalAmount = parseFloat(selectedCategory.amount) / multiplier;
      }
      setAmount(`${finalAmount}`);
      setCategory(selectedCategory.category);
      setFrequency(selectedCategory.frequency);
    }
  }, [selectedCategory]);

  const onSubmmit = useCallback(async () => {
    let finalAmount = amount;
    if (frequency !== FREQUENCY_TYPES.weekly) {
      const multiplier = getFrequencyMultiplier(frequency);
      finalAmount = parseFloat(amount) * multiplier;
    }
    const budgetData = {
      amount: finalAmount,
      frequency,
      category,
      id: selectedCategory?.id,
    };

    const payload = {
      categoryBudget: budgetData,
      userId: user.id,
    };

    let updatedUser;
    if (selectedCategory?.id) {
      updatedUser = await updateCategoryBudget(payload);
    } else {
      updatedUser = await createCategoryBudget(payload);
    }
    if (updatedUser.error) {
      console.error(updatedUser.error);
      return;
    }
    dispatch(userActions.update(updatedUser));
    onRequestClose();
    reset();
  }, [amount, frequency, category]);

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={onRequestClose}
    >
      <DismissKeyboard>
        <StageWrapper
          submitLabel="Create"
          onSubmitStage={onSubmmit}
          onCancel={onCancel}
          contentWrapperStyle={styles.contentWrapperStyle}
        >
          <StageTextInput
            onChange={setAmount}
            value={amount}
            containerStyle={{ flex: 0 }}
            placeholder={numbro(0).formatCurrency({ mantissa: 2 })}
            autoFocus
            keyboardType="numeric"
            enterKeyHint="next"
            returnKeyType="next"
          />
          <View style={[globalStyles.row, styles.btnRow]}>
            <ColorButton
              colorName="yellow"
              childrenWrapperStyle={styles.categoryBtnContent}
              onPress={onCategoryModalShow}
              style={[styles.modifierBtn, styles.categoryBtn]}
            >
              <Icon
                size={15}
                style={styles.categoryIcon}
                name={category?.icon}
              />
              <Text style={styles.categoryName}>
                {category?.name || 'Choose Category'}
              </Text>
            </ColorButton>
          </View>
          <FrequencyCheckboxes
            savedFrequency={
              selectedCategory?.frequency || FREQUENCY_TYPES.monthly
            }
            required
            onChange={onFrequencyChange}
          />
          <Modal
            animationType="slide"
            visible={isCategoryModalVisible}
            transparent
            onRequestClose={onCategoryModalClose}
          >
            <CategoryStage
              onChange={onCategoryChange}
              userCategories={user.categories}
              categories={categories}
              category={category}
            />
          </Modal>
        </StageWrapper>
      </DismissKeyboard>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentWrapperStyle: {
    flex: 0.55,
  },
  modifierBtn: {
    height: 40,
    width: '30%',
    marginHorizontal: 20,
  },
  categoryBtn: {
    flex: 1,
  },
  categoryIcon: {
    marginRight: 10,
  },
  categoryName: {
    fontSize: 15,
  },
  btnRow: {
    justifyContent: 'center',
  },
  categoryBtnContent: {
    borderWidth: 0,
    padding: 0,
    backgroundColor: colors.seeThrough.grey,
  },
});
