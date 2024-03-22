const { deleteTransaction } = require('../db/utils');

const deleteBudgetCategory = async (request, response) => {
  const { categoryBudgetId, userId } = request.body;
  let result;

  try {
    result = await deleteTransaction(
      categoryBudgetId,
      userId,
      'categoryBudget',
    );
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

exports.deleteBudgetCategory = deleteBudgetCategory;
