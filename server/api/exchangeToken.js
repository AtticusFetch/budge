const { plaidClient } = require('../config');
const { getUserById, updateUser } = require('../db');

const exchangeToken = async (request, response) => {
  const user = await getUserById(request.body.userId);
  const exchangeRequest = {
    public_token: request.body.publicToken,
  };
  try {
    const exchangeResponse =
      await plaidClient().itemPublicTokenExchange(exchangeRequest);
    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;
    if (!user.items) {
      user.items = [];
    }
    user.items.push({
      accessToken,
      itemId,
    });
    updateUser(user);
    response.json(user);
  } catch (err) {
    console.error('Exchange error', err);
  }
};

exports.exchangeToken = exchangeToken;
