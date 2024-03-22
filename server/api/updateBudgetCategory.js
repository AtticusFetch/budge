const { deleteTransaction, addTransaction } = require('../db/utils');

const updateBudgetCategory = async (request, response) => {
  const { categoryBudget, userId } = request.body;
  let result;

  try {
    await deleteTransaction(categoryBudget.id, userId, 'categoryBudget');
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

exports.updateBudgetCategory = updateBudgetCategory;
