const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

const { ddbClient } = require('../db/client');
const { TABLE_NAMES } = require('../db/constants');

const getCategories = async (request, response) => {
  let categories;
  const command = new ScanCommand({
    TableName: TABLE_NAMES.CATEGORIES,
  });

  try {
    categories = await ddbClient.send(command);
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
