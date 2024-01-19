'use strict';

// read env vars from .env file
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const { createLinkToken } = require('./api/createLinkToken');
const { exchangeToken } = require('./api/exchangeToken');
const { getTransactions } = require('./api/getTransactions');
const { getUsers } = require('./api/getUsers');
const { postInfo } = require('./api/info');
const { postUser } = require('./api/postUser');
const { postUserBudget } = require('./api/postUserBudget');
const { prettyPrintResponse } = require('./utils');

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

app.get('/api/users', getUsers);

app.post('/api/user', postUser);

app.post('/api/budget', postUserBudget);

app.post('/api/exchange', exchangeToken);

app.use('/api', function (error, request, response, next) {
  prettyPrintResponse(error.response);
  response.json(formatError(error.response));
});

const server = app.listen(APP_PORT, function () {
  console.log('listening on port ' + APP_PORT);
});

const formatError = (error) => {
  return {
    error: { ...error.data, status_code: error.status },
  };
};
