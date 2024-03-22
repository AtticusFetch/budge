const { addTransaction } = require('../db/utils');

const createBudgetCategory = async (request, response) => {
  const { categoryBudget, userId } = request.body;
  let result;

  try {
    result = await addTransaction(categoryBudget, userId, 'categoryBudget');
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