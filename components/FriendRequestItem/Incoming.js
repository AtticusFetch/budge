import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { colors } from '../../utils/colors';
import { ColorButton } from '../ColorButton';

export const Incoming = (props) => {
  const { user, requestId, onAcceptRequest, onDeclineRequest } = props;

  const onAccept = useCallback(() => {
    onAcceptRequest(requestId);
  }, [user]);
  const onDecline = useCallback(() => {
    onDeclineRequest(requestId);
  }, [user]);

  return (
    <View style={styles.container}>
      <Text>From: {user.username}</Text>
      <ColorButton
        childrenWrapperStyle={styles.buttonContent}
        colorName="green"
        onPress={onAccept}
        transparent
        style={styles.button}
      >
        <Icon name="check" color={colors.green} size={30} />
      </ColorButton>
      <ColorButton
        childrenWrapperStyle={styles.buttonContent}
        transparent
        onPress={onDecline}
        colorName="red"
        style={styles.button}
      >
        <Icon name="x" color={colors.red} size={30} />
      </ColorButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flex: 0.4,
    maxHeight: '80%',
    marginVertical: 0,
  },
  buttonContent: {
    padding: 0,
  },
});
