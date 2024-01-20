const { getUsersFromDb } = require('../db');

const getUsers = async (request, response) => {
  const dbUsers = await getUsersFromDb();
  const users = [];
  dbUsers.forEach((u) => {
    const { transactions, ...rest } = u;
    users.push(rest);
  });
  response.json(users);
};

exports.getUsers = getUsers;
