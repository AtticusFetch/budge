const { CognitoJwtVerifier } = require('aws-jwt-verify');

const { POOL_DATA } = require('../auth/config');

const poolData = {
  userPoolId: POOL_DATA.UserPoolId,
  clientId: POOL_DATA.ClientId,
};

const verifyUser = async (request, response) => {
  const { token } = request.body;
  const verifier = CognitoJwtVerifier.create({
    ...poolData,
    tokenUse: 'access',
  });

  try {
    await verifier.verify(token);
    response.json({ isValid: true });
  } catch (e) {
    console.error('Token not valid!', e);
    response.json({ isValid: false });
  }
};

exports.verifyUser = verifyUser;
