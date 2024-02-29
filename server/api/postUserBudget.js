const { v4: uuidv4 } = require('uuid');

const { WEEKS_IN_MONTH } = require('../constants');
const { addUserAttribute } = require('../db/commands');

const transformBudgetData = (data) => {
  const allData = Object.keys(data).map((k) => ({
    name: k,
    amount:
      k === 'income'
        ? -parseFloat(data[k])
        : parseFloat(data[k]) / WEEKS_IN_MONTH,
    id: uuidv4(),
  }));

  const incomeData = allData.find((d) => d.name === 'income');
  const incomeDataIndex = allData.findIndex((d) => d.name === 'income');

  const splitData = {
    income: [incomeData],
    outcome: [...allData.toSpliced(incomeDataIndex, 1)],
  };

  return splitData;
};

const postUserBudget = async (request, response) => {
  const { budget, userId } = request.body;

  const transformedBudget = transformBudgetData(budget);

  try {
    const result = await addUserAttribute(userId, 'budget', transformedBudget);

    response.json(result.Attributes);
  } catch (e) {
    response.status(500);
    response.json({ error: e });
  }
};

exports.postUserBudget = postUserBudget;
