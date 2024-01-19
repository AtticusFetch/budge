const { plaidClient } = require('../config');
const { getUserById, updateUser } = require('../db');

exports.exchangeToken = async (request, response) => {
  const user = await getUserById(request.params.userId);
  const exchangeRequest = {
    public_token: request.body.publicToken,
  };
  try {
    const response =
      await plaidClient().itemPublicTokenExchange(exchangeRequest);
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
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
