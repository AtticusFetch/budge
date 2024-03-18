import { Feather } from '@expo/vector-icons';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { BUDGET_STAGES, SetupBudgetModal } from '../../modals/SetupBudgetModal';
import { colors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatCurrency';
import { globalStyles } from '../../utils/globalStyles';
import { TransactionListItem } from '../TransactionListItem';

export const BudgetInfo = (props) => {
  const { budget } = props;
  const [totalIncome, setTotalIncome] = useState('');
  const [totalOutcome, setTotalOutcome] = useState('');
  const [budgetStage, setBudgetStage] = useState();
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [isEditBudgetModalVisible, setIsEditBudgetModalVisible] =
    useState(false);
  const [sortedBudget, setSortedBudget] = useState([]);

  useEffect(() => {
    setSortedBudget(
      _.sortBy(budget, (t) => {
        const amount = parseFloat(t.amount);
        if (amount > 0) {
          return -amount;
        }
        return amount * 1000;
      }),
    );
    setTotalIncome(
      _.sumBy(budget, (t) => {
        const amount = parseFloat(t.amount);
        if (amount < 0) {
          return -amount;
        }
        return 0;
      }),
    );
    setTotalOutcome(
      _.sumBy(budget, (t) => {
        const amount = parseFloat(t.amount);
        if (amount > 0) {
          return amount;
        }
        return 0;
      }),
    );
  }, [budget]);

  const closeSetupBudgetModal = useCallback(() => {
    setIsEditBudgetModalVisible(false);
  }, []);

  const showSetupBudgetModal = useCallback(() => {
    setIsEditBudgetModalVisible(true);
  }, []);

  const onDelete = useCallback(async (transactionId) => {
    await props.onDeleteTransaction(transactionId);
  }, []);
  const onEdit = useCallback((transaction) => {
    if (transaction.isStageTransaction) {
      setTransactionToEdit(transaction);
      const budgetStage = BUDGET_STAGES[transaction.name];
      if (budgetStage) {
        setBudgetStage(budgetStage);
        showSetupBudgetModal();
      }
    } else {
      props.onEditCustomTransaction(transaction);
    }
  }, []);
  const onSubmitEdit = useCallback(
    async (amount) => {
      const updatedTransaction = {
        ...transactionToEdit,
        amount,
      };
      await props.onSubmitEdit(updatedTransaction);
      closeSetupBudgetModal();
    },
    [transactionToEdit],
  );

  return (
    <View style={[styles.overviewHeader]}>
      <Text style={styles.titleText}>Weekly Breakdown</Text>
      <View style={[globalStyles.row, styles.headerContainer]}>
        <View style={[styles.headerSection, styles.incomeSection]}>
          <Feather color={colors.green} name="plus" size={30} />
          <Text style={[styles.headerText, styles.incomeText]}>
            {formatCurrency(totalIncome)}
          </Text>
        </View>
        <View style={[styles.headerSection, styles.outcomeSection]}>
          <Feather color={colors.red} name="minus" size={30} />
          <Text style={[styles.headerText, styles.outcomeText]}>
            {formatCurrency(totalOutcome)}
          </Text>
        </View>
      </View>
      <Animated.FlatList
        data={sortedBudget}
        style={[styles.list]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={(transaction) => {
          return (
            <TransactionListItem
              onDelete={onDelete}
              onEdit={onEdit}
              style={styles.transaction}
              roundDirection="none"
              {...transaction.item}
            />
          );
        }}
        keyExtractor={(transaction) => transaction?.id || transaction?.amount}
      />
      <SetupBudgetModal
        onClose={closeSetupBudgetModal}
        onRequestClose={closeSetupBudgetModal}
        visible={isEditBudgetModalVisible}
        onSubmit={onSubmitEdit}
        singleStage
        stage={budgetStage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overviewHeader: {
    paddingTop: 10,
    flexDirection: 'column',
    borderColor: colors.dimmed.grey,
    borderRadius: 10,
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  listContent: {},
  transaction: {
    maxWidth: '100%',
  },
  titleText: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.grey,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 10,
  },
  headerContainer: {
    flex: 0.1,
    width: '100%',
    minHeight: '10%',
  },
  headerSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeSection: {
    borderRightWidth: 2,
    borderColor: colors.dimmed.blue,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  incomeText: {
    color: colors.green,
  },
  outcomeText: {
    color: colors.red,
  },
});
