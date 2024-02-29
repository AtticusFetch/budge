import numbro from 'numbro';

export const formatCurrency = (amount) =>
  numbro(amount || 0).formatCurrency({ mantissa: 2 });
