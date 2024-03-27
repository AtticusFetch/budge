import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ColorButton } from '../components/ColorButton';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { PlaidItem } from '../components/PlaidItem';
import { PlaidLink } from '../components/PlaidLink';
import { UserLinks } from '../components/UserLinks';
import { useCategoriesContext } from '../context/Categories';
import { setLoadingAction, useLoadingContext } from '../context/Loading';
import {
  addNotificationAction,
  useNotificationsContext,
} from '../context/Notifications';
import { useUserContext, userActions } from '../context/User';
import { clearUserSession } from '../utils/asyncStorage';
import {
  getPlaidTransactionUpdates,
  deleteManualLink,
  signOutUser,
} from '../utils/plaidApi';

export default function Settings(props) {
  const {
    state: { user },
    dispatch: dispatchUserAction,
  } = useUserContext();
  const {
    state: { categories },
  } = useCategoriesContext();
  const { dispatch } = useLoadingContext();
  const { dispatch: dispatchNotification } = useNotificationsContext();
  const [linksModalVisible, setLinksModalVisible] = useState(false);

  const showLinksModal = useCallback(() => {
    setLinksModalVisible(true);
  }, []);
  const closeLinksModal = useCallback(() => {
    setLinksModalVisible(false);
  }, []);

  const signOut = useCallback(async () => {
    setLoadingAction(dispatch, true);
    await signOutUser(user.username);
    setLoadingAction(dispatch, false);
    dispatchUserAction(userActions.set({}));
    clearUserSession();
    props.navigation.navigate('Sign In', { signedOut: true });
  }, [user]);

  const onLinkSuccess = useCallback((updatedUser) => {
    dispatchUserAction(userActions.update(updatedUser));
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoadingAction(dispatch, true);
    const updatedUser = await getPlaidTransactionUpdates(user.id);
    addNotificationAction(dispatchNotification, {
      message: `New transactions: ${updatedUser?.plaidTransactions?.length}`,
    });
    setLoadingAction(dispatch, false);
    if (updatedUser?.plaidTransactions?.length) {
      dispatchUserAction(userActions.update(updatedUser));
    }
  }, []);

  const onLinkDelete = useCallback(async (linkId) => {
    setLoadingAction(dispatch, true);
    const updatedUser = await deleteManualLink({ linkId, userId: user.id });
    setLoadingAction(dispatch, false);
    dispatchUserAction(userActions.update(updatedUser));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <View style={styles.buttonsContainer}>
            <Text style={styles.name}>{user?.username}</Text>
            <ColorButton onPress={signOut} size="slim" text="Sign Out" />
            <ColorButton
              onPress={fetchTransactions}
              size="slim"
              text="Pull Transactions"
            />
            <ColorButton
              onPress={showLinksModal}
              size="slim"
              text="View Manual Mapping"
            />
            <PlaidLink onLinkSuccess={onLinkSuccess} user={user} />
          </View>
          {!!user.plaidItems?.length && (
            <View style={styles.items}>
              <Text style={styles.accountsHeader}>Linked Accounts:</Text>
              {user.plaidItems.map((p) => (
                <PlaidItem key={p.itemId} item={p} />
              ))}
            </View>
          )}
        </View>
        <Modal
          animationType="slide"
          visible={linksModalVisible}
          onRequestClose={closeLinksModal}
        >
          <SafeAreaView style={styles.linksModalContent}>
            <UserLinks
              categories={categories}
              budget={user.budget}
              onDelete={onLinkDelete}
              links={user.manualLinks}
            />
            <ColorButton
              style={styles.modalCloseBtn}
              onPress={closeLinksModal}
              size="slim"
              text="Close"
            />
            <LoadingOverlay />
          </SafeAreaView>
        </Modal>
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 40,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linksModalContent: {
    flex: 1,
  },
  modalCloseBtn: {},
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountsHeader: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 15,
    marginTop: 25,
  },
  items: {
    width: '100%',
  },
  name: {
    fontSize: 40,
    fontWeight: '600',
  },
});
