const { GetCommand } = require('@aws-sdk/lib-dynamodb');

const { ddbClient } = require('../db/client');
const { TABLE_NAMES } = require('../db/constants');

const getUserById = async (request, response) => {
  const { id } = request.params;
  let user;
  const getCommand = new GetCommand({
    TableName: TABLE_NAMES.USERS,
    Key: {
      id,
    },
  });

  try {
    user = await ddbClient.send(getCommand);
  } catch (e) {
    console.error(e);
  }

  if (!user?.Item) {
    response.status(500);
    response.send();

    return;
  }

  response.json(user.Item);
};

exports.getUserById = getUserById;
