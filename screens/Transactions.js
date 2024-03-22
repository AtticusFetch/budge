import _ from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
  SectionList,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { ColorButton } from '../components/ColorButton';
import { DismissKeyboard } from '../components/DismissKeyboard';
import { TransactionListItem } from '../components/TransactionListItem';
import { useCategoriesContext } from '../context/Categories';
import { useUserContext, userActions } from '../context/User';
import AddTransactionModal from '../modals/AddTransactionModal';
import { colors } from '../utils/colors';
import {
  createTransactionForUser,
  updateTransactionForUser,
  transferPlaidTransaction,
  deleteTransaction,
} from '../utils/plaidApi';
import { mapPlaidCategory } from '../utils/plaidCategoryMapper';

const transformPlaidTransaction = (plaidTransaction, categories) => {
  return {
    ...plaidTransaction,
    transformedPlaid: true,
    id: plaidTransaction.transaction_id,
    category: mapPlaidCategory(
      plaidTransaction.personal_finance_category,
      categories,
    ),
  };
};

export default function Transactions() {
  const {
    state: { user = {} },
    dispatch,
  } = useUserContext();
  const {
    state: { categories },
  } = useCategoriesContext();
  const { transactions, plaidTransactions } = user;
  const [refreshing] = useState(false);
  const [transaction, setTransaction] = useState();
  const [transactionSections, setTransactionSections] = useState([]);
  const [isAddTransactionModalVisible, setisAddTransactionModalVisible] =
    useState(false);

  const onRefresh = useCallback(() => {}, []);

  const onAddTransactionPress = useCallback(() => {
    setTransaction();
    setisAddTransactionModalVisible(true);
  }, []);

  const onAddTransactionClose = useCallback(() => {
    setisAddTransactionModalVisible(false);
  }, []);

  const onSubmitTransaction = useCallback(async (transaction) => {
    let updatedUser;
    setisAddTransactionModalVisible(false);
    if (transaction.transformedPlaid) {
      updatedUser = await transferPlaidTransaction(transaction, user.id);
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
    setTransaction(transactionData);
    setisAddTransactionModalVisible(true);
  }, []);

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
    const allTransactions = transactions?.concat(plaidTransactions || []) || [];
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
      <View style={styles.addButtonWrapper}>
        <ColorButton
          style={styles.addButtonContainer}
          childrenWrapperStyle={styles.addButton}
          colorName="blue"
          type="fill"
          onPress={onAddTransactionPress}
        >
          <Icon color="white" name="plus" size={30} />
        </ColorButton>
      </View>
      <Modal
        animationType="slide"
        visible={isAddTransactionModalVisible}
        transparent
        onRequestClose={onAddTransactionClose}
      >
        <DismissKeyboard>
          <AddTransactionModal
            categories={categories}
            userCategories={user.categories}
            onClose={onAddTransactionClose}
            onSubmit={onSubmitTransaction}
            transaction={transaction}
            friends={user.friends}
            notes={user.personalNotes}
          />
        </DismissKeyboard>
      </Modal>
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
  addButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 35,
    borderBottomLeftRadius: 35,
  },
  addButtonWrapper: {
    position: 'absolute',
    bottom: 40,
    right: 0,
  },
  section: {
    backgroundColor: colors.dimmed.blue,
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
