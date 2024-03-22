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

import { useUserContext } from '../../context/User';
import { AddCategoryBudgetModal } from '../../modals/AddCategoryBudgetModal';
import { colors } from '../../utils/colors';
import { CategoryBudgetListItem } from '../CategoryBudgetListItem';
import { ColorButton } from '../ColorButton';
import { DatePicker } from '../DatePicker';
import { Icon } from '../Icon';
import { colorRoulette } from '../UserListItem';

export const CategorySpending = (props) => {
  const { transactions, chartConfig, categories } = props;
  const {
    state: { user = {} },
  } = useUserContext();
  const [categorySpending, setCategorySpending] = useState([]);
  const [categoryBudgetModalVisible, setCategoryBudgetModalVisible] =
    useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('month');
  const start = moment().startOf('month');
  const end = moment().endOf('month');
  const [dateFrom, setDateFrom] = useState(start.toDate());
  const [dateTo, setDateTo] = useState(end.toDate());
  const [dateRange, setDateRange] = useState([start, end]);

  const hideCategoryBudgetModal = useCallback(() => {
    setCategoryBudgetModalVisible(false);
  });

  const showCategoryBudgetModal = useCallback(() => {
    setCategoryBudgetModalVisible(true);
  });

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
          color: colors[colorRoulette[index]],
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
    LayoutAnimation.configureNext({
      duration: 700,
      update: { type: 'spring', springDamping: 0.4 },
      create: { type: 'linear', property: 'opacity' },
    });
  }, [user.categoryBudget]);

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
    setSelectedDateRange('day');
  }, []);

  const onWeekRangePress = useCallback(() => {
    setSelectedDateRange('isoWeek');
  }, []);

  const onMonthRangePress = useCallback(() => {
    setSelectedDateRange('month');
  }, []);

  const onCustomRangePress = useCallback(() => {
    LayoutAnimation.configureNext({
      duration: 700,
      update: { type: 'spring', springDamping: 0.4 },
      create: { type: 'linear', property: 'opacity' },
    });
    setSelectedDateRange('custom');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spending By Category</Text>
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
          colorName={selectedDateRange === 'isoWeek' ? 'yellow' : 'blue'}
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
        width={Dimensions.get('screen').width}
        height={220}
        chartConfig={{
          ...chartConfig,
        }}
        style={{
          marginTop: 8,
          marginBottom: 20,
          borderRadius: 16,
        }}
        accessor="total"
        backgroundColor="white"
      />
      <ColorButton
        style={styles.addButtonContainer}
        childrenWrapperStyle={styles.addButton}
        colorName="blue"
        onPress={showCategoryBudgetModal}
        type="fill"
      >
        <Icon color="white" name="plus" size={20} />
      </ColorButton>
      <AddCategoryBudgetModal
        visible={categoryBudgetModalVisible}
        onRequestClose={hideCategoryBudgetModal}
        categories={categories}
      />
      {user.categoryBudget?.map((categoryBudget) => (
        <CategoryBudgetListItem
          transactions={transactions}
          categoryBudget={categoryBudget}
          chartConfig={chartConfig}
        />
      ))}
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
  dateSelectBtn: {
    flex: 1,
    marginHorizontal: 1,
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
  addButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 35,
    shadowColor: colors.grey,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  addButton: {
    borderRadius: 35,
    padding: 0,
  },
});
