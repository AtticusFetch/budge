const { getUsersFromDb } = require('../db');

exports.getUsers = async (request, response) => {
  const dbUsers = await getUsersFromDb();
  response.json(dbUsers);
};
