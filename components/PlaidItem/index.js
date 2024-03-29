import { useCallback } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../../utils/colors';

const getSheetActions = (institution) => ({
  CANCEL: 'Cancel',
  DELETE: `Delete ${institution.name} Accounts`,
});

const DECISIONS = {
  keep: 'keep',
  delete: 'delete',
};

export const PlaidItem = (props) => {
  const { item } = props;

  const onModalCancel = useCallback(() => {}, []);
  const onModalProceed = useCallback((decision, actionIndex) => {
    const shouldDeleteTransactions = decision === DECISIONS.delete;
    if (actionIndex === 1) {
      props.onDeleteAllAccounts(item.itemId, shouldDeleteTransactions);
    }
  }, []);

  const createThreeButtonAlert = useCallback(
    (actionIndex) => {
      Alert.alert('Delete', 'Delete all related transactions?', [
        {
          text: 'Keep',
          onPress: () => onModalProceed(DECISIONS.keep, actionIndex),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onModalProceed(DECISIONS.delete, actionIndex),
        },
        {
          text: 'Cancel',
          onPress: onModalCancel,
          style: 'cancel',
        },
      ]);
    },
    [onModalProceed],
  );
  const onActionSelected = useCallback(
    (actionIndex) => {
      if (actionIndex === 0) return;
      createThreeButtonAlert(actionIndex);
    },
    [item],
  );
  const onLongPress = useCallback(() => {
    const actions = getSheetActions(item.institution);
    const options = Object.values(actions);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      onActionSelected,
    );
  }, [item, props.onLongPress]);
  return (
    <Pressable onLongPress={onLongPress} key={item.institution?.institution_id}>
      <View style={styles.container}>
        <Text style={styles.institutionName}>{item.institution?.name}</Text>
        {item.accounts?.map((account) => (
          <View key={account.account_id} style={styles.account}>
            <Text style={styles.accountName}>{account.name}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 16,
    padding: 10,
    borderColor: colors.yellow,
    backgroundColor: colors.seeThrough.yellow,
    marginVertical: 15,
  },
  institutionName: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 10,
  },
  accountName: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 10,
    color: 'white',
  },
  account: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: 8,
    marginVertical: 5,
  },
});
