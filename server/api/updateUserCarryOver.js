const { addUserAttribute } = require('../db/commands');

const updateUserCarryOver = async (request, response) => {
  const { selection, userId } = request.body;
  let result;

  try {
    result = await addUserAttribute(userId, 'carryOverSelection', selection);
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

exports.updateUserCarryOver = updateUserCarryOver;
