const { v4: uuidv4 } = require('uuid');

const {
  addListItem,
  getDBUserById,
  removeListItemByIdx,
  removeListItemsByIdx,
  deleteUserAttribute,
} = require('./commands');
const { plaidClient } = require('../config');

const uid = () => uuidv4();

const addCategory = async (category, userId) => {
  const uniqueCategory = {
    ...category,
    id: uid(),
  };
  let result;

  try {
    result = await addListItem(userId, 'categories', uniqueCategory);
  } catch (e) {
    console.error(e);
  }

  return result.Attributes;
};

const addTransaction = async (transaction, userId, key = 'transactions') => {
  let transactionAmount = transaction.amount;
  let personalNotes;
  if (transaction.splitWith?.length) {
    transactionAmount = transactionAmount / (transaction.splitWith?.length + 1);
  }
  if (transaction.isIncome && transactionAmount > 0) {
    transactionAmount *= -1;
  }
  if (transaction.shouldRememberNote) {
    const noteItem = {
      name: transaction.note,
      id: uid(),
    };
    personalNotes = await addListItem(userId, 'personalNotes', noteItem);
  }
  const uniqueTransaction = {
    ...transaction,
    amount: transactionAmount,
    ...(!transaction.id && { id: uid() }),
  };
  if (key === 'plaidTransactions') {
    delete uniqueTransaction.id;
  }
  let result;

  try {
    result = await addListItem(userId, key, uniqueTransaction);
    await transaction.splitWith?.forEach(async (userToSplitId) => {
      await addListItem(userToSplitId, key, {
        ...uniqueTransaction,
        splitWith: [
          ...uniqueTransaction.splitWith?.filter((id) => id !== userToSplitId),
          userId,
        ],
      });
    });
  } catch (e) {
    console.error(e);
  }

  return {
    ...result.Attributes,
    ...personalNotes?.Attributes,
  };
};

const deleteUserTransactionById = async (
  user,
  transactionId,
  key = 'transactions',
) => {
  const transactionToRemoveIdx = user?.[key]?.findIndex(
    (r) => (r.id || r.transaction_id || r.itemId) === transactionId,
  );

  if (transactionToRemoveIdx < 0) {
    throw new Error(
      `Transaction Not Found. Removing ${transactionId} from ${key} for ${user.username}`,
    );
  }

  const result = await removeListItemByIdx(
    user.id,
    key,
    transactionToRemoveIdx,
  );

  return result;
};

const getUserTransactionById = async (
  userId,
  transactionId,
  key = 'transactions',
) => {
  const user = (await getDBUserById(userId))?.Item;
  const transaction = user?.[key]?.find(
    (r) => (r.id || r.transaction_id) === transactionId,
  );

  return transaction;
};

const deleteTransaction = async (
  transactionId,
  userId,
  key = 'transactions',
) => {
  const removingUserDb = await getDBUserById(userId);
  const removingUser = removingUserDb?.Item;
  const transactionToRemove = await getUserTransactionById(
    userId,
    transactionId,
    key,
  );
  try {
    if (transactionToRemove?.splitWith) {
      for (const splitterId of transactionToRemove.splitWith) {
        const splitter = await getDBUserById(splitterId);
        await deleteUserTransactionById(splitter?.Item, transactionId, key);
      }
    }
  } catch (e) {
    console.error(e);
  }

  const result = await deleteUserTransactionById(
    removingUser,
    transactionId,
    key,
  );

  return result.Attributes;
};

const batchDeleteListItem = async (userId, items, listName) => {
  const user = (await getDBUserById(userId))?.Item;
  const idxs = items.map((itemToRemove) =>
    user[listName].findIndex((item) => {
      const idToRemove = itemToRemove.id || itemToRemove.transaction_id;
      const id = item.id || item.transaction_id;
      return id === idToRemove;
    }),
  );
  const result = await removeListItemsByIdx(userId, listName, idxs);

  return result.Attributes;
};

const updateTransaction = async (transaction, userId, key) => {
  const transactionId = transaction.id || transaction.transaction_id;
  const addResult = await addTransaction(transaction, userId, key);
  const deleteResult = await deleteTransaction(transactionId, userId, key);

  return {
    ...deleteResult,
    ...addResult,
  };
};

const batchAddListItem = async (userId, items, listName) => {
  const result = await addListItem(userId, listName, items);

  return result.Attributes;
};

const getTransactionsForItem = async function (item) {
  let cursor = item.cursor || null;

  // New transaction updates since "cursor"
  let added = [];
  let modified = [];
  // Removed transaction ids
  let removed = [];
  let hasMore = true;
  // Iterate through each page of new transaction updates for item
  while (hasMore) {
    const request = {
      access_token: item.accessToken,
      cursor,
    };
    const response = await plaidClient().transactionsSync(request);
    const data = response.data;
    // Add this page of results
    added = added.concat(data.added);
    modified = modified.concat(data.modified);
    removed = removed.concat(data.removed);
    hasMore = data.has_more;
    // Update cursor to the next cursor
    cursor = data.next_cursor;
    item.cursor = cursor;
  }

  return {
    added,
    modified,
    removed,
  };
};

const fetchPlaidTransactions = async (userId, plaidItems) => {
  const allTransactions = await Promise.all(
    plaidItems.map(getTransactionsForItem),
  );
  const mergedTransactions = allTransactions.reduce(
    (acc, curr) => {
      acc.added = [...acc.added, ...curr.added];
      acc.modified = [...acc.modified, ...curr.modified];
      acc.removed = [...acc.removed, ...curr.removed];
      return acc;
    },
    {
      added: [],
      modified: [],
      removed: [],
    },
  );
  await deleteUserAttribute(userId, 'plaidItems');
  await addListItem(userId, 'plaidItems', plaidItems);
  const result = await addListItem(
    userId,
    'plaidTransactions',
    mergedTransactions.added,
  );

  return result?.Attributes;
};

module.exports.fetchPlaidTransactions = fetchPlaidTransactions;
module.exports.batchDeleteListItem = batchDeleteListItem;
module.exports.batchAddListItem = batchAddListItem;
module.exports.getUserTransactionById = getUserTransactionById;
module.exports.updateTransaction = updateTransaction;
module.exports.addTransaction = addTransaction;
module.exports.addCategory = addCategory;
module.exports.deleteTransaction = deleteTransaction;
module.exports.deleteUserTransactionById = deleteUserTransactionById;
module.exports.uid = uid;
