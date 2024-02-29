import { Feather } from '@expo/vector-icons';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatCurrency';
import { globalStyles } from '../../utils/globalStyles';
import { TransactionListItem } from '../TransactionListItem';

export const BudgetInfo = (props) => {
  const { budget } = props;
  const [totalIncome, setTotalIncome] = useState('');
  const [totalOutcome, setTotalOutcome] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setTotalIncome(_.sumBy(budget.income, (t) => -parseFloat(t.amount)));
  }, [budget.income]);

  useEffect(() => {
    setTotalOutcome(_.sumBy(budget.outcome, (t) => parseFloat(t.amount)));
  }, [budget.outcome]);

  const expand = useCallback(() => {
    LayoutAnimation.configureNext({
      duration: 350,
      update: { type: 'linear' },
      create: { type: 'easeInEaseOut', property: 'opacity' },
    });
    setExpanded(true);
  }, []);
  const collapse = useCallback(() => {
    setExpanded(false);
  }, []);

  return (
    <View
      style={[styles.overviewHeader, expanded && styles.overviewHeaderExpanded]}
    >
      <Text style={styles.titleText}>Weekly Breakdown</Text>
      <View
        style={[
          globalStyles.row,
          styles.headerContainer,
          expanded && styles.headerContainerExpanded,
        ]}
      >
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
      {expanded && (
        <FlatList
          data={[...budget.income, ...budget.outcome]}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={(transaction, index) => {
            return <TransactionListItem {...transaction.item} />;
          }}
          keyExtractor={(transaction) => transaction?.id || transaction?.amount}
        />
      )}
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
    flex: 0.2,
    width: '100%',
    backgroundColor: 'white',
  },
  overviewHeaderExpanded: {
    flex: 1,
  },
  list: {
    flex: 1,
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
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  chevronIcon: {
    alignSelf: 'center',
  },
  chevronIconExpanded: {
    transform: [{ rotateX: '180deg' }],
  },
  headerContainer: {
    flex: 1,
    width: '100%',
  },
  headerContainerExpanded: {
    flex: 0.2,
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
