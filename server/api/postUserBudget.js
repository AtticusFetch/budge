const { v4: uuidv4 } = require('uuid');

const { WEEKS_IN_MONTH } = require('../constants');
const { addUserAttribute, getAllItems } = require('../db/commands');
const { TABLE_NAMES } = require('../db/constants');

const budgetToCategoryIdMap = {
  income: '9',
  rent: '7',
  sport: '8',
  carPayment: '10',
  carInsurance: '11',
  utilities: '6',
};

const transformBudgetData = (data, categories) => {
  const allData = Object.keys(data).map((k) => ({
    name: k,
    category: categories.find((c) => c.id === budgetToCategoryIdMap[k]),
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

  try {
    const categories = await getAllItems(TABLE_NAMES.CATEGORIES);

    const transformedBudget = transformBudgetData(budget, categories.Items);
    const result = await addUserAttribute(userId, 'budget', transformedBudget);

    response.json(result.Attributes);
  } catch (e) {
    response.status(500);
    response.json({ error: e });
  }
};

exports.postUserBudget = postUserBudget;
