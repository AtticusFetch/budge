const { v4: uuidv4 } = require('uuid');

const { addListItem } = require('../db/commands');

const createUserTransaction = async (request, response) => {
  const { transaction, userId } = request.body;
  let transactionAmount = transaction.amount;
  let personalNotes;
  if (transaction.splitWith?.length) {
    transactionAmount = transactionAmount / (transaction.splitWith?.length + 1);
  }
  if (transaction.shouldRememberNote) {
    const noteItem = {
      name: transaction.note,
      id: uuidv4(),
    };
    personalNotes = await addListItem(userId, 'personalNotes', noteItem);
  }
  const uniqueTransaction = {
    ...transaction,
    amount: transactionAmount,
    id: uuidv4(),
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

  if (!result) {
    response.status(500);
    response.send();

    return;
  }

  response.json({
    ...result.Attributes,
    ...personalNotes?.Attributes,
  });
};

exports.createUserTransaction = createUserTransaction;
