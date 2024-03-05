const { getDBUserById, removeListItemByIdx } = require('../db/commands');

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

const deleteUserTransaction = async (request, response) => {
  const { transactionId, userId } = request.body;

  try {
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

    response.json(result.Attributes);
  } catch (e) {
    console.error(e);
    response.status(500);
    response.json({ error: e });
  }
};

exports.deleteUserTransaction = deleteUserTransaction;
