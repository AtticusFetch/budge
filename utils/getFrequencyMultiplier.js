import { FREQUENCY_TYPES, WEEKS_IN_MONTH, WEEKS_IN_YEAR } from './constants';

export const getFrequencyMultiplier = (frequency) => {
  let weeklyMultiplier = 1;
  switch (frequency) {
    case FREQUENCY_TYPES.annual:
      weeklyMultiplier = 1 / WEEKS_IN_YEAR;
      break;
    case FREQUENCY_TYPES.monthly:
      weeklyMultiplier = 1 / WEEKS_IN_MONTH;
      break;
    case FREQUENCY_TYPES.semiMonthly:
      weeklyMultiplier = 1 / (WEEKS_IN_MONTH / 2);
      break;
    case FREQUENCY_TYPES.weekly:
      weeklyMultiplier = 1;
      break;
  }
  return weeklyMultiplier;
};
