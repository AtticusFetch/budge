import _ from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart, ProgressChart } from 'react-native-chart-kit';

import { colorRoulette } from '../components/UserListItem';
import { useUserContext } from '../context/User';
import { addOpacityToColor, colors } from '../utils/colors';
import { DAYS_IN_WEEK, WEEKS_IN_MONTH } from '../utils/constants';

export default function Overview({ navigation }) {
  const {
    state: { user },
  } = useUserContext();
  const { budget, transactions } = user;
  const [categorySpending, setCategorySpending] = useState([]);
  const [progressSpending, setProgressSpending] = useState([]);

  useEffect(() => {
    const groupedTransactions = _.groupBy(transactions, 'category.name');
    const spending = Object.keys(groupedTransactions).map(
      (categoryName, index) => {
        const colorIndex = index % colorRoulette.length;
        return {
          name: categoryName !== 'undefined' ? categoryName : 'Unknown',
          color: colors[colorRoulette[colorIndex]],
          legendFontColor: '#7F7F7F',
          legendFontSize: 15,
          total: _.sumBy(groupedTransactions[categoryName], (t) =>
            parseFloat(t.amount),
          ),
        };
      },
    );
    setCategorySpending(spending);
  }, [transactions]);

  useEffect(() => {
    const maxWeeklySpending =
      -1 * _.sumBy(budget, (t) => (t.amount > 0 ? 0 : t.amount));
    const maxMonthlySpending = maxWeeklySpending * WEEKS_IN_MONTH;
    const maxDailySpending = maxWeeklySpending / DAYS_IN_WEEK;
    const today = moment();
    const transactionsThisMonth = transactions.filter((t) =>
      moment(t.date).isSame(today, 'month'),
    );
    const transactionsThisWeek = transactions.filter((t) =>
      moment(t.date).isSame(today, 'week'),
    );
    const transactionsToday = transactions.filter((t) =>
      moment(t.date).isSame(today, 'day'),
    );
    const spentThisMonth = _.sumBy(transactionsThisMonth, (t) =>
      parseFloat(t.amount),
    );
    const spentThisWeek = _.sumBy(transactionsThisWeek, (t) =>
      parseFloat(t.amount),
    );
    const spentToday = _.sumBy(transactionsToday, (t) => parseFloat(t.amount));
    const todayPercent = spentToday / maxDailySpending;
    const weekPercent = spentThisWeek / maxWeeklySpending;
    const monthPercent = spentThisMonth / maxMonthlySpending;
    setProgressSpending([
      todayPercent <= 1 ? todayPercent : 1,
      weekPercent <= 1 ? weekPercent : 1,
      monthPercent <= 1 ? monthPercent : 1,
    ]);
  }, [budget, transactions]);

  const getChartColor = useCallback(
    (opacity = 1, index) => {
      if (typeof index === 'undefined') {
        return `rgba(255, 255, 255, ${opacity})`;
      }
      let progreseColor = 'green';
      if (progressSpending[index] >= 0.5) {
        progreseColor = 'yellow';
      }
      if (progressSpending[index] === 1) {
        progreseColor = 'red';
      }
      return addOpacityToColor(progreseColor, opacity * 1.5);
    },
    [progressSpending],
  );

  const chartConfig = {
    backgroundColor: colors.yellow,
    backgroundGradientFrom: colors.grey,
    backgroundGradientTo: colors.seeThrough.grey,
    decimalPlaces: 2, // optional, defaults to 2dp
    color: getChartColor,
    labelColor: (opacity = 1) => 'white',
  };

  return (
    <View style={styles.container}>
      <Text>Transactions by category:</Text>
      <PieChart
        data={categorySpending}
        width={Dimensions.get('screen').width * 0.95}
        height={200}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: colors.dimmed.blue,
        }}
        accessor="total"
        backgroundColor="transparent"
      />
      <Text>Progress:</Text>
      <ProgressChart
        data={{
          labels: ['Day', 'Week', 'Month'],
          data: progressSpending,
        }}
        width={Dimensions.get('screen').width * 0.95}
        height={200}
        strokeWidth={16}
        radius={32}
        chartConfig={chartConfig}
        hideLegend={false}
        style={{
          borderRadius: 16,
          marginVertical: 8,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
});
