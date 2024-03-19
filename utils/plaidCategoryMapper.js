export const mapPlaidCategory = (plaidCategory, categories) => {
  return categories.find((c) => c.plaidKey === plaidCategory.detailed);
};
