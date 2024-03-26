import moment from 'moment';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { CashFlow } from '../components/Charts/CashFlow';
import { CategorySpending } from '../components/Charts/CategorySpending';
import { ProgressSpending } from '../components/Charts/ProgressSpending';
import { categoriesActions, useCategoriesContext } from '../context/Categories';
import { setLoadingAction, useLoadingContext } from '../context/Loading';
import { useUserContext } from '../context/User';
import { colors } from '../utils/colors';
import { getCategories } from '../utils/plaidApi';
import { isLinked } from '../utils/plaidCategoryMapper';

export default function Overview({ navigation }) {
  const {
    state: { user },
  } = useUserContext();
  const { budget, transactions } = user;
  const {
    state: { categories },
    dispatch: dispatchCategoriesAction,
  } = useCategoriesContext();
  const { dispatch: dispatchLoading } = useLoadingContext();

  const [expenses, setExpenses] = useState([]);
  const [extraExpenses, setExtraExpenses] = useState([]);

  useEffect(() => {
    setLoadingAction(dispatchLoading, true);
    getCategories().then((categories) => {
      setLoadingAction(dispatchLoading, false);
      dispatchCategoriesAction(categoriesActions.set(categories));
    });
  }, [dispatchLoading]);

  useEffect(() => {
    const allExpenses = transactions?.filter((t) => parseFloat(t.amount) > 0);
    const unLinkedExpenses = allExpenses.filter(
      (t) => !isLinked(t, user.manualLinks),
    );
    setExpenses(allExpenses);
    setExtraExpenses(unLinkedExpenses);
  }, [transactions]);

  const chartConfig = {
    backgroundColor: colors.yellow,
    backgroundGradientFrom: colors.seeThrough.grey,
    backgroundGradientTo: colors.grey,
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => 'white',
  };
  const today = parseInt(moment().format('DD'), 10);
  const firstDay = parseInt(moment().startOf('month').format('DD'), 10);
  const daysPassed = today - firstDay;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentWrapper}
      >
        <CategorySpending
          transactions={expenses}
          categories={categories}
          chartConfig={chartConfig}
        />
        {!!user.budget && (
          <ProgressSpending
            transactions={extraExpenses}
            budget={budget}
            slim={false}
            extraDays={
              daysPassed &&
              new Array(daysPassed)
                .fill({})
                .map((i, index) => moment().subtract(index + 1, 'day'))
            }
            chartConfig={chartConfig}
          />
        )}
        <CashFlow transactions={transactions} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  contentWrapper: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 2,
    width: '100%',
    backgroundColor: colors.dimmed.grey,
    marginVertical: 15,
    borderRadius: 100,
  },
});
