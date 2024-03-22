import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

import { BudgetRemainder } from './BudgetRemainder';
import { addOpacityToColor, colors } from '../../utils/colors';
import { getProgressSpendingForDay } from '../../utils/spending';

export const ProgressSpending = (props) => {
  const {
    chartConfig,
    budget,
    transactions,
    day,
    extraDays,
    headerStyle,
    showHeaderBars,
    prependChild,
    style,
    hideLegend,
    compact,
  } = props;
  const [progressSpending, setProgressSpending] = useState([]);
  const [pastProgressSpending, setPastProgressSpending] = useState([]);

  useEffect(() => {
    const [spending] = getProgressSpendingForDay(
      day || moment(),
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
    <View style={[styles.container, style]}>
      {prependChild}
      <View style={styles.progressChartWrapper}>
        <BudgetRemainder
          style={headerStyle}
          showBars={showHeaderBars}
          transactions={transactions}
          budget={budget}
        />
        {!compact && (
          <ProgressChart
            data={{
              labels: ['Day', 'Week', 'Month'],
              data: progressSpending,
            }}
            width={props.slim ? 120 : Dimensions.get('screen').width * 0.95}
            height={props.slim ? 120 : 200}
            strokeWidth={props.slim ? 8 : 16}
            radius={props.slim ? 20 : 32}
            hideLegend={hideLegend || props.slim}
            chartConfig={{
              ...chartConfig,
              color: getChartColor,
            }}
            style={{
              borderTopWidth: 0,
              marginBottom: 8,
              borderRadius: 16,
            }}
          />
        )}
      </View>
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
                style={{}}
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
  progressChartWrapper: {
    alignItems: 'center',
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
