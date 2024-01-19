const { getUserById, updateUser } = require('../db');

const postUserBudget = async (request, response) => {
  const { budget, userId } = request.body;

  const user = await getUserById(userId);
  user.budget = budget;
  await updateUser(user);

  response.json(user);
};

exports.postUserBudget = postUserBudget;
