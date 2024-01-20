import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { ColorButton } from '../components/ColorButton';
import { UserListItem } from '../components/UserListItem';
import { useUserContext, userActions } from '../context/User';
import { colors } from '../utils/colors';
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
        renderItem={({ item, index }) => (
          <UserListItem {...item} index={index} onPress={onUserSelect} />
        )}
        keyExtractor={(user) => user.id}
        ListFooterComponent={
          <ColorButton>
            <Icon name="plus" size={30} color={colors.grey} />
          </ColorButton>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
    paddingHorizontal: 40,
    paddingTop: 30,
  },
});
