import moment from 'moment';
import numbro from 'numbro';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getMaxSpending, getProgressSpendingForDay } from './ProgressSpending';
import { colors } from '../../utils/colors';

const remainderLabels = ['Today', 'This Week', 'This Month'];

export const BudgetRemainder = (props) => {
  const [remainder, setRemainder] = useState([]);
  const { budget, transactions, showBars = false } = props;
  const max = getMaxSpending(budget);
  useEffect(() => {
    const [, totalAmountSpent] = getProgressSpendingForDay(
      moment(),
      budget,
      transactions,
    );
    const remainderSet = totalAmountSpent
      .map((v, i) => max[i] - v)
      .map((v, i) => [v, v / max[i]]);
    setRemainder(remainderSet);
  }, [budget, transactions]);
  return (
    <View style={styles.container}>
      {remainder.map(([amount, percent], i) => (
        <View key={i} style={styles.progressWrapper}>
          <Text
            style={[
              styles.label,
              styles.progressHeader,
              showBars && styles.labelShort,
            ]}
          >
            {remainderLabels[i]}
          </Text>
          {showBars && (
            <View
              style={[
                styles.progressBarContainer,
                amount <= 0.5 && styles.warningBar,
                amount <= 0 && styles.negativeBar,
              ]}
            >
              <View
                style={[
                  styles.progressPart,
                  styles.progressBarFull,
                  { width: amount <= 0 ? 0 : `${percent * 100}%` },
                ]}
              />
              <View
                style={[
                  styles.progressPart,
                  styles.progressBarEmpty,
                  { width: amount <= 0 ? 0 : `${(1 - percent) * 100}%` },
                ]}
              />
            </View>
          )}
          <Text
            style={[
              styles.label,
              showBars && styles.labelShort,
              styles.progressAmount,
              amount <= 0.5 && styles.warningLabel,
              amount <= 0 && styles.negativeLabel,
            ]}
          >
            {numbro(amount).formatCurrency({ mantissa: 2 })}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    marginTop: 10,
  },
  progressWrapper: {
    flex: 1,
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  header: {
    fontSize: 20,
    color: 'white',
    fontWeight: '500',
    marginVertical: 20,
  },
  progressHeader: {
    marginRight: 5,
  },
  label: {
    flex: 1,
    color: 'white',
    fontWeight: '600',
    opacity: 0.7,
  },
  labelShort: {
    flex: 0.2,
  },
  negativeLabel: {
    color: colors.red,
  },
  warningLabel: {
    color: colors.yellow,
  },
  progressBarContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
    backgroundColor: colors.green,
    marginVertical: 10,
    borderRadius: 10,
  },
  negativeBar: {
    backgroundColor: colors.red,
  },
  warningBar: {
    backgroundColor: colors.yellow,
  },
  textBox: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPart: {
    position: 'absolute',
    height: '100%',
    top: 0,
  },
  progressAmount: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.green,
    fontSize: 15,
    flex: 0.4,
    opacity: 1,
  },
  progressBarFull: {},
  progressBarEmpty: {
    backgroundColor: colors.grey,
    opacity: 0.8,
    right: 0,
    borderRadius: 10,
  },
});
