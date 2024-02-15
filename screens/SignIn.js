import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import * as Keychain from 'react-native-keychain';

import { ColorButton } from '../components/ColorButton';
import { useUserContext, userActions } from '../context/User';
import SignUpModal from '../modals/SignUp';
import { getUserSession, saveUserSession } from '../utils/asyncStorage';
import { colors } from '../utils/colors';
import { authUser, verifyUserSession } from '../utils/plaidApi';

export default function SignIn({ navigation }) {
  const { dispatch } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isSignInVisible, setisSignInVisible] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const session = await getUserSession();
      let isValidSession;
      if (session) {
        const { isValid } = await verifyUserSession(session.token);
        isValidSession = isValid;
      }
      if (isValidSession) {
        console.log('=== session is valid', session);
        const credentials = await Keychain.getGenericPassword();
        const token = await authUser(
          credentials.password,
          credentials.username,
        );
        saveUserSession({
          ...session,
          token,
        });
        dispatch(userActions.set(session));
        await navigation.navigate('Home');
      }
      setIsLoading(false);
    };
    getSession();
  }, []);

  const showSignUpModal = useCallback(() => setisSignInVisible(true), []);

  const closeSignUpModal = useCallback(() => setisSignInVisible(false), []);

  return (
    <View style={[styles.container, isLoading && styles.loadingContainer]}>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.orange} />
      ) : (
        <>
          <ColorButton
            onPress={showSignUpModal}
            text="Sign Up"
            colorName="blue"
          />
          <ColorButton text="Sign In" colorName="orange" />
        </>
      )}
      <Modal
        animationType="slide"
        visible={isSignInVisible}
        onRequestClose={() => {
          setisSignInVisible(false);
        }}
      >
        <SignUpModal onClose={closeSignUpModal} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  loadingContainer: {
    justifyContent: 'center',
  },
  list: {
    width: '100%',
    paddingHorizontal: 40,
    paddingTop: 30,
  },
});
