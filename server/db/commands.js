const {
  GetCommand,
  UpdateCommand,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');

const { ddbClient } = require('./client');
const { TABLE_NAMES } = require('./constants');

const getDBUserById = (id) => {
  const command = new GetCommand({
    TableName: TABLE_NAMES.USERS,
    Key: {
      id,
    },
  });

  return ddbClient.send(command);
};

const getCategoryById = (id) => {
  const command = new GetCommand({
    TableName: TABLE_NAMES.CATEGORIES,
    Key: {
      id,
    },
  });

  return ddbClient.send(command);
};

const getAllItems = (tableName) => {
  const command = new ScanCommand({
    TableName: tableName,
  });

  return ddbClient.send(command);
};

const removeListItemByIdx = (id, listName, idx) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAMES.USERS,
    Key: { id },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: `REMOVE ${listName}[${idx}]`,
  });

  return ddbClient.send(command);
};

const addUserAttribute = (id, attrName, value) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAMES.USERS,
    Key: { id },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: `SET ${attrName} = :item`,
    ExpressionAttributeValues: {
      ':item': value,
    },
  });

  return ddbClient.send(command);
};

const deleteUserAttribute = (id, attrName) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAMES.USERS,
    Key: { id },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: `REMOVE ${attrName}`,
  });

  return ddbClient.send(command);
};

const addListItem = (id, listName, item) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAMES.USERS,
    Key: { id },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: `set #${listName} = list_append(if_not_exists(#${listName}, :empty_list), :item)`,
    ExpressionAttributeNames: {
      [`#${listName}`]: `${listName}`,
    },
    ExpressionAttributeValues: {
      ':item': item instanceof Array ? item : [item],
      ':empty_list': [],
    },
  });

  return ddbClient.send(command);
};

module.exports.getCategoryById = getCategoryById;
module.exports.addListItem = addListItem;
module.exports.removeListItemByIdx = removeListItemByIdx;
module.exports.getDBUserById = getDBUserById;
module.exports.addUserAttribute = addUserAttribute;
module.exports.deleteUserAttribute = deleteUserAttribute;
module.exports.getAllItems = getAllItems;
