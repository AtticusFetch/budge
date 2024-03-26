const { v4: uuidv4 } = require('uuid');

const { LINK_MODES } = require('../constants');
const { addListItem, getCategoryById } = require('../db/commands');
const { updateTransaction, getUserTransactionById } = require('../db/utils');

const changeCategoryMapping = async (request, response) => {
  const { changeData, userId } = request.body;
  let result;
  const { linkMode, newCategoryId, transactionId } = changeData;
  const newCategory = (await getCategoryById(newCategoryId))?.Item;

  switch (linkMode) {
    case LINK_MODES.TRANSACTION: {
      const transaction = await getUserTransactionById(userId, transactionId);
      result = await updateTransaction(
        {
          ...transaction,
          category: newCategory,
        },
        userId,
      );
      break;
    }
    case LINK_MODES.CATEGORY: {
      const linkData = {
        newCategoryId,
        categoryId: changeData.categoryId,
        id: uuidv4(),
      };
      result = await addListItem(userId, 'manualLinks', linkData);
      break;
    }
    case LINK_MODES.MERCHANT: {
      const linkData = {
        newCategoryId,
        merchantName: changeData.merchantName,
        id: uuidv4(),
      };
      result = await addListItem(userId, 'manualLinks', linkData);
      break;
    }
    case LINK_MODES.CATEGORY_MERCHANT: {
      const linkData = {
        newCategoryId,
        merchantName: changeData.merchantName,
        categoryId: changeData.categoryId,
        id: uuidv4(),
      };
      result = await addListItem(userId, 'manualLinks', linkData);
      break;
    }
  }

  try {
  } catch (e) {
    console.error(e);
  }

  if (!result) {
    response.status(500);
    response.send();

    return;
  }

  response.json(result);
};

exports.changeCategoryMapping = changeCategoryMapping;
