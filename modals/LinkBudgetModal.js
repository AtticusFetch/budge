import { useCallback, useState } from 'react';
import { Modal, SafeAreaView, StyleSheet } from 'react-native';

import { CategoriesList } from '../components/CategoriesList';
import { ColorButton } from '../components/ColorButton';
import { DismissKeyboard } from '../components/DismissKeyboard';
import { LabeledCheckbox } from '../components/LabeledCheckbox';

const LINK_MODES = {
  TRANSACTION: 'TRANSACTION',
  CATEGORY: 'CATEGORY',
  MERCHANT: 'MERCHANT',
  CATEGORY_MERCHANT: 'CATEGORY_MERCHANT',
};

export const LinkBudgetModal = (props) => {
  const { budget, transaction } = props;
  const [linkMode, setLinkMode] = useState(LINK_MODES.TRANSACTION);
  const [selectedBudget, setSelectedBudget] = useState();

  const onTransactionModePress = useCallback(() => {
    setLinkMode(LINK_MODES.TRANSACTION);
  }, []);
  const onCategoryModePress = useCallback(() => {
    setLinkMode(LINK_MODES.CATEGORY);
  }, []);
  const onMerchantModePress = useCallback(() => {
    setLinkMode(LINK_MODES.MERCHANT);
  }, []);
  const onCategoryMerchantModePress = useCallback(() => {
    setLinkMode(LINK_MODES.CATEGORY_MERCHANT);
  }, []);

  const onSubmit = useCallback(() => {
    const linkData = {
      budgetId: selectedBudget.id,
    };
    switch (linkMode) {
      case LINK_MODES.TRANSACTION: {
        linkData.transactionId = transaction.id;
        break;
      }
      case LINK_MODES.CATEGORY: {
        linkData.categoryId = transaction.category.id;
        break;
      }
      case LINK_MODES.MERCHANT: {
        linkData.merchantName = transaction.name;
        break;
      }
      case LINK_MODES.CATEGORY_MERCHANT: {
        linkData.merchantName = transaction.name;
        linkData.categoryId = transaction.category.id;
        break;
      }
    }
    props.onSubmit(linkData);
  }, [linkMode, selectedBudget, transaction]);

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      style={styles.modal}
      onRequestClose={props.onRequestClose}
    >
      <DismissKeyboard>
        <SafeAreaView style={styles.wrapper}>
          <CategoriesList
            categories={budget}
            onSelectedCategoryChange={setSelectedBudget}
            columns={2}
          />
          <LabeledCheckbox
            style={styles.checkbox}
            isChecked={linkMode === LINK_MODES.TRANSACTION}
            label="Only this transaction"
            onPress={onTransactionModePress}
          />
          <LabeledCheckbox
            style={styles.checkbox}
            isChecked={linkMode === LINK_MODES.CATEGORY}
            label={`All ${transaction?.category?.name} transactions`}
            onPress={onCategoryModePress}
          />
          <LabeledCheckbox
            style={styles.checkbox}
            isChecked={linkMode === LINK_MODES.MERCHANT}
            label={`All ${transaction?.name} transactions`}
            onPress={onMerchantModePress}
          />
          <LabeledCheckbox
            style={styles.checkbox}
            isChecked={linkMode === LINK_MODES.CATEGORY_MERCHANT}
            label={`All ${transaction?.category?.name} and ${transaction?.name} transactions`}
            onPress={onCategoryMerchantModePress}
          />
          <ColorButton text="Link" onPress={onSubmit} />
        </SafeAreaView>
      </DismissKeyboard>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  moadl: {},
  checkbox: {
    padding: 5,
  },
});
