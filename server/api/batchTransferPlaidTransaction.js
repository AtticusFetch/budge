const { batchDeleteListItem, batchAddListItem } = require('../db/utils');

const batchTransferPlaidTransaction = async (request, response) => {
  const { transactions, userId } = request.body;
  let addResult;
  let deleteResult;

  try {
    deleteResult = await batchDeleteListItem(
      userId,
      transactions,
      'plaidTransactions',
    );
    addResult = await batchAddListItem(
      userId,
      transactions.map((t) => ({ ...t, transformedPlaid: true })),
      'transactions',
    );
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

exports.batchTransferPlaidTransaction = batchTransferPlaidTransaction;
