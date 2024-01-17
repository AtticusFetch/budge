import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { UserListItem } from '../components/UserListItem';
import { useUserContext, userActions } from '../context/User';
import { getUsers } from '../utils/plaidApi';

export default function ProfileSelect({ navigation }) {
  const { dispatch } = useUserContext();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const onUserSelect = useCallback(
    (userId) => {
      dispatch(userActions.set(users.find(({ id }) => id === userId)));
      navigation.navigate('Home');
    },
    [users],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        style={styles.list}
        renderItem={(user) => (
          <UserListItem {...user.item} onPress={onUserSelect} />
        )}
        keyExtractor={(user) => user.id}
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
