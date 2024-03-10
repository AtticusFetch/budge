const { deleteTransaction, addTransaction } = require('../db/utils');

const updateBudgetTransaction = async (request, response) => {
  const { transaction, userId } = request.body;
  let result;

  try {
    await deleteTransaction(transaction.id, userId, 'budget');
    result = await addTransaction(transaction, userId, 'budget');
  } catch (e) {
    console.error(e);
  }

  if (!result) {
    response.status(500);
    response.send();

    return;
  }

  response.json(result);
};

exports.updateBudgetTransaction = updateBudgetTransaction;
