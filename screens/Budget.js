import { useCallback, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BudgetInfo } from '../components/BudgetInfo';
import { ColorButton } from '../components/ColorButton';
import { DismissKeyboard } from '../components/DismissKeyboard';
import { useUserContext, userActions } from '../context/User';
import { SetupBudgetModal } from '../modals/SetupBudgetModal';
import { colors } from '../utils/colors';
import { updateUserBudget } from '../utils/plaidApi';

export default function Budget(props) {
  const {
    state: { user = {} },
    dispatch,
  } = useUserContext();
  const [isSetupBudgetModalVisible, setIsSetupBudgetModalVisible] =
    useState(false);

  const closeSetupBudgetModal = useCallback(() => {
    setIsSetupBudgetModalVisible(false);
  }, []);

  const showSetupBudgetModal = useCallback(() => {
    setIsSetupBudgetModalVisible(true);
  }, []);

  const onSubmitBudget = useCallback(async (budgetData) => {
    const updatedUser = await updateUserBudget({
      userId: user.id,
      budget: budgetData,
    });
    dispatch(userActions.update(updatedUser));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {user.budget ? (
        <BudgetInfo budget={user.budget} />
      ) : (
        <View style={styles.noBudgetContainer}>
          <Text style={styles.noBudgetText}>No budget setup yet</Text>
          <ColorButton onPress={showSetupBudgetModal} text="Setup Budget" />
        </View>
      )}
      <Modal
        animationType="slide"
        visible={isSetupBudgetModalVisible}
        style={styles.modal}
        transparent
        onRequestClose={closeSetupBudgetModal}
      >
        <DismissKeyboard>
          <SetupBudgetModal
            onClose={closeSetupBudgetModal}
            onSubmit={onSubmitBudget}
          />
        </DismissKeyboard>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noBudgetContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: '50%',
  },
  noBudgetText: {
    textAlign: 'center',
    color: colors.grey,
    fontSize: 30,
    opacity: 0.5,
  },
});
