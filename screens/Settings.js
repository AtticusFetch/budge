import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ColorButton } from '../components/ColorButton';
import { PlaidLink } from '../components/PlaidLink';
import { useUserContext, userActions } from '../context/User';
import { clearUserSession } from '../utils/asyncStorage';
import { colors } from '../utils/colors';
import { signOutUser } from '../utils/plaidApi';

export default function Settings(props) {
  const {
    state: { user },
    dispatch: dispatchUserAction,
  } = useUserContext();
  const [linkToken] = useState(null);
  const [isLoading] = useState(false);

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
          <Text style={styles.name}>{user?.username}</Text>
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
  name: {
    fontSize: 40,
    fontWeight: '600',
  },
});
