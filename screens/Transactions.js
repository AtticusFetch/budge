import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TransactionListItem } from '../components/TransactionListItem';
import {
  transactionsActions,
  useTransactionsContext,
} from '../context/Transactions';
import { useUserContext } from '../context/User';
import { getTransactionUpdates, getTransactions } from '../utils/plaidApi';

export default function Transactions() {
  const {
    state: { transactions },
    dispatch,
  } = useTransactionsContext();
  const {
    state: { user },
  } = useUserContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTransactionUpdates(user.id)
      .then((data) => {
        if (data.added?.length) {
          dispatch(transactionsActions.addBulk(data.added));
        }
        setRefreshing(false);
      })
      .catch((e) => {
        console.error(e);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    if (transactions.length) {
      return;
    }
    getTransactions(user.id)
      .then((data) => {
        if (data) {
          dispatch(transactionsActions.addBulk(data));
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [user.id]);

  if (!user.accessToken) {
    return null;
  }

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
        keyExtractor={(transaction) => transaction.transaction_id}
      />
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
