import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ColorButton } from '../components/ColorButton';
import { PlaidLink } from '../components/PlaidLink';
import { categoriesActions, useCategoriesContext } from '../context/Categories';
import { useUserContext, userActions } from '../context/User';
import { clearUserSession } from '../utils/asyncStorage';
import { colors } from '../utils/colors';
import { signOutUser, getCategories } from '../utils/plaidApi';

export default function Settings(props) {
  const {
    state: { user },
    dispatch: dispatchUserAction,
  } = useUserContext();
  const { dispatch: dispatchCategoriesAction } = useCategoriesContext();
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const showTransactions = useCallback(async () => {
    setIsLoading(true);
    const categories = await getCategories();
    dispatchCategoriesAction(categoriesActions.set(categories));
    props.navigation.navigate('Transactions');
    setIsLoading(false);
  }, [user, linkToken]);

  const showBudget = useCallback(() => {
    props.navigation.navigate('Budget');
  }, [user, linkToken]);

  const showOverview = useCallback(() => {
    props.navigation.navigate('Overview');
  }, [user, linkToken]);

  const showFriends = useCallback(() => {
    props.navigation.navigate('Friends');
  }, [user]);

  const signOut = useCallback(async () => {
    await signOutUser(user.username);
    dispatchUserAction(userActions.set());
    clearUserSession();
    props.navigation.navigate('Sign In', { signedOut: true });
  }, [user]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.orange} />
      ) : (
        <View style={styles.buttonsWrapper}>
          <ColorButton onPress={showBudget} text="Budget" />
          <ColorButton
            colorName="green"
            onPress={showTransactions}
            text="Transactions"
          />
          <ColorButton onPress={showOverview} text="Overview" />
          <ColorButton colorName="green" onPress={showFriends} text="Friends" />
          <ColorButton colorName="green" onPress={signOut} text="Sign Out" />
          <PlaidLink user={user} linkToken={linkToken} />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonsWrapper: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
