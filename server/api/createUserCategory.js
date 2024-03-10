const { addCategory } = require('../db/utils');

const createUserCategory = async (request, response) => {
  const { category, userId } = request.body;
  let result;

  try {
    result = await addCategory(category, userId);
  } catch (e) {
    console.error(e);
  }

  if (!result) {
    response.status(500);
    response.send();

    return;
  }

  response.json(result);
};

exports.createUserCategory = createUserCategory;
