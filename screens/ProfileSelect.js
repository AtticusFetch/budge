import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { getUsers } from '../utils/plaidApi';
import { useUserContext, userActions } from '../context/User';
import { UserListItem } from '../components/UserListItem';

export default function ProfileSelect({ navigation }) {
  const { state, dispatch } = useUserContext();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers()
      .then(setUsers);
  }, []);

  const onUserSelect = useCallback((userId) => {
    dispatch(userActions.set(users.find(({ id }) => id === userId )));
    navigation.navigate('Home');
  }, [users]);

  return (
    <View style={styles.container}>
      <FlatList
          data={users}
          style={styles.list}
          renderItem={(user) => <UserListItem {...user.item} onPress={onUserSelect} />}
          keyExtractor={user => user.id}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
    paddingHorizontal: 40,
    paddingTop: 30,
  },
});
