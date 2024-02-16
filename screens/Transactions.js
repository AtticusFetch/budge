import { useCallback, useState } from 'react';
import { FlatList, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import { ColorButton } from '../components/ColorButton';
import { TransactionListItem } from '../components/TransactionListItem';
import { useUserContext, userActions } from '../context/User';
import AddTransactionModal from '../modals/AddTransactionModal';
import { createTransactionForUser } from '../utils/plaidApi';

export default function Transactions() {
  const {
    state: { user },
    dispatch,
  } = useUserContext();
  const { transactions } = user;
  const [refreshing, setRefreshing] = useState(false);
  const [isAddTransactionModalVisible, setisAddTransactionModalVisible] =
    useState(false);

  const onRefresh = useCallback(() => {}, []);

  const onAddTransactionPress = useCallback(() => {
    setisAddTransactionModalVisible(true);
  }, []);

  const onAddTransactionClose = useCallback(() => {
    setisAddTransactionModalVisible(false);
  }, []);

  const onSubmitTransaction = useCallback(async (transaction) => {
    const updatedUser = await createTransactionForUser(transaction, user.id);
    dispatch(userActions.set(updatedUser));
    setisAddTransactionModalVisible(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={transactions}
        style={styles.list}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={(transaction) => {
          return <TransactionListItem {...transaction.item} />;
        }}
        keyExtractor={(transaction) => transaction?.id || transaction?.amount}
        ListHeaderComponent={
          <ColorButton onPress={onAddTransactionPress}>
            <Icon name="plus" size={30} />
          </ColorButton>
        }
      />
      <Modal
        animationType="slide"
        visible={isAddTransactionModalVisible}
        style={styles.modal}
        transparent
        onRequestClose={onAddTransactionClose}
      >
        <AddTransactionModal onSubmit={onSubmitTransaction} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  list: {
    width: '100%',
    paddingHorizontal: 40,
  },
});
