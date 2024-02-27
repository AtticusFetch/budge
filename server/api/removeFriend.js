const { getDBUserById, removeListItemByIdx } = require('../db/commands');

const removeFriendById = async (user, friendId) => {
  const friendToRemoveIdx = user?.friends?.findIndex((r) => r.id === friendId);

  if (friendToRemoveIdx < 0) {
    throw new Error('Friend Not Found');
  }

  const result = await removeListItemByIdx(
    user.id,
    'friends',
    friendToRemoveIdx,
  );

  return result;
};

const removeFriend = async (request, response) => {
  const { friendId, userId } = request.body;

  try {
    const removingUserDb = await getDBUserById(userId);
    const removingUser = removingUserDb?.Item;

    const result = await removeFriendById(removingUser, friendId);

    const friendToRemoveDb = await getDBUserById(friendId);
    const friendToRemove = friendToRemoveDb?.Item;

    await removeFriendById(friendToRemove, userId);

    response.json(result);
  } catch (e) {
    console.error(e);
    response.status(500);
    response.json({ error: e });
  }
};

exports.removeFriend = removeFriend;
