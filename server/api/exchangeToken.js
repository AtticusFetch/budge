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
    const accountsResponse = await plaidClient().accountsGet(itemRequest);
    const itemResponse = await plaidClient().itemGet(itemRequest);
    const accounts = accountsResponse.data.accounts;
    const item = itemResponse.data.item;
    let institution = {};
    if (item.institution_id) {
      const institutionResponse = await plaidClient().institutionsGetById({
        institution_id: item.institution_id,
        country_codes: ['US'],
      });
      institution = institutionResponse.data.institution;
    }
    const newItem = {
      accessToken,
      itemId,
      item,
      accounts,
      institution,
    };
    const newUser = await addListItem(userId, 'plaidItems', newItem);
    response.json(newUser?.Attributes);
  } catch (err) {
    console.error('Exchange error', err);
  }
};

exports.exchangeToken = exchangeToken;
