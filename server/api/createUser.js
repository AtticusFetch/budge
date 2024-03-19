const { PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const { ddbClient } = require('../db/client');
const { TABLE_NAMES } = require('../db/constants');

const createUser = async (request, response) => {
  const { username, id } = request.body;
  let newUserResult;
  const putCommand = new PutCommand({
    TableName: TABLE_NAMES.USERS,
    Item: {
      username,
      transactions: [],
      id,
    },
  });
  // TODO probably just need to supply return values to previous command
  const getCommand = new GetCommand({
    TableName: TABLE_NAMES.USERS,
    Key: {
      id,
    },
  });

  try {
    await ddbClient.send(putCommand);
  } catch (e) {
    console.error(e);
  }

  try {
    newUserResult = await ddbClient.send(getCommand);
  } catch (e) {
    console.error(e);
  }

  if (!newUserResult.Item) {
    response.status(500);
    response.send();

    return;
  }

  response.json(newUserResult.Item);
};

exports.createUser = createUser;
