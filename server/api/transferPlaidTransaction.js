const { deleteTransaction, addTransaction } = require('../db/utils');

const transferPlaidTransaction = async (request, response) => {
  const { transaction, userId } = request.body;
  let addResult;
  let deleteResult;

  try {
    deleteResult = await deleteTransaction(
      transaction.id,
      userId,
      'plaidTransactions',
    );
    addResult = await addTransaction(transaction, userId);
  } catch (e) {
    console.error(e);
  }

  const result = {
    ...deleteResult,
    ...addResult,
  };

  if (!result) {
    response.status(500);
    response.send();

    return;
  }

  response.json(result);
};

exports.transferPlaidTransaction = transferPlaidTransaction;
