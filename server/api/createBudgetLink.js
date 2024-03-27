const { v4: uuidv4 } = require('uuid');

const { getDBUserById, addListItem } = require('../db/commands');
const { addTransaction } = require('../db/utils');

const createBudgetLink = async (request, response) => {
  const { linkData, userId } = request.body;
  let result;
  const { budgetId } = linkData;
  const user = (await getDBUserById(userId)).Item;
  const targetBudget = user.budget?.find((b) => b.id === budgetId);

  try {
    let createBudgetResult;
    if (!user?.categoryBudget?.find((b) => b.id === targetBudget.id)) {
      createBudgetResult = await addTransaction(
        targetBudget,
        userId,
        'categoryBudget',
      );
    }
    const uniqueLink = {
      ...linkData,
      id: uuidv4(),
    };
    const budgetLinkResult = await addListItem(
      userId,
      'manualLinks',
      uniqueLink,
    );
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
