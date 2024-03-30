import _ from 'lodash';

import { getFrequencyMultiplier } from './getFrequencyMultiplier';

export const getBudgetTotalsForTimeFrame = (budget, timeFrame) => {
  const multiplier = getFrequencyMultiplier(timeFrame);

  const income = _.sumBy(budget, ({ amount }) => {
    if (amount < 0) {
      return -amount / multiplier;
    }
    return 0;
  });
  const outcome = _.sumBy(budget, ({ amount }) => {
    if (amount > 0) {
      return amount / multiplier;
    }
    return 0;
  });
  return [income, outcome];
};
