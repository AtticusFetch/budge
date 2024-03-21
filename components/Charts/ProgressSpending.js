import _ from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

import { addOpacityToColor, colors } from '../../utils/colors';
import { DAYS_IN_WEEK, WEEKS_IN_MONTH } from '../../utils/constants';

export const getMaxSpending = (budget) => {
  const maxWeeklySpending = -1 * _.sumBy(budget, 'amount');
  const maxMonthlySpending = maxWeeklySpending * WEEKS_IN_MONTH;
  const maxDailySpending = maxWeeklySpending / DAYS_IN_WEEK;

  return [maxDailySpending, maxWeeklySpending, maxMonthlySpending];
};

export const getProgressSpendingForDay = (day, budget, transactions) => {
  const today = moment.utc(day);
  const relevantTransactions = transactions.filter((t) =>
    moment.utc(t.date).isSameOrBefore(today),
  );
  const [maxDailySpending, maxWeeklySpending, maxMonthlySpending] =
    getMaxSpending(budget);
  const transactionsThisMonth = relevantTransactions.filter((t) =>
    moment.utc(t.date).isSame(today, 'month'),
  );
  const transactionsThisWeek = relevantTransactions.filter((t) =>
    moment.utc(t.date).isSame(today, 'isoWeek'),
  );
  const transactionsToday = relevantTransactions.filter((t) =>
    moment.utc(t.date).isSame(today, 'day'),
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
  const spendingPercent = [
    todayPercent <= 1 ? todayPercent : 1,
    weekPercent <= 1 ? weekPercent : 1,
    monthPercent <= 1 ? monthPercent : 1,
  ];
  const spendingAmount = [spentToday, spentThisWeek, spentThisMonth];

  return [spendingPercent, spendingAmount];
};

export const ProgressSpending = (props) => {
  const { chartConfig, budget, transactions, day, extraDays } = props;
  const [progressSpending, setProgressSpending] = useState([]);
  const [pastProgressSpending, setPastProgressSpending] = useState([]);

  useEffect(() => {
    const [spending] = getProgressSpendingForDay(
      day || moment.utc(),
      budget,
      transactions,
    );
    const extraInfo = extraDays?.map(
      (d) => getProgressSpendingForDay(d, budget, transactions)[0],
    );
    setPastProgressSpending(extraInfo);
    setProgressSpending(spending);
  }, [budget, transactions, extraDays]);

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

  const getExtraChartColor = useCallback(
    (opacity = 1, index, globalIndex) => {
      if (typeof index === 'undefined') {
        return `rgba(255, 255, 255, ${opacity})`;
      }
      let progreseColor = 'green';
      if (pastProgressSpending[globalIndex][index] >= 0.5) {
        progreseColor = 'yellow';
      }
      if (pastProgressSpending[globalIndex][index] === 1) {
        progreseColor = 'red';
      }
      return addOpacityToColor(progreseColor, opacity * 1.5);
    },
    [pastProgressSpending],
  );

  return (
    <View style={styles.container}>
      <ProgressChart
        data={{
          labels: ['Day', 'Week', 'Month'],
          data: progressSpending,
        }}
        width={props.slim ? 120 : Dimensions.get('screen').width * 0.95}
        height={props.slim ? 120 : 200}
        strokeWidth={props.slim ? 8 : 16}
        radius={props.slim ? 20 : 32}
        hideLegend={props.slim}
        chartConfig={{
          ...chartConfig,
          color: getChartColor,
        }}
        style={{
          borderRadius: 16,
          marginVertical: 8,
        }}
      />
      {pastProgressSpending && (
        <View style={styles.historyContainer}>
          {pastProgressSpending.map((s, globalIndex) => (
            <View key={globalIndex} style={styles.pastProgressContainer}>
              <Text style={styles.pastProgressLabel}>
                {extraDays[globalIndex].format('ddd DD')}
              </Text>
              <ProgressChart
                data={{
                  data: s,
                }}
                width={90}
                height={120}
                strokeWidth={8}
                radius={15}
                hideLegend
                chartConfig={{
                  ...chartConfig,
                  color: (opacity, index) =>
                    getExtraChartColor(opacity, index, globalIndex),
                }}
                style={{
                  borderColor: 'red',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  borderRadius: 16,
                }}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dimmed.blue,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.blue,
    borderRadius: 10,
    marginVertical: 5,
  },
  historyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    width: '95%',
    backgroundColor: colors.grey,
    marginBottom: 8,
  },
  pastProgressContainer: {
    backgroundColor: colors.grey,
    paddingTop: 10,
    borderRadius: 16,
  },
  pastProgressLabel: {
    color: colors.blue,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});
