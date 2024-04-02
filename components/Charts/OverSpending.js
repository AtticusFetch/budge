import { sortBy, zipObject, map, throttle, omit, partition } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { colors } from '../../utils/colors';
import { MONTH_KEY_FORMAT } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { updateCarryOverSelection } from '../../utils/plaidApi';
import {
  getBudgetMonthsTotals,
  getMonths,
  getMonthsOffset,
  getTransactionsExpenseTotals,
  isPast6Months,
} from '../../utils/transactions';
import { Icon } from '../Icon';
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

const monthsOffset = getMonthsOffset(6);

const past6Months = getMonths(6);

export const OverSpending = (props) => {
  const { transactions, budget, userId, carryOverSelection } = props;
  const [spendTotals, setSpendTotals] = useState();
  const [budgetTotals, setBudgetTotals] = useState();
  const [pastSpendTotals, setPastSpendTotals] = useState();
  const [pastBudgetTotals, setPastBudgetTotals] = useState();
  const [expenseData, setExpenseData] = useState(monthsOffset);
  const [budgetData, setBudgetData] = useState(monthsOffset);
  const [diffData, setDiffData] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState(
    carryOverSelection || {},
  );
  const [expanded, setExpanded] = useState(false);
  const height = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const [last6Months, pastTransactions] = partition(
      transactions,
      isPast6Months,
    );
    const totals = getTransactionsExpenseTotals(last6Months);
    const pastTotals = getTransactionsExpenseTotals(pastTransactions);

    setSpendTotals(totals);
    setPastSpendTotals(pastTotals);
  }, [transactions]);

  useEffect(() => {
    const [relevantBudget] = partition(budget, (b) =>
      isPast6Months(b, 'dateSubmitted'),
    );
    const totals = getBudgetMonthsTotals(relevantBudget);
    const pastTotals = getBudgetMonthsTotals(budget, 6);

    setBudgetTotals(totals);
    setPastBudgetTotals(pastTotals);
  }, [budget]);

  useEffect(() => {
    if (!budgetTotals || !spendTotals) return;
    let carryOver = 0;
    const chartData = past6Months.map(({ label, mDate, mKey }) => {
      const budgetValue = budgetTotals[mKey];
      const spentValue = spendTotals[mKey] || 0;
      let budgetWithCarryOver = budgetValue;
      if (carryOver !== 0) {
        budgetWithCarryOver += carryOver;
        carryOver = 0;
      }
      if (selectedMonths[mKey]) {
        carryOver += budgetWithCarryOver - spentValue;
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
        monthLabel: past6Months[i].label,
        mKey: past6Months[i].mDate.format(MONTH_KEY_FORMAT),
        positive: value >= 0,
      };
    });
    setDiffData(diff);
    setBudgetData(budgetData);
    setExpenseData(spendingData);
  }, [budgetTotals, spendTotals, selectedMonths]);

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

  const toggleExpand = useCallback(() => {
    if (expanded) {
      Animated.timing(height, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setExpanded(false));
    } else {
      setExpanded(true);
      Animated.timing(height, {
        toValue: 182,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [expanded]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spending Over Budget</Text>
      <TouchableOpacity onPress={toggleExpand} style={[styles.pullBtn]}>
        <Icon
          style={expanded && styles.pullBtnExpanded}
          name="chevron-up"
          color="white"
          size={30}
        />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.diffContainer,
          { height },
          expanded && styles.diffContainerExpanded,
        ]}
      >
        <Text style={styles.diffHeader}>Choose Months to carry over:</Text>
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
      </Animated.View>
      <LineChart
        data={{
          labels: map(past6Months, 'label'),
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
  diffHeader: {
    fontSize: 15,
    color: 'white',
    opacity: 0.8,
    fontWeight: '500',
    marginVertical: 10,
  },
  pullBtn: {
    backgroundColor: colors.grey,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  pullBtnExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  diffContainerExpanded: {
    display: 'flex',
  },
  diffContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.grey,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    display: 'none',
    marginHorizontal: 30,
    paddingHorizontal: 5,
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
