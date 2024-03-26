const { updateTransaction } = require('../db/utils');

const updateUserTransaction = async (request, response) => {
  const { transaction, userId } = request.body;
  let result;

  try {
    result = updateTransaction(transaction, userId);
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

exports.updateUserTransaction = updateUserTransaction;
