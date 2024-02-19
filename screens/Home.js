import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { PlaidLink } from './../components/PlaidLink';
import { useUserContext } from './../context/User';
import { createLinkToken, getCategories } from './../utils/plaidApi';
import { ColorButton } from '../components/ColorButton';
import { categoriesActions, useCategoriesContext } from '../context/Categories';
import { colors } from '../utils/colors';

export default function Home(props) {
  const {
    state: { user },
  } = useUserContext();
  const { dispatch } = useCategoriesContext();
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   createLinkToken()
  //     .then((data) => {
  //       setLinkToken(data.link_token);
  //       setIsLoading(false);
  //     })
  //     .catch(() => {
  //       setIsLoading(false);
  //     });
  // }, []);

  const showTransactions = useCallback(async () => {
    setIsLoading(true);
    const categories = await getCategories();
    dispatch(categoriesActions.set(categories));
    props.navigation.navigate('Transactions');
    setIsLoading(false);
  }, [user, linkToken]);

  const showBudget = useCallback(() => {
    props.navigation.navigate('Budget');
  }, [user, linkToken]);

  const showOverview = useCallback(() => {
    props.navigation.navigate('Overview');
  }, [user, linkToken]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.orange} />
      ) : (
        <View style={styles.buttonsWrapper}>
          <ColorButton onPress={showBudget} text="Budget" />
          <ColorButton onPress={showTransactions} text="Transactions" />
          <ColorButton onPress={showOverview} text="Overview" />
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
