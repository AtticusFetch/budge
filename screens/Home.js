import { StatusBar } from 'expo-status-bar';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { createLinkToken, getTransactions, updateUser } from './../utils/plaidApi';
import { useUserContext } from './../context/User';
import { PlaidLink } from './../components/PlaidLink';
import { ColorButton } from '../components/ColorButton';

export default function Home(props) {
  const { state: { user }, dispatch } = useUserContext();
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    createLinkToken()
      .then(data => {
        setLinkToken(data.link_token);
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
      });
  }, []);

  const showTransactions = useCallback(
    () => {
      props.navigation.navigate('Transactions');
    },
    [user, linkToken],
  )
  

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="orange" />
      ) : (
        <View style={styles.buttonsWrapper}>
          <ColorButton onPress={showTransactions} inverted={true} text="Transactions" />
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
  },
  buttonsWrapper: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
