import { Feather } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { LayoutAnimation, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BudgetInfo } from '../components/BudgetInfo';
import { ColorButton } from '../components/ColorButton';
import { useCategoriesContext } from '../context/Categories';
import { useUserContext, userActions } from '../context/User';
import { AddBudgetTransactionModal } from '../modals/AddBudgetTransactionModal';
import { colors } from '../utils/colors';
import {
  createBudgetTransaction,
  deleteBudgetTransaction,
  updateBudgetTransaction,
} from '../utils/plaidApi';

export default function Budget(props) {
  const {
    state: { user = {} },
    dispatch,
  } = useUserContext();
  const {
    state: { categories },
  } = useCategoriesContext();
  const [transactionToEdit, setTransactionToEdit] = useState();

  const [addBudgetTransactionVisible, setAddBudgetTransactionVisible] =
    useState(false);

  const closeAddBudgetTransactionModal = useCallback(() => {
    setTransactionToEdit();
    setAddBudgetTransactionVisible(false);
  }, []);

  const showAddBudgetTransactionModal = useCallback(() => {
    setAddBudgetTransactionVisible(true);
  }, []);

  const onCreateTransaction = useCallback(async (transaction) => {
    LayoutAnimation.configureNext({
      duration: 200,
      update: { type: 'spring', springDamping: 0.4 },
      create: { type: 'easeInEaseOut', property: 'opacity' },
    });
    const data = {
      transaction,
      userId: user.id,
    };
    let updatedUser;
    if (transaction.id) {
      updatedUser = await updateBudgetTransaction(data);
    } else {
      updatedUser = await createBudgetTransaction(data);
    }
    dispatch(userActions.update(updatedUser));
  }, []);

  const onEditCustomTransaction = useCallback((transaction) => {
    setTransactionToEdit(transaction);
    showAddBudgetTransactionModal();
  }, []);

  const onTransactionPaid = useCallback((transaction) => {
    onCreateTransaction(transaction);
  }, []);

  const onDeleteTransaction = useCallback(async (transactionId) => {
    const updatedUser = await deleteBudgetTransaction({
      userId: user.id,
      transactionId,
    });
    dispatch(userActions.update(updatedUser));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {user?.budget ? (
        <BudgetInfo
          budget={user.budget}
          onDeleteTransaction={onDeleteTransaction}
          onEditCustomTransaction={onEditCustomTransaction}
          onTransactionPaid={onTransactionPaid}
        />
      ) : (
        <View style={styles.noBudgetContainer}>
          <Text style={styles.noBudgetText}>No budget setup yet.</Text>
          <Text style={styles.noBudgetText}>
            Start by adding first expense/income.
          </Text>
        </View>
      )}
      <View style={styles.addButtonWrapper}>
        <ColorButton
          style={styles.addButtonContainer}
          childrenWrapperStyle={styles.addButton}
          onPress={showAddBudgetTransactionModal}
          colorName="blue"
          type="fill"
        >
          <Feather color="white" name="plus" size={30} />
        </ColorButton>
      </View>
      <AddBudgetTransactionModal
        visible={addBudgetTransactionVisible}
        onClose={closeAddBudgetTransactionModal}
        notes={user.personalNotes}
        transactionToEdit={transactionToEdit}
        userCategories={user.categories}
        onSubmit={onCreateTransaction}
        categories={categories}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noBudgetContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-aroung',
    paddingTop: '50%',
  },
  noBudgetText: {
    textAlign: 'center',
    color: colors.grey,
    fontSize: 30,
    opacity: 0.5,
  },
  addButtonContainer: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 35,
    borderBottomLeftRadius: 35,
    shadowColor: colors.grey,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  addButtonWrapper: {
    position: 'absolute',
    bottom: 40,
    right: 0,
  },
  addButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 35,
    borderBottomLeftRadius: 35,
  },
});
