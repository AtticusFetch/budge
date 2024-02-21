import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { ColorButton } from '../components/ColorButton';
import { FriendListItem } from '../components/FriendListItem';
import { useUserContext, userActions } from '../context/User';
import AddFriendModal from '../modals/AddFriendModal';
import FriendRequestsModal from '../modals/FriendRequestsModal';
import { colors } from '../utils/colors';
import { acceptRequest, addFriend, declineRequest } from '../utils/plaidApi';

export default function Home(props) {
  const {
    state: { user },
    dispatch,
  } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setrefreshing] = useState(false);
  const [addFriendError, setaddFriendError] = useState(null);
  const [isAddTransactionModalVisible, setisAddTransactionModalVisible] =
    useState(false);
  const [isRequestsModalVisible, setIsRequestsModalVisible] = useState(false);

  const onRefresh = useCallback(() => {
    // setrefreshing(true);
  }, [user]);

  const onAddFriendPress = useCallback(() => {
    setisAddTransactionModalVisible(true);
  }, [user]);
  const onAddFriendClose = useCallback(() => {
    setisAddTransactionModalVisible(false);
  }, []);

  const onViewRequestsPress = useCallback(() => {
    setIsRequestsModalVisible(true);
  }, [user]);
  const onViewRequestsClose = useCallback(() => {
    setIsRequestsModalVisible(false);
  }, [user]);

  const onSubmitAddFriend = useCallback(async (username) => {
    setaddFriendError(null);
    const updatedUser = await addFriend(username, user);

    if (updatedUser.error) {
      setaddFriendError(updatedUser.error);
    } else {
      dispatch(userActions.set(updatedUser));
      onAddFriendClose();
    }
  }, []);

  const onAcceptRequest = useCallback(async (requestId) => {
    const updatedUser = await acceptRequest(requestId, user.id);

    if (updatedUser.error) {
      setaddFriendError(updatedUser.error);
    } else {
      dispatch(userActions.set(updatedUser));
    }
  }, []);
  const onDeclineRequest = useCallback(async (requestId) => {
    const updatedUser = await declineRequest(requestId, user.id);

    if (updatedUser.error) {
      setaddFriendError(updatedUser.error);
    } else {
      dispatch(userActions.set(updatedUser));
    }
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.orange} />
      ) : (
        <>
          <FlatList
            data={user.friends}
            style={styles.list}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={(friend) => {
              return <FriendListItem {...friend.item} />;
            }}
            keyExtractor={(friend) => friend?.id || friend?.username}
          />
          <View style={styles.addButton}>
            <ColorButton colorName="blue" onPress={onAddFriendPress}>
              <Icon color={colors.blue} name="plus" size={30} />
            </ColorButton>
          </View>
          <View style={styles.requestsButton}>
            <ColorButton colorName="grey" onPress={onViewRequestsPress}>
              <Icon color={colors.red} name="user-plus" size={30} />
            </ColorButton>
          </View>
        </>
      )}
      <Modal
        animationType="slide"
        visible={isAddTransactionModalVisible}
        style={styles.modal}
        transparent
        onRequestClose={onAddFriendClose}
      >
        <AddFriendModal
          onClose={onAddFriendClose}
          onSubmit={onSubmitAddFriend}
          hasError={addFriendError}
        />
      </Modal>
      <Modal
        animationType="slide"
        visible={isRequestsModalVisible}
        style={styles.modal}
        transparent
        onRequestClose={onViewRequestsClose}
      >
        <FriendRequestsModal
          requests={user.friendRequests}
          onClose={onViewRequestsClose}
          onAcceptRequest={onAcceptRequest}
          onDeclineRequest={onDeclineRequest}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  list: {
    maxHeight: '80%',
  },
  addButton: {
    position: 'absolute',
    bottom: '7%',
    right: '10%',
  },
  requestsButton: {
    position: 'absolute',
    bottom: '7%',
    left: '10%',
  },
});
