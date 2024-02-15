import moment from 'moment';
import numbro from 'numbro';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import FillBar from '../components/FillBar';
import { useTransactionsContext } from '../context/Transactions';
import { useUserContext } from '../context/User';
import { colors } from '../utils/colors';
import { getMonthlyTransactions, getTransactions } from '../utils/plaidApi';

const today = '2023-12-02';

const getPercentageSpent = (total, spent) => {
  const percentageSpent = spent / total;
  if (percentageSpent > 1) {
    return 1;
  }

  return percentageSpent;
};

export default function Overview({ navigation }) {
  const {
    state: { user },
  } = useUserContext();
  const {
    state: { transactions },
  } = useTransactionsContext();
  const [monthlySpentPercent, setMonthlySpentPercent] = useState(0);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [weeklySpending, setWeeklySpending] = useState(0);
  const [dailySpending, setDailySpending] = useState(0);
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const { budget: monthlyBudget } = user;
  useEffect(() => {
    if (transactions.length) {
      return;
    }
    getMonthlyTransactions(user.id, today)
      .then((data) => {
        if (data) {
          setMonthlyTransactions(
            data.filter(({ amount }) => parseFloat(amount) > 0),
          );
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [user.id]);

  useEffect(() => {
    setMonthlySpending(
      monthlyTransactions.reduce((sum, curr) => sum + curr.amount, 0),
    );
  }, [monthlyTransactions]);

  useEffect(() => {
    const monthlyBudgetSpent = getPercentageSpent(
      monthlyBudget,
      monthlySpending,
    );
    const dailyBudget = monthlySpending / moment().daysInMonth();
    const dailySpending = monthlyTransactions
      .filter((t) => moment(t.date).isSame(moment(today), 'day'))
      .reduce((sum, curr) => sum + curr.amount, 0);
    const weeklyBudget = dailyBudget * 7;
    const dailyBudgetSpent = getPercentageSpent(dailyBudget, dailySpending);

    setMonthlySpentPercent(monthlyBudgetSpent);
    setDailySpending(dailyBudgetSpent);
  }, [monthlyBudget, monthlySpending]);

  return (
    <View style={styles.container}>
      <Text>
        {numbro(dailySpending).format({ output: 'percent', mantissa: 0 })}
      </Text>
      <FillBar
        fillValue={monthlySpentPercent}
        highlightSection={1}
        separatorCount={4}
      />
      <FillBar
        fillValue={0.3}
        highlightSection={moment(today).day() - 1}
        separatorCount={7}
        labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
      />
      <FillBar
        fillValue={dailySpending ? parseFloat(dailySpending).toFixed(2) : 0}
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
  separatorContainer: {
    width: '100%',
    height: 40,
    position: 'absolute',
    flexDirection: 'row',
  },
  separator: {
    flex: 1,
    borderColor: colors.grey,
    borderRightWidth: 1,
    height: 40,
    borderRadius: 20,
  },
  separatorLast: {
    borderRightWidth: 0,
  },
  bar: {
    width: '100%',
    borderWidth: 1,
    height: 40,
    borderRadius: 20,
    borderColor: colors.grey,
    flexDirection: 'row',
  },
  barInner: {
    borderRadius: 20,
  },
  full: {},
});
