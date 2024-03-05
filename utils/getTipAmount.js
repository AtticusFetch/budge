import numbro from 'numbro';

export const getTipAmount = (tip, amount) => {
  const isPercentageTip = tip?.includes?.('%');
  if (!tip) {
    return;
  }
  if (!isPercentageTip) {
    return tip;
  }
  if (amount) {
    const tipAmount = numbro.unformat(tip) * amount;
    return tipAmount;
  }
  return numbro.unformat(tip);
};
