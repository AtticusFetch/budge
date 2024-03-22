import _ from 'lodash';
import moment from 'moment';

import { DAYS_IN_WEEK, WEEKS_IN_MONTH } from './constants';

export const getMaxSpending = (budget = []) => {
  const maxWeeklySpending = -1 * _.sumBy(budget, 'amount');
  const maxMonthlySpending = maxWeeklySpending * WEEKS_IN_MONTH;
  const maxDailySpending = maxWeeklySpending / DAYS_IN_WEEK;

  return [maxDailySpending, maxWeeklySpending, maxMonthlySpending];
};

export const getProgressSpendingForDay = (day, budget = [], transactions) => {
  const today = moment(day);
  const relevantTransactions = transactions.filter((t) =>
    moment(t.date).isSameOrBefore(today),
  );
  const [maxDailySpending = 0, maxWeeklySpending = 0, maxMonthlySpending = 0] =
    getMaxSpending(budget);
  const transactionsThisMonth = relevantTransactions.filter((t) =>
    moment(t.date).isSame(today, 'month'),
  );
  const transactionsThisWeek = relevantTransactions.filter((t) =>
    moment(t.date).isSame(today, 'isoWeek'),
  );
  const transactionsToday = relevantTransactions.filter((t) =>
    moment(t.date).isSame(today, 'day'),
  );
  const spentThisMonth = _.sumBy(transactionsThisMonth, (t) =>
    parseFloat(t.amount),
  );
  const spentThisWeek = _.sumBy(transactionsThisWeek, (t) =>
    parseFloat(t.amount),
  );
  const spentToday = _.sumBy(transactionsToday, (t) => parseFloat(t.amount));
  const todayPercent = spentToday / maxDailySpending;
  const weekPercent = spentThisWeek / maxWeeklySpending;
  const monthPercent = spentThisMonth / maxMonthlySpending;
  const spendingPercent = [
    todayPercent <= 1 ? todayPercent : 1,
    weekPercent <= 1 ? weekPercent : 1,
    monthPercent <= 1 ? monthPercent : 1,
  ];
  const spendingAmount = [spentToday, spentThisWeek, spentThisMonth];

  return [spendingPercent, spendingAmount];
};
