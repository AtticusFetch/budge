const { deleteTransaction } = require('../db/utils');

const deleteBudgetTransaction = async (request, response) => {
  const { transactionId, userId } = request.body;
  let result;

  try {
    result = await deleteTransaction(transactionId, userId, 'budget');
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

exports.deleteBudgetTransaction = deleteBudgetTransaction;
