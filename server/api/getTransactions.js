const { plaidClient } = require('../config');
const { updateUser, getUserById } = require('../db');
const { prettyPrintResponse } = require('../utils');

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
exports.getTransactions = async (request, response, next) => {
  const user = await getUserById(request.params.userId);
  Promise.resolve()
    .then(async function () {
      // Set cursor to empty to receive all historical updates
      let cursor = user.cursor || null;

      // New transaction updates since "cursor"
      let added = [];
      let modified = [];
      // Removed transaction ids
      let removed = [];
      let hasMore = true;
      // Iterate through each page of new transaction updates for item
      while (hasMore) {
        const request = {
          access_token: user.accessToken,
          cursor,
        };
        const response = await plaidClient().transactionsSync(request);
        const data = response.data;
        // Add this page of results
        added = added.concat(data.added);
        modified = modified.concat(data.modified);
        removed = removed.concat(data.removed);
        hasMore = data.has_more;
        // Update cursor to the next cursor
        cursor = data.next_cursor;
        user.cursor = cursor;
        prettyPrintResponse(response);
      }
      if (!user.transactions) {
        user.transactions = {
          added: [],
          modified: [],
          removed: [],
        };
      }
      user.transactions.added = user.transactions.added.concat(added);
      user.transactions.modified = user.transactions.modified.concat(modified);
      user.transactions.removed = user.transactions.removed.concat(removed);
      updateUser(user);
      if (request.params.sync) {
        response.json({
          added,
          modified,
          removed,
        });
      } else {
        response.json(user.transactions.added);
      }
    })
    .catch(next);
};
