import { StyleSheet, Text, View } from 'react-native';

import { useTransactionsContext } from '../context/Transactions';

export default function Transactions() {
  const {
    state: { transactions },
    dispatch,
  } = useTransactionsContext();

  return (
    <View style={styles.container}>
      <Text>Transactions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
