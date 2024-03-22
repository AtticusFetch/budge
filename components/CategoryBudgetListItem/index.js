import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/colors';
import { ProgressSpending } from '../Charts/ProgressSpending';
import { Icon } from '../Icon';

export const CategoryBudgetListItem = (props) => {
  const { transactions, categoryBudget, chartConfig } = props;
  const [relevantTransactions, setRelevantTransactions] = useState([]);

  useEffect(() => {
    setRelevantTransactions(
      transactions.filter((t) => t.category.id === categoryBudget.category.id),
    );
  }, [transactions]);

  return (
    <View style={styles.container}>
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
              {categoryBudget.category?.name}
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
    </View>
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
