import { Feather } from '@expo/vector-icons';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatCurrency';
import { globalStyles } from '../../utils/globalStyles';
import { TransactionListItem } from '../TransactionListItem';

export const BudgetInfo = (props) => {
  const { budget } = props;
  const [totalIncome, setTotalIncome] = useState('');
  const listHeight = useRef(new Animated.Value(0)).current;
  const [totalOutcome, setTotalOutcome] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setTotalIncome(_.sumBy(budget.income, (t) => -parseFloat(t.amount)));
  }, [budget.income]);

  useEffect(() => {
    setTotalOutcome(_.sumBy(budget.outcome, (t) => parseFloat(t.amount)));
  }, [budget.outcome]);

  const expand = useCallback(() => {
    Animated.timing(listHeight, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setExpanded(true);
  }, []);
  const collapse = useCallback(() => {
    Animated.timing(listHeight, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setExpanded(false);
  }, []);

  const lisetHeightPercent = listHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[styles.overviewHeader, expanded && styles.overviewHeaderExpanded]}
    >
      <Text style={styles.titleText}>Weekly Breakdown</Text>
      <View style={[globalStyles.row, styles.headerContainer]}>
        <View style={[styles.headerSection, styles.incomeSection]}>
          <Feather color={colors.green} name="plus" size={30} />
          <Text style={[styles.headerText, styles.incomeText]}>
            {formatCurrency(totalIncome)}
          </Text>
        </View>
        <View style={[styles.headerSection, styles.outcomeSection]}>
          <Feather color={colors.red} name="minus" size={30} />
          <Text style={[styles.headerText, styles.outcomeText]}>
            {formatCurrency(totalOutcome)}
          </Text>
        </View>
      </View>
      <Animated.FlatList
        data={[...budget.income, ...budget.outcome]}
        style={[styles.list, { height: lisetHeightPercent }]}
        showsVerticalScrollIndicator={false}
        renderItem={(transaction, index) => {
          return <TransactionListItem {...transaction.item} />;
        }}
        keyExtractor={(transaction) => transaction?.id || transaction?.amount}
      />
      <Pressable
        onPress={expanded ? collapse : expand}
        style={styles.expandBtn}
      >
        <Feather
          style={[styles.chevronIcon, expanded && styles.chevronIconExpanded]}
          color={colors.blue}
          name="chevron-down"
          size={40}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  overviewHeader: {
    paddingTop: 10,
    paddingBottom: 50,
    flexDirection: 'column',
    borderColor: colors.dimmed.grey,
    borderRadius: 10,
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  overviewHeaderExpanded: {
    flex: 1,
  },
  list: {
    flex: 0,
    flexGrow: 0,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.grey,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 10,
  },
  expandBtn: {
    width: '100%',
  },
  chevronIcon: {
    alignSelf: 'center',
  },
  chevronIconExpanded: {
    transform: [{ rotateX: '180deg' }],
  },
  headerContainer: {
    flex: 0.2,
    width: '100%',
  },
  headerSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeSection: {
    borderRightWidth: 1,
    borderColor: colors.dimmed.grey,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  incomeText: {
    color: colors.green,
  },
  outcomeText: {
    color: colors.red,
  },
});
