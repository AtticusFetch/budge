const { deleteTransaction } = require('../db/utils');

const deleteUserTransaction = async (request, response) => {
  const { transactionId, userId } = request.body;

  try {
    const result = await deleteTransaction(transactionId, userId);

    response.json(result);
  } catch (e) {
    console.error(e);
    response.status(500);
    response.json({ error: e });
  }
};

exports.deleteUserTransaction = deleteUserTransaction;
