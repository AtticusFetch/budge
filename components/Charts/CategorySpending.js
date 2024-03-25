import { groupBy, sortBy, sumBy } from 'lodash';
import moment from 'moment';
import numbro from 'numbro';
import { useCallback, useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

import { useUserContext, userActions } from '../../context/User';
import { AddCategoryBudgetModal } from '../../modals/AddCategoryBudgetModal';
import { animateLayout } from '../../utils/animations';
import { colors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatCurrency';
import { deleteCategoryBudget } from '../../utils/plaidApi';
import { CategoryBudgetListItem } from '../CategoryBudgetListItem';
import { ColorButton } from '../ColorButton';
import { DatePicker } from '../DatePicker';
import { Icon } from '../Icon';
import { colorRoulette } from '../UserListItem';

export const CategorySpending = (props) => {
  const { transactions, chartConfig, categories } = props;
  const {
    state: { user = {} },
    dispatch,
  } = useUserContext();
  const [categorySpending, setCategorySpending] = useState([]);
  const [categoryBudgetModalVisible, setCategoryBudgetModalVisible] =
    useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState();
  const start = moment().startOf('month');
  const end = moment().endOf('month');
  const [dateFrom, setDateFrom] = useState(start.toDate());
  const [dateTo, setDateTo] = useState(end.toDate());
  const [dateRange, setDateRange] = useState([start, end]);
  const [expanded, setExpanded] = useState(false);

  const hideCategoryBudgetModal = useCallback(() => {
    setCategoryBudgetModalVisible(false);
    setSelectedCategory();
  });

  const showCategoryBudgetModal = useCallback(() => {
    setCategoryBudgetModalVisible(true);
  });

  const toggleExpanded = useCallback(() => {
    animateLayout();
    setExpanded(!expanded);
  }, [expanded]);

  useEffect(() => {
    animateLayout();
    const timedTransactions = transactions.filter((t) =>
      moment(t.date).isBetween(...dateRange),
    );
    const groupedTransactions = groupBy(timedTransactions, 'category.name');
    const spending = Object.keys(groupedTransactions).map(
      (categoryName, index) => {
        const totalFloat = sumBy(groupedTransactions[categoryName], (t) =>
          parseFloat(t.amount),
        );
        const totalFormatted = numbro(totalFloat).format({ mantissa: 2 });
        const total = numbro.unformat(totalFormatted);
        return {
          name: categoryName !== 'undefined' ? categoryName : 'Unknown',
          color: colors[colorRoulette[index]],
          legendFontColor: colors.grey,
          legendFontSize: 15,
          total,
        };
      },
    );
    setCategorySpending(sortBy(spending, 'total').reverse());
  }, [transactions, dateRange]);

  useEffect(() => {
    animateLayout();
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
    animateLayout();
    setSelectedDateRange('custom');
  }, []);

  const onBudgetEdit = useCallback((category) => {
    setSelectedCategory(category);
    showCategoryBudgetModal();
  }, []);

  const onBudgetDelete = useCallback(async (category) => {
    const updatedUser = await deleteCategoryBudget({
      categoryBudgetId: category.id,
      userId: user.id,
    });
    dispatch(userActions.update(updatedUser));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spending By Category</Text>
      <View style={styles.chartWrapper}>
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
          width={Dimensions.get('screen').width - 28}
          height={300}
          chartConfig={{
            ...chartConfig,
          }}
          style={{
            marginTop: 8,
          }}
          center={[Dimensions.get('screen').width / 2 - 110, 0]}
          accessor="total"
          hasLegend={false}
          absolute
          backgroundColor="white"
        />
        <ColorButton
          style={[
            styles.expandButtonContainer,
            expanded && styles.expandedContainer,
          ]}
          childrenWrapperStyle={styles.expandButton}
          colorName="blue"
          onPress={toggleExpanded}
          type="fill"
        >
          <Icon color="white" name="chevron-down" size={20} />
        </ColorButton>
        {expanded && (
          <Animated.View style={[styles.chartLegend]}>
            {categorySpending.map(({ color, total, name }) => (
              <View key={`${total}-${name}`} style={styles.legendItem}>
                <View
                  style={[styles.legendCircle, { backgroundColor: color }]}
                />
                <Text style={[styles.legendText]}>{name}</Text>
                <Text style={[styles.legendText]}>{formatCurrency(total)}</Text>
              </View>
            ))}
          </Animated.View>
        )}
      </View>
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
        selectedCategory={selectedCategory}
        visible={categoryBudgetModalVisible}
        onRequestClose={hideCategoryBudgetModal}
        categories={categories}
      />
      {user.categoryBudget?.map((categoryBudget) => (
        <CategoryBudgetListItem
          key={categoryBudget.id}
          transactions={transactions}
          categoryBudget={categoryBudget}
          chartConfig={chartConfig}
          onEdit={onBudgetEdit}
          onDelete={onBudgetDelete}
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
  chartWrapper: {
    borderWidth: 2,
    borderColor: colors.blue,
    borderRadius: 16,
    maxWidth: '100%',
    padding: 10,
  },
  chartLegend: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  legendItem: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  legendText: {
    color: colors.grey,
    marginHorizontal: 5,
  },
  legendCircle: {
    width: 15,
    height: 15,
    marginRight: 5,
    borderRadius: 100,
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
  expandButtonContainer: {
    width: 40,
    height: 20,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue,
    shadowColor: colors.grey,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  expandButton: {
    padding: 0,
  },
  expandedContainer: {
    transform: [{ rotate: '180deg' }],
  },
});
