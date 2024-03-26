import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import * as Keychain from 'react-native-keychain';

import { ColorButton } from '../components/ColorButton';
import { addErrorAction, useErrorsContext } from '../context/Errors';
import { useUserContext, userActions } from '../context/User';
import { saveUserSession } from '../utils/asyncStorage';
import { colors } from '../utils/colors';
import { authUser, getUserById } from '../utils/plaidApi';

export default function SignInModal(props) {
  const { onClose } = props;
  const { dispatch } = useUserContext();
  const { dispatch: dispatchError } = useErrorsContext();

  const [password, setpassword] = useState('TestPasswordLeng1!');
  const [username, setusername] = useState('Ivan');
  const [isLoading, setisLoading] = useState(false);

  const onPasswordChange = useCallback((e) => {
    setpassword(e);
  }, []);

  const onUsernameChange = useCallback((e) => {
    setusername(e);
  }, []);

  const onSubmit = useCallback(async () => {
    setisLoading(true);
    try {
      const userInfo = await authUser(password, username);
      const user = await getUserById(userInfo.id);
      saveUserSession(userInfo);
      await Keychain.setGenericPassword(username, password);
      dispatch(userActions.set(user));
      onClose({ success: true });
    } catch (e) {
      addErrorAction(dispatchError, e);
    }
    setisLoading(false);
  }, [password, username]);

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
        </View>
        <ColorButton onPress={onSubmit} text="Go" size="slim" />
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
});
