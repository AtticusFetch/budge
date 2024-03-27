const { deleteTransaction } = require('../db/utils');

const deleteBudgetLink = async (request, response) => {
  const { linkId, userId } = request.body;
  let result;

  try {
    result = await deleteTransaction(linkId, userId, 'manualLinks');
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

exports.deleteBudgetLink = deleteBudgetLink;
