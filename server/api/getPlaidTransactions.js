const { getDBUserById } = require('../db/commands');
const { fetchPlaidTransactions } = require('../db/utils');

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
const getPlaidTransactions = async (request, response) => {
  try {
    const { userId, sync } = request.params;
    const userDb = await getDBUserById(userId);
    const user = userDb?.Item;
    if (!sync) {
      response.json(user.plaidTransactions || []);
      return;
    }
    const result = await fetchPlaidTransactions(user.id, user.plaidItems);
    response.json(result);
  } catch (e) {
    console.error(e);
    response.status(500);
    response.send();
  }
};

exports.getPlaidTransactions = getPlaidTransactions;
