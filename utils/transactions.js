import { groupBy, mapValues, sumBy, memoize } from 'lodash';
import moment from 'moment';

import {
  FREQUENCY_TYPES,
  MONTH_KEY_FORMAT,
  MONTH_LABEL_FORMAT,
} from './constants';
import { getBudgetTotalsForTimeFrame } from './getBudgetTotals';

export const groupByMonth = (data) =>
  groupBy(data, (t) => moment(t.date).format(MONTH_KEY_FORMAT));

export const getTransactionsExpenseTotals = (transactions) => {
  const groupedByMonth = groupByMonth(transactions);
  const totals = mapValues(groupedByMonth, (t) =>
    sumBy(t, (t) => parseFloat(t.amount)),
  );

  return totals;
};

export const getBudgetMonthsTotals = (budgetTransactions, startFrom = 0) => {
  const monthsOffset = getMonthsOffset(6, startFrom);
  const undated = budgetTransactions.filter((b) => !b.dateSubmitted);
  const dated = budgetTransactions.filter((b) => !!b.dateSubmitted);
  const budgetsBase = monthsOffset.map(() => undated);
  const groupedBudgets = monthsOffset.reduce((acc, curr) => {
    const monthM = moment().subtract(curr, 'month');
    const monthKey = monthM.format(MONTH_KEY_FORMAT);
    const budgetForMonth = dated.filter((b) =>
      moment(b.dateSubmitted).isSame(monthM, 'month'),
    );

    return {
      ...acc,
      [monthKey]: [...budgetsBase[curr - startFrom], ...budgetForMonth],
    };
  }, {});
  const groupedTotals = mapValues(groupedBudgets, (budgetTransactions) => {
    const [income, outcome] = getBudgetTotalsForTimeFrame(
      budgetTransactions,
      FREQUENCY_TYPES.monthly,
    );
    const total = income - outcome;
    return total;
  });

  return groupedTotals;
};

export const isPast6Months = (t, dateKey = 'date') =>
  moment(t[dateKey] || new Date()).isSameOrAfter(
    moment().subtract(5, 'months'), // current month + 5
  );

export const getMonthsOffset = memoize(
  (numMonths = 6, startWith = 0) =>
    new Array(numMonths).fill(0).map((v, i) => startWith + i),
  (numMonths, startWith) => `${numMonths}-${startWith}`,
);

export const getMonths = memoize((numMonths = 6, startWith) =>
  getMonthsOffset(numMonths, startWith)
    .map((offset) => {
      const mDate = moment().subtract(offset, 'month');
      return {
        label: mDate.format(MONTH_LABEL_FORMAT),
        mDate,
        mKey: mDate.format(MONTH_KEY_FORMAT),
      };
    })
    .reverse(),
);
