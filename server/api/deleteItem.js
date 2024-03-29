const { getDBUserById, removeListItemsByIdx } = require('../db/commands');
const { deleteUserTransactionById } = require('../db/utils');

const deleteItem = async (request, response) => {
  const { itemId, userId, shouldDeleteTransactions } = request.body;
  let itemResult;
  let transactionsResult;

  try {
    const user = (await getDBUserById(userId))?.Item;
    const itemToRemove = user?.plaidItems?.find((i) => i.itemId === itemId);
    itemResult = await deleteUserTransactionById(user, itemId, 'plaidItems');
    if (shouldDeleteTransactions) {
      const accountIds = itemToRemove?.accounts?.map((a) => a.account_id);
      const transactionIndexes = [];
      user?.transactions?.forEach((transaction, i) => {
        if (accountIds.includes(transaction.account_id)) {
          transactionIndexes.push(i);
        }
      });
      transactionsResult = await removeListItemsByIdx(
        userId,
        'transactions',
        transactionIndexes,
      );
    }
  } catch (e) {
    console.error(e);
  }

  if (!itemResult && !transactionsResult) {
    response.status(500);
    response.send();

    return;
  }

  response.json({
    ...itemResult?.Attributes,
    ...transactionsResult?.Attributes,
  });
};

exports.deleteItem = deleteItem;
