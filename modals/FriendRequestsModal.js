import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ColorButton } from '../components/ColorButton';
import { FriendRequestItem } from '../components/FriendRequestItem';

export default function FriendRequestsModal(props) {
  const { requests = [], onClose, onAcceptRequest, onDeclineRequest } = props;

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={requests}
        style={styles.list}
        renderItem={(friend) => {
          return (
            <FriendRequestItem
              {...friend.item}
              onAcceptRequest={onAcceptRequest}
              onDeclineRequest={onDeclineRequest}
            />
          );
        }}
        keyExtractor={(friend) => friend?.id || friend?.username}
      />
      <ColorButton text="Close" onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 30,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  list: {},
});
