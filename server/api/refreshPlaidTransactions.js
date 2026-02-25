const { plaidClient } = require('../config');
const { getDBUserById } = require('../db/commands');
const { fetchPlaidTransactions } = require('../db/utils');

const refreshPlaidTransactions = async (request, response) => {
  const { userId } = request.params;
  const userDb = await getDBUserById(userId);
  const user = userDb?.Item;
  let result;
  try {
    for (const item of user.plaidItems || []) {
      await plaidClient().transactionsRefresh({
        access_token: item.accessToken,
      });
    }
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
