import { Feather } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { LayoutAnimation, Modal, StyleSheet, Text, View } from 'react-native';
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
    LayoutAnimation.configureNext({
      duration: 200,
      update: { type: 'spring', springDamping: 0.4 },
      create: { type: 'easeInEaseOut', property: 'opacity' },
    });
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
          <ColorButton
            onPress={showSetupBudgetModal}
            text="Setup Monthly Budget"
          />
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
      <View style={styles.addButtonWrapper}>
        <ColorButton
          childrenWrapperStyle={styles.addButton}
          colorName="blue"
          type="fill"
        >
          <Feather color="white" name="plus" size={30} />
        </ColorButton>
      </View>
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
  addButtonWrapper: {
    position: 'absolute',
    bottom: 40,
    right: 0,
  },
  addButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 35,
    borderBottomLeftRadius: 35,
    shadowColor: colors.grey,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
});
