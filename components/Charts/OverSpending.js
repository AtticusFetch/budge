import { groupBy, mapValues, sumBy, sortBy, map } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { colors } from '../../utils/colors';
import { FREQUENCY_TYPES } from '../../utils/constants';
import { getBudgetTotalsForTimeFrame } from '../../utils/getBudgetTotals';

const monthsOffset = new Array(6).fill(0).map((v, i) => i);
const months = monthsOffset
  .map((offset) => {
    const mDate = moment().subtract(offset, 'month');
    return { label: mDate.format('MMM'), mDate };
  })
  .reverse();

const isPast6Months = (t, dateKey = 'date') =>
  moment(t[dateKey] || new Date()).isSameOrAfter(
    moment().subtract(6, 'months'),
  );
const groupByMonth = (data) =>
  groupBy(data, (t) => moment(t.date).format('MMM'));

export const OverSpending = (props) => {
  const { transactions, budget } = props;
  const [spendTotals, setSpendTotals] = useState();
  const [budgetTotals, setBudgetTotals] = useState();
  const [expenseData, setExpenseData] = useState(monthsOffset);
  const [budgetData, setBudgetData] = useState(monthsOffset);

  useEffect(() => {
    const last6Months = transactions.filter(isPast6Months);
    const groupedByMonth = groupByMonth(last6Months);
    const totals = mapValues(groupedByMonth, (t) =>
      sumBy(t, (t) => parseFloat(t.amount)),
    );

    setSpendTotals(totals);
  }, [transactions]);

  useEffect(() => {
    const relevantBudget = budget.filter((b) =>
      isPast6Months(b, 'dateSubmitted'),
    );
    const undated = relevantBudget.filter((b) => !b.dateSubmitted);
    const dated = relevantBudget.filter((b) => !!b.dateSubmitted);
    const budgetsBase = monthsOffset.map(() => undated);
    const groupedBudgets = monthsOffset.reduce((acc, curr) => {
      const monthM = moment().subtract(curr, 'month');
      const monthLabel = monthM.format('MMM');
      const budgetForMonth = dated.filter((b) =>
        moment(b.dateSubmitted).isSame(monthM, 'month'),
      );

      return {
        ...acc,
        [monthLabel]: [...budgetsBase[curr], ...budgetForMonth],
      };
    }, {});
    const groupedTotals = mapValues(groupedBudgets, (budgetTransactions) => {
      const [income, outcome] = getBudgetTotalsForTimeFrame(
        budgetTransactions,
        FREQUENCY_TYPES.monthly,
      );
      const total = income - outcome;
      return total;
    });
    setBudgetTotals(groupedTotals);
  }, [budget]);

  useEffect(() => {
    if (!budgetTotals || !spendTotals) return;
    const chartData = months.map(({ label, mDate }) => {
      const data = [budgetTotals[label], spendTotals[label] || 0];
      return {
        data,
        label,
        mDate,
      };
    });
    const sorted = sortBy(chartData, (dataPoint) =>
      dataPoint.mDate.toDate().getTime(),
    );
    const budgetData = map(sorted, 'data[0]');
    const spendingData = map(sorted, 'data[1]');
    setBudgetData(budgetData);
    setExpenseData(spendingData);
  }, [budgetTotals, spendTotals]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spending Over Budget</Text>
      <LineChart
        data={{
          labels: map(months, 'label'),
          datasets: [
            {
              data: budgetData,
              color: () => colors.green,
            },
            {
              data: expenseData,
              color: () => colors.orange,
            },
          ],
        }}
        width={Dimensions.get('window').width * 0.95} // from react-native
        height={220}
        yAxisLabel="$"
        fromZero
        withDots={false}
        chartConfig={{
          backgroundColor: colors.grey,
          backgroundGradientFrom: colors.grey,
          backgroundGradientTo: colors.grey,
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
          },
        }}
        bezier
        style={{
          borderRadius: 16,
          backgroundColor: colors.grey,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dimmed.yellow,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.yellow,
    borderRadius: 10,
    marginVertical: 5,
  },
  header: {
    fontSize: 20,
    color: colors.grey,
    fontWeight: '500',
    marginVertical: 20,
  },
});
