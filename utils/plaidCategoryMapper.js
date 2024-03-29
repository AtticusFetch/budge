import { get, omit } from 'lodash';

export const mapPlaidCategory = (plaidCategory, categories) => {
  return categories.find((c) => c.plaidKey === plaidCategory.detailed);
};

const LINK_FIELD_MAP = {
  categoryId: 'category.id',
  merchantName: 'name',
  transactionId: 'id',
};

export const isLinked = (transaction, manualLinks) => {
  const links = manualLinks instanceof Array ? manualLinks : [manualLinks];
  if (!links?.length) {
    return false;
  }
  for (const link of links) {
    const predicateFields = omit(link, 'budgetId', 'newCategoryId', 'id');
    const match = Object.keys(predicateFields).every(
      (field) => get(transaction, LINK_FIELD_MAP[field]) === link[field],
    );

    if (match) {
      return true;
    }
  }

  return false;
};

export const mapBudgetCategory = (
  manualLinks,
  transaction,
  budget,
  categories,
) => {
  for (const link of manualLinks) {
    const linked = isLinked(transaction, link);
    if (!linked) {
      continue;
    }
    let targetCategory;
    if (link.budgetId) {
      const targetBudget = budget.find((b) => b.id === link.budgetId);
      targetCategory = {
        ...targetBudget?.category,
        note: targetBudget?.note,
      };
    }
    if (link.newCategoryId) {
      targetCategory = categories.find((c) => c.id === link.newCategoryId);
    }
    if (!targetCategory) return;
    return {
      ...targetCategory,
      isLinked: true,
    };
  }
};
