const { v4: uuidv4 } = require('uuid');

const {
  addListItem,
  getDBUserById,
  removeListItemByIdx,
} = require('./commands');

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
    (r) => (r.id || r.transaction_id) === transactionId,
  );

  if (transactionToRemoveIdx < 0) {
    throw new Error('Transaction Not Found');
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
  const transactionToRemove = getUserTransactionById(
    userId,
    transactionId,
    key,
  );
  if (transactionToRemove.splitWith) {
    for (const splitterId of transactionToRemove.splitWith) {
      const splitter = await getDBUserById(splitterId);
      await deleteUserTransactionById(splitter?.Item, transactionId, key);
    }
  }

  const result = await deleteUserTransactionById(
    removingUser,
    transactionId,
    key,
  );

  return result.Attributes;
};

const updateTransaction = async (transaction, userId) => {
  const deleteResult = await deleteTransaction(transaction.id, userId);
  const addResult = await addTransaction(transaction, userId);

  return {
    ...deleteResult,
    ...addResult,
  };
};

module.exports.getUserTransactionById = getUserTransactionById;
module.exports.updateTransaction = updateTransaction;
module.exports.addTransaction = addTransaction;
module.exports.addCategory = addCategory;
module.exports.deleteTransaction = deleteTransaction;
module.exports.deleteUserTransactionById = deleteUserTransactionById;
module.exports.uid = uid;
