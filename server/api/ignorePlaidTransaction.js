const { updateTransaction } = require('../db/utils');

const ignorePlaidTransaction = async (request, response) => {
  const { transaction, userId } = request.body;
  let result;

  try {
    result = await updateTransaction(
      {
        ...transaction,
        plaidIgnored: !transaction.plaidIgnored,
      },
      userId,
      'plaidTransactions',
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

exports.ignorePlaidTransaction = ignorePlaidTransaction;
