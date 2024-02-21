const {
  getDBUserById,
  removeListItemByIdx,
  addListItem,
} = require('../db/commands');

const acceptFriendRequest = async (request, response) => {
  const { requestId, userId } = request.body;

  try {
    const acceptingUserDb = await getDBUserById(userId);
    const acceptingUser = acceptingUserDb?.Item;
    const acceptingRequest = acceptingUser?.friendRequests?.find(
      (r) => r.id === requestId,
    );
    const acceptingRequestIdx = acceptingUser?.friendRequests?.findIndex(
      (r) => r.id === requestId,
    );

    if (!acceptingRequest) {
      throw new Error('Accepting Request Not Found');
    }

    const senderUserDb = await getDBUserById(acceptingRequest?.from?.id);
    const senderUser = senderUserDb?.Item;
    const senderRequestIdx = senderUser?.friendRequests?.findIndex(
      (r) => r.id === requestId,
    );

    if (senderRequestIdx < 0) {
      throw new Error('Sender Request Not Found');
    }

    await removeListItemByIdx(
      acceptingUser.id,
      'friendRequests',
      acceptingRequestIdx,
    );

    await removeListItemByIdx(
      senderUser.id,
      'friendRequests',
      senderRequestIdx,
    );

    const result = await addListItem(acceptingUser.id, 'friends', {
      id: senderUser.id,
      username: senderUser.username,
    });

    await addListItem(senderUser.id, 'friends', {
      id: acceptingUser.id,
      username: acceptingUser.username,
    });

    response.json(result);
  } catch (e) {
    console.error(e);
    response.status(500);
    response.json({ error: e });
  }
};

exports.acceptFriendRequest = acceptFriendRequest;
