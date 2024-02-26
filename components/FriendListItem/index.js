import { StyleSheet, Text } from 'react-native';

import { ExpandableButton } from '../ExpandableButton';

export const FriendListItem = (props) => {
  const { username } = props;

  return (
    <ExpandableButton
      mainContent={<Text style={[styles.text]}>{username}</Text>}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 20,
  },
});
