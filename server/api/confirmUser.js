const { CognitoUserPool, CognitoUser } = require('amazon-cognito-identity-js');

const poolData = {
  UserPoolId: 'us-east-2_pn7gQHo7F',
  ClientId: '4ufjsimo5bhv3k1u5hu3k486nd',
};

const userPool = new CognitoUserPool(poolData);

const confirmUser = async (request, response) => {
  const { code, username } = request.body;
  // validate input ^^^

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);
  cognitoUser.confirmRegistration(code, true, function (err, result) {
    if (err) {
      response.json(err);
      console.error(err.message || JSON.stringify(err));
      return;
    }
    response.json(result);
  });
};

exports.confirmUser = confirmUser;
