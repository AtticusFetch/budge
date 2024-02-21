const { addUserAttribute } = require('../db/commands');

const postUserBudget = async (request, response) => {
  const { budget, userId } = request.body;

  try {
    const result = await addUserAttribute(userId, 'budget', budget);

    response.json(result.Attributes);
  } catch (e) {
    response.status(500);
    response.json({ error: e });
  }
};

exports.postUserBudget = postUserBudget;
