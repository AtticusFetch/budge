const { CognitoJwtVerifier } = require('aws-jwt-verify');

const poolData = {
  userPoolId: 'us-east-2_pn7gQHo7F',
  clientId: '4ufjsimo5bhv3k1u5hu3k486nd',
};

const verifyUser = async (request, response) => {
  const { token } = request.body;
  const verifier = CognitoJwtVerifier.create({
    ...poolData,
    tokenUse: 'access',
  });

  try {
    const payload = await verifier.verify(token);
    response.json({ isValid: true });
  } catch (e) {
    console.log('Token not valid!', e);
    response.json({ isValid: false });
  }
};

exports.verifyUser = verifyUser;
