import _ from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import { setLoadingAction, useLoadingContext } from '../../context/Loading';
import { colors } from '../../utils/colors';
import { FREQUENCY_TYPES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { getFrequencyMultiplier } from '../../utils/getFrequencyMultiplier';
import { globalStyles } from '../../utils/globalStyles';
import { ColorButton } from '../ColorButton';
import { TransactionListItem } from '../TransactionListItem';

const TIME_FRAMES = {
  [FREQUENCY_TYPES.weekly]: 'Week',
  [FREQUENCY_TYPES.monthly]: 'Month',
  [FREQUENCY_TYPES.annual]: 'Year',
};

export const BudgetInfo = (props) => {
  const { dispatch } = useLoadingContext();
  const { budget } = props;
  const [totalIncome, setTotalIncome] = useState('');
  const [totalOutcome, setTotalOutcome] = useState('');
  const [timeFrame, setTimeFrame] = useState(FREQUENCY_TYPES.weekly);
  const [sortedBudget, setSortedBudget] = useState([]);

  useEffect(() => {
    const multiplier = getFrequencyMultiplier(timeFrame);
    const sorted = _.sortBy(budget, (t) => {
      const amount = parseFloat(t.amount);
      if (amount > 0) {
        return -amount;
      }
      return amount * 1000;
    });
    setSortedBudget(sorted);
    setTotalIncome(
      _.sumBy(budget, (t) => {
        const amount = parseFloat(t.amount);
        if (amount < 0) {
          return -amount / multiplier;
        }
        return 0;
      }),
    );
    setTotalOutcome(
      _.sumBy(budget, (t) => {
        const amount = parseFloat(t.amount);
        if (amount > 0) {
          return amount / multiplier;
        }
        return 0;
      }),
    );
  }, [budget, timeFrame]);

  const onDelete = useCallback(async (transactionId) => {
    await props.onDeleteTransaction(transactionId);
  }, []);
  const onEdit = useCallback((transaction) => {
    props.onEditCustomTransaction(transaction);
  }, []);

  const onBudgetPaid = useCallback(
    async (transaction) => {
      setLoadingAction(dispatch, true);
      const paidTransaction = {
        ...transaction,
        lastChecked: {
          ...transaction.lastChecked,
          [TIME_FRAMES[timeFrame]]: moment().toDate(),
        },
      };
      await props.onTransactionPaid(paidTransaction);
      setLoadingAction(dispatch, false);
    },
    [timeFrame, dispatch],
  );

  const formattedIncome = formatCurrency(totalIncome, 0);
  const formattedOutcome = formatCurrency(totalOutcome, 0);

  return (
    <View style={[styles.overviewHeader]}>
      <Text style={styles.titleText}>Breakdown For</Text>
      <View style={styles.buttonsContainer}>
        {Object.keys(TIME_FRAMES).map((frame) => (
          <ColorButton
            style={styles.frameBtn}
            onPress={() => setTimeFrame(frame)}
            colorName={frame === timeFrame ? 'blue' : 'orange'}
            size="slim"
            key={frame}
            text={TIME_FRAMES[frame]}
          />
        ))}
      </View>
      <View style={[globalStyles.row, styles.headerContainer]}>
        <View style={[styles.headerSection, styles.incomeSection]}>
          <Text
            style={[
              styles.headerText,
              styles.incomeText,
              formattedIncome.length >= 9 && styles.headerTextSmall,
            ]}
          >
            {formattedIncome}
          </Text>
        </View>
        <View style={[styles.headerSection, styles.outcomeSection]}>
          <Text
            style={[
              styles.headerText,
              styles.outcomeText,
              formattedOutcome.length >= 9 && styles.headerTextSmall,
            ]}
          >
            {formattedOutcome}
          </Text>
        </View>
      </View>
      <View style={styles.listContainer}>
        <Animated.FlatList
          data={sortedBudget}
          style={[styles.list]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={(transaction) => {
            return (
              <View style={styles.budgetTransaction}>
                <BouncyCheckbox
                  size={25}
                  fillColor={colors.blue}
                  unfillColor="white"
                  style={styles.checkbox}
                  isChecked={
                    transaction.item.lastChecked?.[TIME_FRAMES[timeFrame]]
                      ? moment(
                          transaction.item.lastChecked[TIME_FRAMES[timeFrame]],
                        ).isSame(moment(), TIME_FRAMES[timeFrame].toLowerCase())
                      : false
                  }
                  onPress={() => onBudgetPaid(transaction.item)}
                  disableBuiltInState
                />
                <TransactionListItem
                  onDelete={onDelete}
                  onEdit={onEdit}
                  style={styles.transaction}
                  roundDirection="none"
                  {...transaction.item}
                  amount={
                    transaction.item.amount / getFrequencyMultiplier(timeFrame)
                  }
                />
              </View>
            );
          }}
          keyExtractor={(transaction) => transaction?.id || transaction?.amount}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overviewHeader: {
    paddingTop: 10,
    flexDirection: 'column',
    borderRadius: 10,
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
    borderWidth: 2,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderColor: colors.grey,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  frameBtn: {
    flex: 1,
    marginHorizontal: 5,
  },
  budgetTransaction: {
    flexDirection: 'row',
    flex: 1,
    maxWidth: '100%',
  },
  listContent: {},
  transaction: {
    flex: 1,
  },
  titleText: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.grey,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 10,
  },
  headerContainer: {
    width: '100%',
    minHeight: '10%',
    backgroundColor: colors.grey,
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeSection: {
    borderRightWidth: 2,
    borderColor: colors.dimmed.blue,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerTextSmall: {
    fontSize: 25,
  },
  incomeText: {
    color: colors.green,
  },
  outcomeText: {
    color: colors.red,
  },
});
