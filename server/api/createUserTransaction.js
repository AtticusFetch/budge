const { addTransaction } = require('../db/utils');

const createUserTransaction = async (request, response) => {
  const { transaction, userId } = request.body;
  let result;

  try {
    result = await addTransaction(transaction, userId);
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

exports.createUserTransaction = createUserTransaction;
