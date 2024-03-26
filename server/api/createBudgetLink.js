const { getDBUserById, addListItem } = require('../db/commands');
const { addTransaction } = require('../db/utils');

const createBudgetLink = async (request, response) => {
  const { linkData, userId } = request.body;
  let result;
  const { budgetId } = linkData;
  const acceptingUser = (await getDBUserById(userId)).Item;
  const targetBudget = acceptingUser.budget?.find((b) => b.id === budgetId);

  try {
    const createBudgetResult = await addTransaction(
      targetBudget,
      userId,
      'categoryBudget',
    );
    const budgetLinkResult = await addListItem(userId, 'budgetLinks', linkData);
    result = {
      ...createBudgetResult,
      ...budgetLinkResult.Attributes,
    };
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

exports.createBudgetLink = createBudgetLink;
