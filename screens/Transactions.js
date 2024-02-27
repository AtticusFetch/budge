import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { ColorButton } from '../components/ColorButton';
import { TransactionListItem } from '../components/TransactionListItem';
import { categoriesActions, useCategoriesContext } from '../context/Categories';
import { useUserContext, userActions } from '../context/User';
import AddTransactionModal from '../modals/AddTransactionModal';
import { colors } from '../utils/colors';
import { createTransactionForUser, getCategories } from '../utils/plaidApi';

export default function Transactions() {
  const {
    state: { user = {} },
    dispatch,
  } = useUserContext();
  const {
    state: { categories },
    dispatch: dispatchCategoriesAction,
  } = useCategoriesContext();
  const { transactions = [] } = user;
  const [refreshing, setRefreshing] = useState(false);
  const [isAddTransactionModalVisible, setisAddTransactionModalVisible] =
    useState(false);

  useEffect(() => {
    getCategories().then((categories) => {
      dispatchCategoriesAction(categoriesActions.set(categories));
    });
  }, []);

  const onRefresh = useCallback(() => {}, []);

  const onAddTransactionPress = useCallback(() => {
    setisAddTransactionModalVisible(true);
  }, []);

  const onAddTransactionClose = useCallback(() => {
    setisAddTransactionModalVisible(false);
  }, []);

  const onSubmitTransaction = useCallback(async (transaction) => {
    setisAddTransactionModalVisible(false);
    const updatedUser = await createTransactionForUser(transaction, user.id);
    dispatch(userActions.update(updatedUser));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions.sort((a, b) =>
          moment(a.date).isBefore(moment(b.date)) ? 1 : -1,
        )}
        style={styles.list}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={(transaction, index) => {
          return <TransactionListItem {...transaction.item} />;
        }}
        keyExtractor={(transaction) => transaction?.id || transaction?.amount}
      />
      <View style={styles.addButton}>
        <ColorButton colorName="blue" onPress={onAddTransactionPress}>
          <Icon color={colors.blue} name="plus" size={30} />
        </ColorButton>
      </View>
      <Modal
        animationType="slide"
        visible={isAddTransactionModalVisible}
        style={styles.modal}
        transparent
        onRequestClose={onAddTransactionClose}
      >
        <AddTransactionModal
          categories={categories}
          onClose={onAddTransactionClose}
          onSubmit={onSubmitTransaction}
          friends={user.friends}
          notes={user.personalNotes}
        />
      </Modal>
    </View>
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
    width: '70%',
    paddingHorizontal: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: '7%',
    right: '10%',
  },
});
