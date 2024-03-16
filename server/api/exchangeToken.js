const { plaidClient } = require('../config');
const { addListItem } = require('../db/commands');

const exchangeToken = async (request, response) => {
  const {
    body: { userId },
  } = request;
  const exchangeRequest = {
    public_token: request.body.publicToken,
  };
  try {
    const exchangeResponse =
      await plaidClient().itemPublicTokenExchange(exchangeRequest);
    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;
    const itemRequest = {
      access_token: accessToken,
    };
    const itemResponse = await plaidClient().accountsGet(itemRequest);
    const accounts = itemResponse.data.accounts;
    const newItem = {
      accessToken,
      itemId,
      accounts,
    };
    const newUser = await addListItem(userId, 'plaidItems', newItem);
    response.json(newUser?.Attributes);
  } catch (err) {
    console.error('Exchange error', err);
  }
};

exports.exchangeToken = exchangeToken;
