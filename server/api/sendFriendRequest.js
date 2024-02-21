const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const { ddbClient } = require('../db/client');
const { addListItem } = require('../db/commands');
const { TABLE_NAMES } = require('../db/constants');

const sendFriendRequest = async (request, response) => {
  const { friendUsername, userId, username } = request.body;
  let friendUser;
  const getCommand = new ScanCommand({
    TableName: TABLE_NAMES.USERS,
    ExpressionAttributeValues: {
      ':username': friendUsername,
    },
    ExpressionAttributeNames: {
      '#ID': 'id',
      '#FL': 'friendRequests',
      '#U': 'username',
    },
    ProjectionExpression: '#ID, #FL, #U',
    FilterExpression: 'username = :username',
    Key: {
      username: friendUsername,
    },
  });

  try {
    const scanResult = await ddbClient.send(getCommand);
    if (scanResult?.Items?.length > 1) {
      throw new Error('Too many results');
    } else {
      friendUser = scanResult?.Items[0];
    }
  } catch (e) {
    console.error(e);
    response.status(500);
    response.json({ error: e });
    return;
  }
  const isSameUser = friendUser?.id && friendUser?.id === userId;
  if (isSameUser) {
    response.status(400);
    response.json({ error: { message: 'Same User', code: 1 } });
    return;
  }
  const alreadyExists = friendUser?.friendRequests?.some(
    (req) => req.from.id === userId,
  );
  if (alreadyExists) {
    response.status(400);
    response.json({ error: { message: 'Already Exists', code: 2 } });
    return;
  }
  const requestId = uuidv4();
  const addFriendRequestTo = {
    to: {
      id: friendUser?.id,
      username: friendUser?.username,
    },
    confirmed: false,
    id: requestId,
  };
  const addFriendRequestFrom = {
    from: {
      username,
      id: userId,
    },
    confirmed: false,
    id: requestId,
  };
  let result;

  try {
    result = await addListItem(userId, 'friendRequests', addFriendRequestTo);
    await addListItem(friendUser?.id, 'friendRequests', addFriendRequestFrom);
  } catch (e) {
    console.error(e);
    response.status(500);
    response.json({ error: e });
    return;
  }

  response.json(result.Attributes);
};

exports.sendFriendRequest = sendFriendRequest;
