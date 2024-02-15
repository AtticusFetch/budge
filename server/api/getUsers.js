const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-2' });
const docClient = DynamoDBDocumentClient.from(client);

const getUsers = async (request, response) => {
  const input = {
    TableName: 'Users',
  };
  const command = new ScanCommand(input);
  // const dbUsers = await getUsersFromDb();
  const dbUsers = await docClient.send(command);
  const users = [];
  dbUsers.Items.forEach((u) => {
    const { transactions, ...rest } = u;
    users.push(rest);
  });
  response.json(users);
};

exports.getUsers = getUsers;
