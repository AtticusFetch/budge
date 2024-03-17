import _ from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

import { addOpacityToColor } from '../../utils/colors';
import { DAYS_IN_WEEK, WEEKS_IN_MONTH } from '../../utils/constants';

export const ProgressSpending = (props) => {
  const { chartConfig, budget, transactions } = props;
  const [progressSpending, setProgressSpending] = useState([]);

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
      moment(t.date).isSame(today, 'isoWeek'),
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

  return (
    <View>
      <Text>Progress</Text>
      <ProgressChart
        data={{
          labels: ['Day', 'Week', 'Month'],
          data: progressSpending,
        }}
        width={Dimensions.get('screen').width * 0.95}
        height={200}
        strokeWidth={16}
        radius={32}
        chartConfig={{
          ...chartConfig,
          color: getChartColor,
        }}
        hideLegend={false}
        style={{
          borderRadius: 16,
          marginVertical: 8,
        }}
      />
    </View>
  );
};
