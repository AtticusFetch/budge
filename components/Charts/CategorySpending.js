import _ from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  LayoutAnimation,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';

import { colors, getRandomColor } from '../../utils/colors';
import { ColorButton } from '../ColorButton';
import { DatePicker } from '../DatePicker';
import { colorRoulette } from '../UserListItem';

export const CategorySpending = (props) => {
  const { transactions, chartConfig } = props;
  const [categorySpending, setCategorySpending] = useState([]);
  const [selectedDateRange, setSetselectedDateRange] = useState('month');
  const start = moment().startOf('month');
  const end = moment().endOf('month');
  const [dateFrom, setDateFrom] = useState(start.toDate());
  const [dateTo, setDateTo] = useState(end.toDate());
  const [dateRange, setDateRange] = useState([start, end]);

  useEffect(() => {
    LayoutAnimation.configureNext({
      duration: 700,
      update: { type: 'spring', springDamping: 0.4 },
      create: { type: 'linear', property: 'opacity' },
    });
    const timedTransactions = transactions.filter((t) =>
      moment(t.date).isBetween(...dateRange),
    );
    const groupedTransactions = _.groupBy(timedTransactions, 'category.name');
    const spending = Object.keys(groupedTransactions).map(
      (categoryName, index) => {
        // TODO Need more random colors
        return {
          name: categoryName !== 'undefined' ? categoryName : 'Unknown',
          color: colors[colorRoulette[index]] || getRandomColor(),
          legendFontColor: '#7F7F7F',
          legendFontSize: 15,
          total: _.sumBy(groupedTransactions[categoryName], (t) =>
            parseFloat(t.amount),
          ),
        };
      },
    );
    setCategorySpending(spending);
  }, [transactions, dateRange]);

  useEffect(() => {
    let start = moment().startOf(selectedDateRange);
    let end = moment().endOf(selectedDateRange);
    if (selectedDateRange === 'custom') {
      start = moment(dateFrom);
      end = moment(dateTo);
    }
    setDateRange([start, end]);
  }, [selectedDateRange, dateFrom, dateTo]);

  const onDayRangePress = useCallback(() => {
    setSetselectedDateRange('day');
  }, []);

  const onWeekRangePress = useCallback(() => {
    setSetselectedDateRange('week');
  }, []);

  const onMonthRangePress = useCallback(() => {
    setSetselectedDateRange('month');
  }, []);

  const onCustomRangePress = useCallback(() => {
    LayoutAnimation.configureNext({
      duration: 700,
      update: { type: 'spring', springDamping: 0.4 },
      create: { type: 'linear', property: 'opacity' },
    });
    setSetselectedDateRange('custom');
  }, []);

  return (
    <View style={styles.container}>
      <Text>Category Spending</Text>
      <View style={styles.btnContainer}>
        <ColorButton
          onPress={onDayRangePress}
          size="slim"
          childrenWrapperStyle={styles.btn}
          colorName={selectedDateRange === 'day' ? 'yellow' : 'blue'}
          style={styles.dateSelectBtn}
          text="Today"
        />
        <ColorButton
          size="slim"
          childrenWrapperStyle={styles.btn}
          colorName={selectedDateRange === 'week' ? 'yellow' : 'blue'}
          onPress={onWeekRangePress}
          style={styles.dateSelectBtn}
          text="This Week"
        />
        <ColorButton
          size="slim"
          childrenWrapperStyle={styles.btn}
          colorName={selectedDateRange === 'month' ? 'yellow' : 'blue'}
          onPress={onMonthRangePress}
          style={styles.dateSelectBtn}
          text="This Month"
        />
        <ColorButton
          size="slim"
          childrenWrapperStyle={styles.btn}
          colorName={selectedDateRange === 'custom' ? 'yellow' : 'blue'}
          onPress={onCustomRangePress}
          style={styles.dateSelectBtn}
          text="Custom"
        />
      </View>
      {selectedDateRange === 'custom' && (
        <View style={styles.dateSelectContainer}>
          <DatePicker value={dateFrom} onChange={setDateFrom} />
          <DatePicker value={dateTo} onChange={setDateTo} />
        </View>
      )}
      <PieChart
        data={categorySpending}
        width={Dimensions.get('screen').width * 0.95}
        height={200}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: colors.dimmed.blue,
        }}
        accessor="total"
        backgroundColor="transparent"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dateSelectBtn: {
    flex: 1,
  },
  btn: {
    padding: 5,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
