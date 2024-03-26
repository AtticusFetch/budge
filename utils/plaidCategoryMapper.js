import { get, omit } from 'lodash';

export const mapPlaidCategory = (plaidCategory, categories) => {
  return categories.find((c) => c.plaidKey === plaidCategory.detailed);
};

const LINK_FIELD_MAP = {
  categoryId: 'category.id',
  merchantName: 'name',
  transactionId: 'id',
};

export const mapBudgetCategory = (
  budgetLinks,
  transaction,
  categories,
  budget,
) => {
  for (const link of budgetLinks) {
    const predicateFields = omit(link, 'budgetId');
    const match = Object.keys(predicateFields).every(
      (field) => get(transaction, LINK_FIELD_MAP[field]) === link[field],
    );
    if (match) {
      const targetBudget = budget.find((b) => b.id === link.budgetId);
      return {
        ...targetBudget?.category,
        note: targetBudget?.note,
      };
    }
  }
};
