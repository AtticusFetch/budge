const { addTransaction } = require('../db/utils');

const createBudgetCategory = async (request, response) => {
  const { amount, category, userId } = request.body;
  let result;
  const item = {
    amount,
    category,
  };

  try {
    result = await addTransaction(item, userId, 'categoryBudget');
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

exports.createBudgetCategory = createBudgetCategory;
