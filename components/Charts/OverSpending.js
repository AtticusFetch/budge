import {
  groupBy,
  mapValues,
  sumBy,
  sortBy,
  zipObject,
  map,
  throttle,
  omit,
} from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { colors } from '../../utils/colors';
import { FREQUENCY_TYPES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { getBudgetTotalsForTimeFrame } from '../../utils/getBudgetTotals';
import { updateCarryOverSelection } from '../../utils/plaidApi';
import { LabeledCheckbox } from '../LabeledCheckbox';

const updateCarryOver = throttle(
  (userId, newValues, history = {}, possibleNew) => {
    const updated = {
      ...history,
      ...newValues,
    };
    for (const value in history) {
      if (!newValues[value] && possibleNew[value]) {
        delete updated[value];
      }
    }
    if (JSON.stringify(history) !== JSON.stringify(updated)) {
      updateCarryOverSelection(userId, updated);
    }
  },
  3000,
  { leading: false },
);

const M_KEY_FORMAT = 'MMM-YYYY';
const M_LABEL_FORMAT = 'MMM';

const monthsOffset = new Array(6).fill(0).map((v, i) => i);
const months = monthsOffset
  .map((offset) => {
    const mDate = moment().subtract(offset, 'month');
    return {
      label: mDate.format(M_LABEL_FORMAT),
      mDate,
      mKey: mDate.format(M_KEY_FORMAT),
    };
  })
  .reverse();

const isPast6Months = (t, dateKey = 'date') =>
  moment(t[dateKey] || new Date()).isSameOrAfter(
    moment().subtract(6, 'months'),
  );
const groupByMonth = (data) =>
  groupBy(data, (t) => moment(t.date).format(M_LABEL_FORMAT));

export const OverSpending = (props) => {
  const { transactions, budget, userId, carryOverSelection } = props;
  const [spendTotals, setSpendTotals] = useState();
  const [budgetTotals, setBudgetTotals] = useState();
  const [expenseData, setExpenseData] = useState(monthsOffset);
  const [budgetData, setBudgetData] = useState(monthsOffset);
  const [diffData, setDiffData] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState(
    carryOverSelection || {},
  );

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
      const monthLabel = monthM.format(M_LABEL_FORMAT);
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
    let carryOver = 0;
    const chartData = months.map(({ label, mDate, mKey }) => {
      const budgetValue = budgetTotals[label];
      const spentValue = spendTotals[label] || 0;
      const budgetWithCarryOver = budgetTotals[label] + carryOver;
      if (selectedMonths[mKey]) {
        carryOver += budgetValue - spentValue;
      }
      const data = [budgetWithCarryOver, spentValue];
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
    const diff = map(budgetData, (b, i) => {
      const value = b - spendingData[i];
      return {
        value: formatCurrency(value),
        monthLabel: months[i].label,
        mKey: months[i].mDate.format(M_KEY_FORMAT),
        positive: value >= 0,
      };
    });
    setDiffData(diff);
    setBudgetData(budgetData);
    setExpenseData(spendingData);
  }, [budgetTotals, spendTotals, selectedMonths, carryOverSelection]);

  const onCarryOverSelected = useCallback(
    (selectedMonthData) => {
      if (!selectedMonths[selectedMonthData.mKey]) {
        setSelectedMonths({
          ...selectedMonths,
          [selectedMonthData.mKey]: true,
        });
      } else {
        setSelectedMonths(omit(selectedMonths, selectedMonthData.mKey));
      }
    },
    [selectedMonths],
  );

  useEffect(() => {
    updateCarryOver(
      userId,
      selectedMonths,
      carryOverSelection,
      zipObject(
        map(diffData, 'mKey'),
        map(diffData, () => true),
      ),
    );
  }, [selectedMonths, userId, carryOverSelection, diffData]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spending Over Budget</Text>
      <View style={styles.diffContainer}>
        {diffData.map((d) => (
          <View
            key={`${d.monthLabel}-${d.value}`}
            style={styles.diffLabelContainer}
          >
            <LabeledCheckbox
              isChecked={selectedMonths[d.mKey]}
              onPress={() => onCarryOverSelected(d)}
              style={styles.checkbox}
              labelStyle={styles.checkboxLabel}
            />
            <Text
              style={[styles.diffLabel, d.positive && styles.diffLabelPositive]}
            >
              {d.monthLabel}: {d.positive && '+'}
              {d.value}
            </Text>
          </View>
        ))}
      </View>
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
  diffContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.grey,
    marginHorizontal: 30,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 5,
  },
  diffLabelContainer: {
    flexDirection: 'row',
    width: '50%',
  },
  diffLabel: {
    color: colors.red,
    fontWeight: 'bold',
    fontSize: 15,
    margin: 10,
  },
  diffLabelPositive: {
    color: colors.green,
  },
  checkbox: {
    padding: 0,
    flex: 0,
    alignSelf: 'center',
    height: '100%',
    borderWidth: 0,
  },
  checkboxLabel: {},
});
