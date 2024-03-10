import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import * as Keychain from 'react-native-keychain';

import { ColorButton } from '../components/ColorButton';
import { useUserContext, userActions } from '../context/User';
import { saveUserSession } from '../utils/asyncStorage';
import { colors } from '../utils/colors';
import {
  signUpUser,
  confirmUser,
  authUser,
  createUser,
} from '../utils/plaidApi';

export default function SignUpModal(props) {
  const { onClose, navigation } = props;
  const { dispatch } = useUserContext();

  const [email, setemail] = useState('ivaniankovskyi@gmail.com');
  const [password, setpassword] = useState('TestPasswordLeng1!');
  const [username, setusername] = useState('Username1');
  const [code, setcode] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isConfirmation, setisConfirmation] = useState(false);

  const onCodeChange = useCallback((e) => {
    setcode(e);
  }, []);

  const onEmailChange = useCallback((e) => {
    setemail(e);
  }, []);

  const onPasswordChange = useCallback((e) => {
    setpassword(e);
  }, []);

  const onUsernameChange = useCallback((e) => {
    setusername(e);
  }, []);

  useEffect(() => {
    if (code.length === 6) {
      onConfirm();
    }
  }, [code]);

  const onSubmit = useCallback(async () => {
    setisLoading(true);
    try {
      await signUpUser(email, password, username);
    } catch (e) {
      console.error(e);
    }
    setisLoading(false);
    setisConfirmation(true);
  }, [email, password, username]);

  const onConfirm = useCallback(async () => {
    setisLoading(true);
    try {
      await confirmUser(username, code);
      const userInfo = await authUser(password, username);
      await createUser(userInfo.username, userInfo.id);
      saveUserSession(userInfo);
      await Keychain.setGenericPassword(username, password);
      dispatch(userActions.set(userInfo));
      setisLoading(false);
      onClose();
      navigation.navigate('Home');
    } catch (e) {
      console.error(e);
      setisLoading(false);
    }
  }, [code, username, code, password]);

  return (
    <View style={styles.centeredView}>
      {isLoading && <View style={styles.overlay} />}
      <View style={styles.modalView}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={username}
            disabled={isLoading}
            onChangeText={onUsernameChange}
            placeholder="Username"
            enablesReturnKeyAutomatically
            textAlign="center"
            inputMode="text"
            autoComplete="username"
            autoCapitalize="none"
            selectionColor={colors.orange}
          />
          <TextInput
            style={styles.input}
            value={email}
            disabled={isLoading}
            onChangeText={onEmailChange}
            placeholder="Email"
            enablesReturnKeyAutomatically
            textAlign="center"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            selectionColor={colors.orange}
          />
          <TextInput
            style={styles.input}
            disabled={isLoading}
            onChangeText={onPasswordChange}
            placeholder="Password"
            value={password}
            enablesReturnKeyAutomatically
            textAlign="center"
            autoComplete="password"
            textContentType="password"
            autoCapitalize="none"
            selectionColor={colors.orange}
            secureTextEntry
          />
          {isConfirmation && (
            <TextInput
              style={styles.input}
              onChangeText={onCodeChange}
              placeholder="Confirmation Code"
              enablesReturnKeyAutomatically
              textAlign="center"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoCapitalize="none"
              selectionColor={colors.orange}
            />
          )}
        </View>
        {isConfirmation ? (
          <ColorButton
            onPress={onConfirm}
            text="Confirm"
            size="slim"
            colorName="blue"
          />
        ) : (
          <ColorButton onPress={onSubmit} text="Go" size="slim" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
  },
  input: {
    height: 60,
    padding: 10,
    width: '100%',
    fontSize: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'grey',
    opacity: 0.5,
    zIndex: 99999,
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    flex: 1,
    width: '100%',
    padding: 40,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: colors.grey,
  },
});
