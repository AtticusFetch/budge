import { useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import * as Keychain from 'react-native-keychain';

import { ColorButton } from '../components/ColorButton';
import { addErrorAction, useErrorsContext } from '../context/Errors';
import { setLoadingAction, useLoadingContext } from '../context/Loading';
import { useUserContext, userActions } from '../context/User';
import SignInModal from '../modals/SignInModal';
import SignUpModal from '../modals/SignUpModal';
import {
  clearUserSession,
  getUserSession,
  saveUserSession,
} from '../utils/asyncStorage';
import { authUser, getUserById, verifyUserSession } from '../utils/plaidApi';

export default function SignIn({ navigation, route }) {
  const { dispatch: dispatchUser } = useUserContext();
  const { dispatch: dispatchError } = useErrorsContext();
  const { dispatch } = useLoadingContext();
  const [isSignUpVisible, setisSignUpVisible] = useState(false);
  const [isSignInVisible, setisSignInVisible] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoadingAction(dispatch, true);
        const session = await getUserSession();
        let isValidSession;
        if (session) {
          const { isValid } = await verifyUserSession(session.token);
          isValidSession = isValid;
        }
        if (isValidSession) {
          const credentials = await Keychain.getGenericPassword();
          const userInfo = await authUser(
            credentials.password,
            credentials.username,
          );
          const user = await getUserById(userInfo.id);
          saveUserSession({
            ...userInfo,
            ...user,
          });
          dispatchUser(userActions.set(user));
          navigation.navigate('Home');
          setLoadingAction(dispatch, false);
        } else {
          clearUserSession();
          await Keychain.resetGenericPassword();
          setLoadingAction(dispatch, false);
        }
      } catch (e) {
        console.log('e', e);
        addErrorAction(dispatchError, e);
      }
    };
    getSession();
  }, [route.params?.signedOut]);

  const showSignUpModal = useCallback(() => setisSignUpVisible(true), []);
  const closeSignUpModal = useCallback(() => setisSignUpVisible(false), []);

  const showSignInModal = useCallback(() => setisSignInVisible(true), []);
  const closeSignInModal = useCallback(async ({ success }) => {
    if (success) {
      await navigation.navigate('Home');
    }
    setisSignInVisible(false);
  }, []);

  return (
    <View style={[styles.container]}>
      <ColorButton onPress={showSignUpModal} text="Sign Up" colorName="blue" />
      <ColorButton
        onPress={showSignInModal}
        text="Sign In"
        colorName="orange"
      />
      <Modal
        animationType="slide"
        visible={isSignUpVisible}
        onRequestClose={() => {
          setisSignUpVisible(false);
        }}
      >
        <SignUpModal onClose={closeSignUpModal} navigation={navigation} />
      </Modal>
      <Modal
        animationType="slide"
        visible={isSignInVisible}
        onRequestClose={() => {
          setisSignInVisible(false);
        }}
      >
        <SignInModal onClose={closeSignInModal} />
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
