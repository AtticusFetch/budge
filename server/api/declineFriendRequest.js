const { getDBUserById, removeListItemByIdx } = require('../db/commands');

const declineFriendRequest = async (request, response) => {
  const { requestId, userId } = request.body;

  try {
    const decliningUserDb = await getDBUserById(userId);
    const decliningUser = decliningUserDb?.Item;
    const decliningRequest = decliningUser?.friendRequests?.find(
      (r) => r.id === requestId,
    );
    const decliningRequestIdx = decliningUser?.friendRequests?.findIndex(
      (r) => r.id === requestId,
    );

    if (!decliningRequest) {
      throw new Error('Accepting Request Not Found');
    }

    const senderUserDb = await getDBUserById(decliningRequest?.from?.id);
    const senderUser = senderUserDb?.Item;
    const senderRequestIdx = senderUser?.friendRequests?.findIndex(
      (r) => r.id === requestId,
    );

    if (senderRequestIdx < 0) {
      throw new Error('Sender Request Not Found');
    }

    const result = await removeListItemByIdx(
      decliningUser.id,
      'friendRequests',
      decliningRequestIdx,
    );

    await removeListItemByIdx(
      senderUser.id,
      'friendRequests',
      senderRequestIdx,
    );

    response.json(result);
  } catch (e) {
    console.error(e);
    response.status(500);
    response.json({ error: e });
  }
};

exports.declineFriendRequest = declineFriendRequest;
