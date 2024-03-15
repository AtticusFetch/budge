const { addTransaction } = require('../db/utils');

const createBudgetTransaction = async (request, response) => {
  const { transaction, userId } = request.body;
  let result;

  try {
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

exports.createBudgetTransaction = createBudgetTransaction;
