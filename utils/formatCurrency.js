import numbro from 'numbro';

export const formatCurrency = (amount, mantissa = 0) =>
  numbro(amount || 0).formatCurrency({ mantissa, thousandSeparated: true });
