const { readFileSync, writeFileSync } = require('fs');

const users = JSON.parse(readFileSync('./users.json'));

const writeUsersToDb = (data) => {
  writeFileSync('./users.json', JSON.stringify(data));
};

exports.writeUsersToDb = writeUsersToDb;

exports.getUsersFromDb = async () => {
  return users;
};

exports.getUserById = async (id) => {
  return users.find((u) => u.id === id);
};

exports.updateUser = async (targetUser) => {
  const indexToUpdate = users.findIndex((u) => u.id === targetUser.id);
  users.splice(indexToUpdate, 1, targetUser);
  writeUsersToDb(users);
};
