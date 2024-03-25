import { sumBy } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { colors } from '../../utils/colors';

const monthsOffset = new Array(6).fill(0).map((v, i) => i);
const months = monthsOffset
  .map((offset) => {
    const mDate = moment().subtract(offset, 'month');
    return { label: mDate.format('MMM'), mDate };
  })
  .reverse();

const getMonthsTransactions = (transactions) => {
  return months.map(({ mDate }) => {
    const monthsTransactions = transactions.filter((t) =>
      moment(t.date).isSame(mDate, 'month'),
    );
    return sumBy(monthsTransactions, ({ amount }) => parseFloat(amount));
  });
};

export const CashFlow = (props) => {
  const { transactions = [] } = props;
  const [expensesSet, setExpensesSet] = useState(new Array(6).fill(0));
  const [incomeSet, setIncomeSet] = useState(new Array(6).fill(0));

  useEffect(() => {
    const outcome = transactions.filter((t) => parseFloat(t.amount) > 0);
    const income = transactions.filter((t) => parseFloat(t.amount) <= 0);
    const expensesData = getMonthsTransactions(outcome);
    const incomeData = getMonthsTransactions(income).map((t) => t * -1);
    setExpensesSet(expensesData);
    setIncomeSet(incomeData);
  }, [transactions]);

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: months.map((m) => m.label),
          datasets: [
            {
              data: incomeSet,
              color: () => colors.green,
            },
            {
              data: expensesSet,
              color: () => colors.orange,
            },
          ],
        }}
        width={Dimensions.get('window').width * 0.95} // from react-native
        height={220}
        yAxisLabel="$"
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
          marginVertical: 8,
          borderRadius: 16,
          paddingVertical: 10,
          backgroundColor: colors.grey,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dimmed.green,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.green,
    borderRadius: 10,
    marginVertical: 5,
  },
});
