import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
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
import {
  acceptRequest,
  addFriend,
  declineRequest,
  removeFriend,
} from '../utils/plaidApi';

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

  const onSubmitAddFriend = useCallback(
    async (username) => {
      setaddFriendError(null);
      const updatedUser = await addFriend(username, user);

      if (updatedUser.error) {
        setaddFriendError(updatedUser.error);
      } else {
        dispatch(userActions.update(updatedUser));
        onAddFriendClose();
      }
    },
    [user],
  );

  const onAcceptRequest = useCallback(
    async (requestId) => {
      const updatedUser = await acceptRequest(requestId, user.id);

      if (updatedUser.error) {
        setaddFriendError(updatedUser.error);
      } else {
        dispatch(userActions.update(updatedUser));
      }
    },
    [user],
  );
  const onDeclineRequest = useCallback(
    async (requestId) => {
      const updatedUser = await declineRequest(requestId, user.id);

      if (updatedUser.error) {
        setaddFriendError(updatedUser.error);
      } else {
        dispatch(userActions.update(updatedUser));
      }
    },
    [user],
  );

  const onDeleteFriend = useCallback(
    async (friendId) => {
      setIsLoading(true);
      const updatedUser = await removeFriend(friendId, user.id);
      setIsLoading(false);

      if (updatedUser.error) {
        console.error(updatedUser.error);
      } else {
        dispatch(userActions.update(updatedUser));
      }
    },
    [user],
  );

  return (
    <SafeAreaView style={styles.container}>
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
              return (
                <FriendListItem
                  onDeleteFriend={onDeleteFriend}
                  {...friend.item}
                />
              );
            }}
            keyExtractor={(friend) => friend?.id || friend?.username}
          />
          <View style={styles.addButtonWrapper}>
            <ColorButton
              childrenWrapperStyle={styles.addButton}
              colorName="blue"
              type="fill"
              onPress={onAddFriendPress}
            >
              <Icon color="white" name="plus" size={30} />
            </ColorButton>
          </View>
          <View style={styles.requestsButtonWrapper}>
            <ColorButton
              childrenWrapperStyle={styles.requestsButton}
              colorName="grey"
              type="fill"
              onPress={onViewRequestsPress}
            >
              <Icon color={colors.red} name="user-plus" size={30} />
              {!!user.friendRequests?.length && (
                <View style={styles.requestsNotification}>
                  <Text style={styles.notificationText}>
                    {user.friendRequests.length}
                  </Text>
                </View>
              )}
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
    </SafeAreaView>
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
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 35,
    borderBottomLeftRadius: 35,
    shadowColor: colors.grey,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  requestsButtonWrapper: {
    position: 'absolute',
    bottom: '18%',
    right: 0,
  },
  addButtonWrapper: {
    position: 'absolute',
    bottom: '7%',
    right: 0,
  },
  requestsButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 35,
    borderBottomLeftRadius: 35,
    shadowColor: colors.grey,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  requestsNotification: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
