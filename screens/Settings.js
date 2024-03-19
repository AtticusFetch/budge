import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ColorButton } from '../components/ColorButton';
import { PlaidItem } from '../components/PlaidItem';
import { PlaidLink } from '../components/PlaidLink';
import { useUserContext, userActions } from '../context/User';
import { clearUserSession } from '../utils/asyncStorage';
import { colors } from '../utils/colors';
import { getPlaidTransactionUpdates, signOutUser } from '../utils/plaidApi';

export default function Settings(props) {
  const {
    state: { user },
    dispatch: dispatchUserAction,
  } = useUserContext();
  const [isLoading] = useState(false);

  const signOut = useCallback(async () => {
    await signOutUser(user.username);
    dispatchUserAction(userActions.set());
    clearUserSession();
    props.navigation.navigate('Sign In', { signedOut: true });
  }, [user]);

  const onLinkSuccess = useCallback((updatedUser) => {
    dispatchUserAction(userActions.update(updatedUser));
  }, []);

  const fetchTransactions = useCallback(async () => {
    const updatedUser = await getPlaidTransactionUpdates(user.id);
    dispatchUserAction(userActions.update(updatedUser));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.orange} />
        ) : (
          <View style={styles.content}>
            <View style={styles.buttonsContainer}>
              <Text style={styles.name}>{user?.username}</Text>
              <ColorButton
                colorName="green"
                onPress={signOut}
                text="Sign Out"
              />
              <ColorButton
                colorName="green"
                onPress={fetchTransactions}
                text="Pull Transactions"
              />
              <PlaidLink onLinkSuccess={onLinkSuccess} user={user} />
            </View>
            {!!user.plaidItems?.length && (
              <View style={styles.items}>
                <Text style={styles.accountsHeader}>Linked Accounts:</Text>
                {user.plaidItems.map((p) => (
                  <PlaidItem key={p.itemId} item={p} />
                ))}
              </View>
            )}
          </View>
        )}
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 40,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountsHeader: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 15,
    marginTop: 25,
  },
  items: {
    width: '100%',
  },
  name: {
    fontSize: 40,
    fontWeight: '600',
  },
});
