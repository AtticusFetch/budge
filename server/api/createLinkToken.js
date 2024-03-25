const { config, plaidClient } = require('../config');

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
const createLinkToken = async (request, response, next) => {
  try {
    const { userId } = request.body;
    const configs = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: userId,
      },
      client_name: 'Budge',
      products: config.PLAID_PRODUCTS,
      country_codes: config.PLAID_COUNTRY_CODES,
      language: 'en',
    };

    if (config.PLAID_REDIRECT_URI !== '') {
      configs.redirect_uri = config.PLAID_REDIRECT_URI;
    }

    if (config.PLAID_ANDROID_PACKAGE_NAME !== '') {
      configs.android_package_name = config.PLAID_ANDROID_PACKAGE_NAME;
    }
    const createTokenResponse = await plaidClient().linkTokenCreate(configs);
    response.json(createTokenResponse.data);
  } catch (e) {
    response.status(500);
    response.send(e);
  }
};

exports.createLinkToken = createLinkToken;
