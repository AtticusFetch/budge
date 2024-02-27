import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ColorButton } from '../components/ColorButton';
import { colors } from '../utils/colors';

export default function FriendsSplitModal(props) {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const { friends = [], onDone } = props;

  const onDoneSelecting = useCallback(() => {
    onDone(selectedFriends);
  }, [selectedFriends]);

  const onFriendPress = useCallback(
    (id) => {
      if (selectedFriends.includes(id)) {
        const indexToRemove = selectedFriends.indexOf(id);
        const updatedSelectedFriends = [...selectedFriends];
        updatedSelectedFriends.splice(indexToRemove, 1);
        setSelectedFriends(updatedSelectedFriends);
      } else {
        setSelectedFriends([...selectedFriends, id]);
      }
    },
    [selectedFriends],
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={friends}
        style={styles.list}
        renderItem={(friend) => {
          const selected = selectedFriends.includes(friend.item.id);
          return (
            <ColorButton
              colorName={selected ? 'green' : 'blue'}
              onPress={() => onFriendPress(friend.item.id)}
              text={friend.item.username}
              transparent={selected}
            />
          );
        }}
        keyExtractor={(friend) => friend?.id || friend?.username}
      />
      <Text style={styles.selectedLabel}>
        Friends Selected: {selectedFriends.length}
      </Text>
      <ColorButton text="Done" onPress={onDoneSelecting} />
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
  selectedLabel: {
    color: colors.grey,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});
