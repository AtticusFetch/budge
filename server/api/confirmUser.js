const { CognitoUser } = require('amazon-cognito-identity-js');

const { USER_POOL } = require('../auth/userPool');

const confirmUser = async (request, response) => {
  const { code, username } = request.body;
  // validate input ^^^

  const userData = {
    Username: username,
    Pool: USER_POOL,
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
