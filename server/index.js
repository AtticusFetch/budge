'use strict';

// read env vars from .env file
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const { acceptFriendRequest } = require('./api/acceptFriendRequest');
const { authenticateUser } = require('./api/authenticateUser');
const { confirmUser } = require('./api/confirmUser');
const { createBudgetTransaction } = require('./api/createBudgetTransaction');
const { createLinkToken } = require('./api/createLinkToken');
const { createUser } = require('./api/createUser');
const { createUserCategory } = require('./api/createUserCategory');
const { createUserTransaction } = require('./api/createUserTransaction');
const { declineFriendRequest } = require('./api/declineFriendRequest');
const { deleteBudgetTransaction } = require('./api/deleteBudgetTransaction');
const { deleteUserTransaction } = require('./api/deleteUserTransaction');
const { exchangeToken } = require('./api/exchangeToken');
const { getCategories } = require('./api/getCategories');
const { getTransactions } = require('./api/getTransactions');
const { getTransactionsForMonth } = require('./api/getTransactionsForMonth');
const { getUserById } = require('./api/getUserById');
const { postInfo } = require('./api/info');
const { postUser } = require('./api/postUser');
const { postUserBudget } = require('./api/postUserBudget');
const { removeFriend } = require('./api/removeFriend');
const { sendFriendRequest } = require('./api/sendFriendRequest');
const { signOutUser } = require('./api/signOutUser');
const { signUpUser } = require('./api/signUp');
const { updateBudgetTransaction } = require('./api/updateBudgetTransaction');
const { updateUserTransaction } = require('./api/updateUserTransaction');
const { verifyUser } = require('./api/verifyUser');

const APP_PORT = process.env.APP_PORT || 8000;

// Parameters used for the OAuth redirect Link flow.
//

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());
app.use(cors());

app.post('/api/info', postInfo);

app.post('/api/create_link_token', createLinkToken);

app.get('/api/transactions/:userId/:sync?', getTransactions);

app.get('/api/transactions/filter/:userId/:forMonth', getTransactionsForMonth);

app.get('/api/user/:id', getUserById);
app.get('/api/categories', getCategories);

app.post('/api/user', postUser);
app.post('/api/user/signup', signUpUser);
app.post('/api/user/confirm', confirmUser);
app.post('/api/user/authenticate', authenticateUser);
app.post('/api/user/create', createUser);
app.post('/api/user/category/create', createUserCategory);
app.post('/api/user/verify', verifyUser);
app.post('/api/user/signOut', signOutUser);

app.post('/api/user/friend', sendFriendRequest);
app.post('/api/user/friend/accept', acceptFriendRequest);
app.post('/api/user/friend/decline', declineFriendRequest);
app.post('/api/user/friend/remove', removeFriend);

app.post('/api/user/transaction/create', createUserTransaction);
app.post('/api/user/transaction/delete', deleteUserTransaction);
app.post('/api/user/transaction/update', updateUserTransaction);

app.post('/api/budget', postUserBudget);
app.post('/api/budget/transaction/create', createBudgetTransaction);
app.post('/api/budget/transaction/update', updateBudgetTransaction);
app.post('/api/budget/transaction/delete', deleteBudgetTransaction);

app.post('/api/exchange', exchangeToken);

app.use('/api', function (error, request, response, next) {
  response.json(formatError(error.response));
});

app.listen(APP_PORT, function () {
  console.log('listening on port ' + APP_PORT);
});

const formatError = (error) => {
  return {
    error: { ...error.data, status_code: error.status },
  };
};
