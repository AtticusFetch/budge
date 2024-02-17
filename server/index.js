'use strict';

// read env vars from .env file
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const { authenticateUser } = require('./api/authenticateUser');
const { confirmUser } = require('./api/confirmUser');
const { createLinkToken } = require('./api/createLinkToken');
const { createUser } = require('./api/createUser');
const { createUserTransaction } = require('./api/createUserTransaction');
const { exchangeToken } = require('./api/exchangeToken');
const { getCategories } = require('./api/getCategories');
const { getTransactions } = require('./api/getTransactions');
const { getTransactionsForMonth } = require('./api/getTransactionsForMonth');
const { getUserById } = require('./api/getUserById');
const { postInfo } = require('./api/info');
const { postUser } = require('./api/postUser');
const { postUserBudget } = require('./api/postUserBudget');
const { signUpUser } = require('./api/signUp');
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
app.post('/api/user/verify', verifyUser);

app.post('/api/user/transaction/create', createUserTransaction);

app.post('/api/budget', postUserBudget);

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
