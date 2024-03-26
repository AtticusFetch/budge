import _, { concat, intersectionWith, omit, without } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  SectionList,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { ColorButton } from '../components/ColorButton';
import { TransactionListItem } from '../components/TransactionListItem';
import { useCategoriesContext } from '../context/Categories';
import { setLoadingAction, useLoadingContext } from '../context/Loading';
import { useUserContext, userActions } from '../context/User';
import AddTransactionModal from '../modals/AddTransactionModal';
import { ChangeCategoryModal } from '../modals/ChangeCategoryModal';
import { LinkBudgetModal } from '../modals/LinkBudgetModal';
import { animateLayout } from '../utils/animations';
import { colors } from '../utils/colors';
import {
  createTransactionForUser,
  updateTransactionForUser,
  transferPlaidTransaction,
  changeCategory,
  deleteTransaction,
  createBudgetLink,
} from '../utils/plaidApi';
import { mapPlaidCategory } from '../utils/plaidCategoryMapper';

const transformPlaidTransaction = (plaidTransaction, categories) => {
  return {
    ...plaidTransaction,
    isTransfering: true,
    id: plaidTransaction.transaction_id,
    category: mapPlaidCategory(
      plaidTransaction.personal_finance_category,
      categories,
    ),
  };
};

const createPlaidTransformFunction = (categories) => (plaidTransaction) =>
  transformPlaidTransaction(plaidTransaction, categories);

export default function Transactions() {
  const {
    state: { user = {} },
    dispatch,
  } = useUserContext();
  const {
    state: { categories },
  } = useCategoriesContext();
  const { dispatch: dispatchLoadingState } = useLoadingContext();
  const { transactions, plaidTransactions, manualLinks, budget } = user;
  const [refreshing] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [transactionToEdit, setTransactionToEdit] = useState();
  const [transactionToMap, setTransactionToMap] = useState();
  const [transactionSections, setTransactionSections] = useState([]);
  const [isAddTransactionModalVisible, setisAddTransactionModalVisible] =
    useState(false);
  const [isLinkBudgetModalVisible, setIsLinkBudgetModalVisible] =
    useState(false);
  const [isChangeCategoryModalVisible, setIsChangeCategoryModalVisible] =
    useState(false);

  const onRefresh = useCallback(() => {}, []);

  const onAddTransactionPress = useCallback(() => {
    setTransactionToEdit();
    setisAddTransactionModalVisible(true);
  }, []);

  const onTransferPress = useCallback(() => {
    animateLayout();
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedTransactions([]);
    }
  }, [selectionMode]);

  const onAddTransactionClose = useCallback(() => {
    setisAddTransactionModalVisible(false);
  }, []);

  const onMapCategoryClose = useCallback(() => {
    setIsLinkBudgetModalVisible(false);
  }, []);

  const onChangeCategoryClose = useCallback(() => {
    setIsChangeCategoryModalVisible(false);
  }, []);

  const onSubmitTransaction = useCallback(async (transaction) => {
    let updatedUser;
    setisAddTransactionModalVisible(false);
    if (transaction.isTransfering) {
      updatedUser = await transferPlaidTransaction(
        omit(transaction, 'isTransfering'),
        user.id,
      );
    } else if (transaction.id) {
      updatedUser = await updateTransactionForUser(transaction, user.id);
    } else {
      updatedUser = await createTransactionForUser(transaction, user.id);
    }
    dispatch(userActions.update(updatedUser));
  }, []);

  const onDeleteTransaction = useCallback(async (transactionId) => {
    const updatedUser = await deleteTransaction(transactionId, user.id);
    dispatch(userActions.update(updatedUser));
  }, []);

  const onEditTransaction = useCallback(async (transactionData) => {
    setTransactionToEdit(transactionData);
    setisAddTransactionModalVisible(true);
  }, []);

  const onTransactionSelect = useCallback(
    (transaction) => {
      const transactionId = transaction.id || transaction.transaction_id;
      if (!selectedTransactions.includes(transactionId)) {
        setSelectedTransactions([...selectedTransactions, transactionId]);
      } else {
        setSelectedTransactions(without(selectedTransactions, transactionId));
      }
    },
    [selectedTransactions],
  );

  const onLinkTransaction = useCallback(
    (transaction) => {
      setTransactionToMap(transaction);
      setIsLinkBudgetModalVisible(true);
    },
    [onSubmitTransaction],
  );

  const onChangeCategory = useCallback(
    (transaction) => {
      setTransactionToMap(transaction);
      setIsChangeCategoryModalVisible(true);
    },
    [onSubmitTransaction],
  );

  const onSubmitLinkBudget = useCallback(
    async (linkData) => {
      setIsLinkBudgetModalVisible(false);
      setLoadingAction(dispatchLoadingState, true);
      const updatedUser = await createBudgetLink({
        linkData,
        userId: user.id,
      });
      setLoadingAction(dispatchLoadingState, false);
      setTransactionToMap();
      dispatch(userActions.update(updatedUser));
    },
    [user, dispatchLoadingState],
  );

  const onSubmitChangeCaegory = useCallback(
    async (changeData) => {
      setIsChangeCategoryModalVisible(false);
      setLoadingAction(dispatchLoadingState, true);
      const updatedUser = await changeCategory({
        changeData,
        userId: user.id,
      });
      setLoadingAction(dispatchLoadingState, false);
      setTransactionToMap();
      dispatch(userActions.update(updatedUser));
    },
    [user, dispatchLoadingState],
  );

  const onTransferConfirm = useCallback(async () => {
    setLoadingAction(dispatchLoadingState, true);
    const transactionsToTransform = intersectionWith(
      plaidTransactions,
      selectedTransactions,
      (t, id) => id === t.transaction_id,
    );
    const transformFn = createPlaidTransformFunction(categories);
    const transformed = transactionsToTransform.map(transformFn);
    try {
      for (const tToTransform of transformed) {
        const updatedUser = await transferPlaidTransaction(
          tToTransform,
          user.id,
        );
        dispatch(userActions.update(updatedUser));
      }
    } catch (e) {
      console.error(e);
      setLoadingAction(dispatchLoadingState, false);
    }
    setSelectedTransactions([]);
    setLoadingAction(dispatchLoadingState, false);
  }, [selectedTransactions, plaidTransactions, categories, user]);

  const onTransferTransaction = useCallback(
    async (plaidTransaction) => {
      const transformed = transformPlaidTransaction(
        plaidTransaction,
        categories,
      );
      onEditTransaction(transformed);
    },
    [onEditTransaction, categories],
  );

  const onIgnoreTransaction = useCallback(async (plaidTransaction) => {}, []);

  useEffect(() => {
    const allTransactions = concat([], transactions, plaidTransactions).filter(
      (v) => !!v,
    );
    const sortedTransactions = _.sortBy(allTransactions, (t) =>
      new Date(t.date).getTime(),
    ).reverse();
    const groupedTransactions = _.groupBy(sortedTransactions, (t) => {
      const tDate = moment(t.date);
      const now = moment();
      if (tDate.isAfter(now)) {
        return 'Upcoming';
      }
      if (tDate.isSame(now, 'day')) {
        return 'Today';
      }
      if (tDate.isSame(now, 'isoWeek')) {
        return 'This week';
      }
      if (tDate.isoWeek() + 1 === now.isoWeek()) {
        return 'Last week';
      }
      return tDate.format('MMM YYYY');
    });
    const sections = Object.keys(groupedTransactions).map((key) => ({
      title: key,
      data: groupedTransactions[key],
    }));
    setTransactionSections(sections);
  }, [transactions, plaidTransactions]);

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={transactionSections}
        style={styles.list}
        onRefresh={onRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TransactionListItem
              {...item}
              onTransfer={onTransferTransaction}
              onIgnore={onIgnoreTransaction}
              showCheckbox={selectionMode}
              onLink={onLinkTransaction}
              onChangeCategory={onChangeCategory}
              selected={selectedTransactions.includes(
                item.id || item.transaction_id,
              )}
              budget={budget}
              manualLinks={manualLinks}
              onSelect={onTransactionSelect}
              onDelete={onDeleteTransaction}
              onEdit={onEditTransaction}
            />
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{title}</Text>
          </View>
        )}
        keyExtractor={(t) => t?.id || t?.transaction_id || t?.amount}
      />
      <View style={[styles.globalSideButtonWrapper, styles.addButtonWrapper]}>
        <ColorButton
          style={[styles.gloablButtonContainer, styles.addButtonContainer]}
          childrenWrapperStyle={[styles.globalSideButton, styles.addButton]}
          colorName="blue"
          type="fill"
          onPress={onAddTransactionPress}
        >
          <Icon color="white" name="plus" size={30} />
        </ColorButton>
      </View>
      <View
        style={[styles.globalSideButtonWrapper, styles.transferButtonWrapper]}
      >
        <ColorButton
          style={[styles.gloablButtonContainer, styles.transferButtonContainer]}
          childrenWrapperStyle={[
            styles.globalSideButton,
            styles.transferButton,
          ]}
          colorName="grey"
          type="fill"
          onPress={onTransferPress}
        >
          <Icon
            color={colors.orange}
            name={selectionMode ? 'list' : 'check-circle'}
            size={32}
          />
        </ColorButton>
      </View>
      {!!selectedTransactions?.length && (
        <View
          style={[
            styles.globalSideButtonWrapper,
            styles.selectionButtonWrapper,
          ]}
        >
          <ColorButton
            style={[
              styles.gloablButtonContainer,
              styles.selectionButtonContainer,
            ]}
            childrenWrapperStyle={[
              styles.globalSideButton,
              styles.selectionButton,
            ]}
            colorName="grey"
            type="fill"
            onPress={onTransferConfirm}
          >
            <Text style={styles.btnLabel}>
              Transfer {selectedTransactions.length} transactions
            </Text>
          </ColorButton>
        </View>
      )}
      <AddTransactionModal
        categories={categories}
        userCategories={user.categories}
        onClose={onAddTransactionClose}
        visible={isAddTransactionModalVisible}
        onRequestClose={onAddTransactionClose}
        onSubmit={onSubmitTransaction}
        transaction={transactionToEdit}
        friends={user.friends}
        notes={user.personalNotes}
      />
      <LinkBudgetModal
        visible={isLinkBudgetModalVisible}
        onRequestClose={onMapCategoryClose}
        transaction={transactionToMap}
        onSubmit={onSubmitLinkBudget}
        budget={user.budget}
      />
      <ChangeCategoryModal
        visible={isChangeCategoryModalVisible}
        onRequestClose={onChangeCategoryClose}
        transaction={transactionToMap}
        onSubmit={onSubmitChangeCaegory}
        categories={categories}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  list: {
    width: '100%',
    paddingHorizontal: 20,
  },
  btnLabel: {
    fontWeight: '600',
    color: 'white',
  },
  gloablButtonContainer: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 35,
    borderBottomLeftRadius: 35,
    shadowColor: colors.grey,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  globalSideButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 35,
    borderBottomLeftRadius: 35,
  },
  globalSideButtonWrapper: {
    position: 'absolute',
    bottom: 40,
    right: 0,
  },
  addButtonContainer: {},
  addButton: {},
  addButtonWrapper: {},
  transferButtonContainer: {},
  transferButton: {
    padding: 10,
  },
  transferButtonWrapper: {
    bottom: 120,
  },
  selectionButtonContainer: {},
  selectionButton: {},
  selectionButtonWrapper: {
    bottom: 200,
  },
  section: {
    backgroundColor: colors.blue,
    width: '50%',
    paddingVertical: 5,
    borderRadius: 15,
    borderTopLeftRadius: 0,
    borderColor: colors.blue,
    borderWidth: 1.5,
    borderBottomLeftRadius: 0,
    shadowColor: colors.grey,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  sectionLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
  },
});
