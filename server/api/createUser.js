const { PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const { ddbClient } = require('../db/client');

const createUser = async (request, response) => {
  const { username } = request.body;
  const newId = uuidv4();
  let newUserResult;
  const putCommand = new PutCommand({
    TableName: 'Users',
    Item: {
      username,
      id: newId,
    },
  });
  const getCommand = new GetCommand({
    TableName: 'Users',
    Key: {
      id: newId,
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
