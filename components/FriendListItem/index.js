import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { colors } from '../../utils/colors';
import { ColorButton } from '../ColorButton';
import { ExpandableButton } from '../ExpandableButton';

export const FriendListItem = (props) => {
  const { username, id, onDeleteFriend } = props;
  const onPress = useCallback(() => {
    onDeleteFriend(id);
  }, [id]);

  return (
    <ExpandableButton
      mainContent={<Text style={[styles.text]}>{username}</Text>}
      extraContent={
        <View style={styles.buttonContainer}>
          <ColorButton
            style={styles.deleteBtnContainer}
            onPress={onPress}
            childrenWrapperStyle={styles.deleteBtn}
          >
            <Icon color={colors.red} name="trash-2" size={20} />
          </ColorButton>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  deleteBtnContainer: {
    marginVertical: 0,
    padding: 0,
    width: 50,
    height: 50,
  },
  deleteBtn: {
    padding: 0,
    margin: 0,
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.grey,
  },
});
