const { getDBUserById } = require('../db/commands');

const getUserById = async (request, response) => {
  const { id } = request.params;
  let user;

  try {
    user = await getDBUserById(id);
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
