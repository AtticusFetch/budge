import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { createLinkToken, getTransactions, updateUser } from './../utils/plaidApi';
import { useUserContext } from './../context/User';
import { PlaidLinkWrapper } from './../components/PlaidLink';
import { useTransactionsContext } from '../context/Transactions';

export default function Transactions() {
  const { state: { transactions }, dispatch } = useTransactionsContext();

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
