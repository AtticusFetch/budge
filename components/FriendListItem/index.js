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
            <Icon color={colors.red} name="trash-2" size={30} />
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
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  deleteBtnContainer: {
    marginVertical: 0,
    width: '15%',
    height: '80%',
    padding: 0,
  },
  deleteBtn: {
    padding: 0,
    margin: 0,
  },
});
