import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { StageWrapper } from '../components/ModalStageWrapper';
import { StageTextInput } from '../components/TextInput';

export default function AddFriendModal(props) {
  const { hasError, onSubmit, onClose } = props;
  const [username, setusername] = useState('');

  const onInputChange = useCallback((e) => {
    setusername(e);
  }, []);

  const onSubmitInput = useCallback(() => {
    onSubmit(username);
  }, [username]);

  const onCancel = useCallback(() => {
    onClose();
  }, []);

  return (
    <View style={styles.wrapper}>
      <StageWrapper
        submitLabel="Send Friend Request"
        onSubmitStage={onSubmitInput}
        onCancel={onCancel}
        style={styles.container}
      >
        <StageTextInput
          onChange={onInputChange}
          value={username}
          hasError={hasError}
          containerStyle={styles.inputContainer}
          autoFocus
          placeholder="Username"
          keyboardType="default"
        />
      </StageWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  inputContainer: {
    marginBottom: 30,
  },
});
