import numbro from 'numbro';
import { useCallback, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';

import { ColorButton } from '../components/ColorButton';
import { useUserContext, userActions } from '../context/User';
import { colors } from '../utils/colors';
import { updateUserBudget } from '../utils/plaidApi';

export default function Budget({ navigation }) {
  const {
    state: { user = {} },
  } = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetInputValue, setBudgetInputValue] = useState(user.budget || 0);
  const setBudget = useCallback(() => {
    setModalVisible(true);
  }, []);
  const onChangeText = useCallback((e) => {
    setBudgetInputValue(e);
  }, []);
  const onSaveBudget = useCallback(() => {
    updateUserBudget({ budget: budgetInputValue, userId: user.id }).then(
      (u) => {
        setBudgetInputValue(u.budget);
        userActions.set(u);
      },
    );
    setModalVisible(false);
  }, [budgetInputValue]);

  return (
    <View style={styles.container}>
      <Text>
        Current Budget:{' '}
        {numbro(budgetInputValue).formatCurrency({ mantissa: 2 })}
      </Text>
      <ColorButton text="Set Budget" onPress={setBudget} />
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.inputWrapper}>
              <Text style={styles.modalText}>Set Monthly Budget</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                onChangeText={onChangeText}
                autoFocus
                enablesReturnKeyAutomatically
                maxLength={9}
                textAlign="center"
                selectionColor={colors.orange}
              />
            </View>
            <ColorButton onPress={onSaveBudget} text="Save" size="slim" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    width: '100%',
  },
  input: {
    height: 60,
    marginBottom: 180,
    borderBottomWidth: 1,
    padding: 10,
    width: '100%',
    fontSize: 20,
    borderColor: colors.grey,
    color: colors.grey,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    flex: 1,
    width: '100%',
    padding: 40,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: colors.grey,
  },
});
