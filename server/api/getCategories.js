const { getAllItems } = require('../db/commands');
const { TABLE_NAMES } = require('../db/constants');

const getCategories = async (request, response) => {
  let categories;

  try {
    categories = await getAllItems(TABLE_NAMES.CATEGORIES);
  } catch (e) {
    console.error(e);
  }

  if (!categories?.Items) {
    response.status(500);
    response.send();

    return;
  }

  response.json(categories?.Items);
};

exports.getCategories = getCategories;
