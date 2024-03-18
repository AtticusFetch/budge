const { plaidClient } = require('../config');
const {
  getDBUserById,
  addListItem,
  deleteUserAttribute,
} = require('../db/commands');

const getTransactionsForItem = async function (item) {
  let cursor = item.cursor || null;

  // New transaction updates since "cursor"
  let added = [];
  let modified = [];
  // Removed transaction ids
  let removed = [];
  let hasMore = true;
  // Iterate through each page of new transaction updates for item
  while (hasMore) {
    const request = {
      access_token: item.accessToken,
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
    item.cursor = cursor;
  }

  return {
    added,
    modified,
    removed,
  };
};

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
const getPlaidTransactions = async (request, response) => {
  try {
    const { userId, sync } = request.params;
    console.log('getPlaidTransactions', userId);
    const userDb = await getDBUserById(userId);
    const user = userDb?.Item;
    if (!sync) {
      response.json(user.plaidTransactions || []);
      return;
    }
    const { plaidItems } = user;
    const allTransactions = await Promise.all(
      plaidItems.map(getTransactionsForItem),
    );
    const mergedTransactions = allTransactions.reduce(
      (acc, curr) => {
        acc.added = [...acc.added, ...curr.added];
        acc.modified = [...acc.modified, ...curr.modified];
        acc.removed = [...acc.removed, ...curr.removed];
        return acc;
      },
      {
        added: [],
        modified: [],
        removed: [],
      },
    );
    await deleteUserAttribute(userId, 'plaidItems');
    await addListItem(userId, 'plaidItems', plaidItems);
    const result = await addListItem(
      userId,
      'plaidTransactions',
      mergedTransactions.added,
    );
    response.json(result?.Attributes);
  } catch (e) {
    console.error(e);
    response.status(500);
    response.send();
  }
};

exports.getPlaidTransactions = getPlaidTransactions;
