const { CognitoUserPool } = require('amazon-cognito-identity-js');

const { POOL_DATA } = require('./config');

const USER_POOL = new CognitoUserPool(POOL_DATA);

module.exports.USER_POOL = USER_POOL;
