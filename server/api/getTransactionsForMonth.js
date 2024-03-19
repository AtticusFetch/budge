const moment = require('moment');

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
const getTransactionsForMonth = async (request, response, next) => {
  // const { userId, forMonth } = request.params;
  // const targetDate = moment.utc(forMonth);
  // const user = await getUserById(userId);
  // const monthlyTransactions = user.transactions.added.filter((transaction) => {
  //   const transactionDate = moment.utc(transaction.date);
  //   return transactionDate.isSame(targetDate, 'month');
  // });
  // response.json(monthlyTransactions);
};

exports.getTransactionsForMonth = getTransactionsForMonth;
