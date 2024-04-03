const { plaidClient } = require('../config');
const { getDBUserById } = require('../db/commands');
const { fetchPlaidTransactions } = require('../db/utils');

const refreshPlaidTransactions = async (request, response) => {
  const { userId } = request.params;
  const userDb = await getDBUserById(userId);
  const user = userDb?.Item;
  let result;
  try {
    await plaidClient().transactionsRefresh(request);
    result = await fetchPlaidTransactions(user.id, user.plaidItems);
  } catch (e) {
    console.error(e);
    response.status(500);
    response.send();
    return;
  }

  response.json(result);
};

exports.refreshPlaidTransactions = refreshPlaidTransactions;
