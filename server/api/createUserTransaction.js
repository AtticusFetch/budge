const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const { ddbClient } = require('../db/client');
const { TABLE_NAMES } = require('../db/constants');

const createUserTransaction = async (request, response) => {
  const { transaction, userId } = request.body;
  const uniqueTransaction = {
    ...transaction,
    id: uuidv4(),
  };
  let result;
  const putCommand = new UpdateCommand({
    TableName: TABLE_NAMES.USERS,
    Key: { id: userId },
    ReturnValues: 'ALL_NEW',
    UpdateExpression:
      'set #transactions = list_append(if_not_exists(#transactions, :empty_list), :transaction)',
    ExpressionAttributeNames: {
      '#transactions': 'transactions',
    },
    ExpressionAttributeValues: {
      ':transaction': [uniqueTransaction],
      ':empty_list': [],
    },
  });

  try {
    result = await ddbClient.send(putCommand);
  } catch (e) {
    console.error(e);
  }

  if (!result) {
    response.status(500);
    response.send();

    return;
  }

  response.json(result.Attributes);
};

exports.createUserTransaction = createUserTransaction;
