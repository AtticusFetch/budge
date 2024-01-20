const moment = require('moment');

const { getUserById } = require('../db');

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
const getTransactionsForMonth = async (request, response, next) => {
  const { userId, forMonth } = request.params;
  const targetDate = moment(forMonth);
  const user = await getUserById(userId);
  const monthlyTransactions = user.transactions.added.filter((transaction) => {
    const transactionDate = moment(transaction.date);
    return transactionDate.isSame(targetDate, 'month');
  });
  response.json(monthlyTransactions);
};

exports.getTransactionsForMonth = getTransactionsForMonth;
