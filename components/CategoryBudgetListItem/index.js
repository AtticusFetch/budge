import { useCallback, useEffect, useState } from 'react';
import {
  ActionSheetIOS,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../../utils/colors';
import { ProgressSpending } from '../Charts/ProgressSpending';
import { Icon } from '../Icon';

const CATEGORY_ACTIONS = {
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  EDIT: 'Edit',
};

const actionSheetOptions = Object.values(CATEGORY_ACTIONS);

export const CategoryBudgetListItem = (props) => {
  const { transactions, categoryBudget, chartConfig, onEdit, onDelete } = props;
  const [relevantTransactions, setRelevantTransactions] = useState([]);

  useEffect(() => {
    setRelevantTransactions(
      transactions.filter((t) => t.category.id === categoryBudget.category.id),
    );
  }, [transactions]);

  const onActionSelected = useCallback(async (actionIndex) => {
    switch (actionSheetOptions[actionIndex]) {
      case CATEGORY_ACTIONS.CANCEL:
        break;
      case CATEGORY_ACTIONS.DELETE:
        await onDelete(categoryBudget);
        break;
      case CATEGORY_ACTIONS.EDIT:
        await onEdit(categoryBudget);
        break;
    }
  }, []);

  const onLongPress = useCallback(() => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: actionSheetOptions,
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      onActionSelected,
    );
  }, []);

  return (
    <Pressable onLongPress={onLongPress} style={styles.container}>
      <ProgressSpending
        transactions={relevantTransactions}
        prependChild={
          <View style={styles.categoryContainer}>
            <Icon
              size={30}
              color={colors.grey}
              name={categoryBudget.category?.icon}
            />
            <Text style={styles.categoryName}>
              {categoryBudget.note || categoryBudget.category?.name}
            </Text>
          </View>
        }
        compact
        key={categoryBudget.id}
        showHeaderBars
        style={styles.categoryBudgetContainer}
        headerStyle={styles.categoryBudget}
        budget={[
          {
            ...categoryBudget,
            amount: parseFloat(categoryBudget.amount) * -1,
          },
        ]}
        slim={false}
        chartConfig={chartConfig}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  categoryBudgetContainer: {
    paddingBottom: 10,
  },
  categoryBudget: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    width: '90%',
  },
  categoryContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grey,
    marginLeft: 15,
  },
});
