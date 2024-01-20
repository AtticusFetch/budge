const { plaidClient } = require('../config');
const { updateUser, getUserById } = require('../db');

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

const updateUserTransactions = (user, transactions) => {
  const { added, modified, removed } = transactions;
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
};

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
const getTransactions = async (request, response, next) => {
  const { userId, sync } = request.params;
  const user = await getUserById(userId);
  if (!sync) {
    response.json(user.transactions.added);
    return;
  }
  Promise.resolve()
    .then(async () => {
      const { items } = user;
      const allTransactions = await Promise.all(
        items.map(getTransactionsForItem),
      );
      return allTransactions;
    })
    .then((allTransactions) => {
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
      return mergedTransactions;
    })
    .then((transactions) => {
      updateUserTransactions(user, transactions);
      return transactions;
    })
    .then((transactions) => {
      response.json({
        added: transactions.added,
        modified: transactions.modified,
        removed: transactions.removed,
      });
    })
    .catch(next);
};

exports.getTransactions = getTransactions;
