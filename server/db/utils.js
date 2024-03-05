const { v4: uuidv4 } = require('uuid');

const {
  addListItem,
  getDBUserById,
  removeListItemByIdx,
} = require('./commands');

const uid = () => uuidv4();

const addTransaction = async (transaction, userId) => {
  let transactionAmount = transaction.amount;
  let personalNotes;
  if (transaction.splitWith?.length) {
    transactionAmount = transactionAmount / (transaction.splitWith?.length + 1);
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
    id: uid(),
  };
  let result;

  try {
    result = await addListItem(userId, 'transactions', uniqueTransaction);
    await transaction.splitWith?.forEach(async (userToSplitId) => {
      await addListItem(userToSplitId, 'transactions', {
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

const deleteUserTransactionById = async (user, transactionId) => {
  const transactionToRemoveIdx = user?.transactions?.findIndex(
    (r) => r.id === transactionId,
  );

  if (transactionToRemoveIdx < 0) {
    throw new Error('Transaction Not Found');
  }

  const result = await removeListItemByIdx(
    user.id,
    'transactions',
    transactionToRemoveIdx,
  );

  return result;
};

const deleteTransaction = async (transactionId, userId) => {
  const removingUserDb = await getDBUserById(userId);
  const removingUser = removingUserDb?.Item;
  const transactionToRemove = removingUser?.transactions?.find(
    (r) => r.id === transactionId,
  );
  transactionToRemove.splitWith?.forEach(async (splitterId) => {
    const splitter = await getDBUserById(splitterId);
    await deleteUserTransactionById(splitter?.Item, transactionId);
  });

  const result = await deleteUserTransactionById(removingUser, transactionId);

  return result.Attributes;
};

module.exports.addTransaction = addTransaction;
module.exports.deleteTransaction = deleteTransaction;
module.exports.deleteUserTransactionById = deleteUserTransactionById;
module.exports.uid = uid;
