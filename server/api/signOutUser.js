const { CognitoUser } = require('amazon-cognito-identity-js');

const { USER_POOL } = require('../auth/userPool');

const signOutUser = async (request, response) => {
  const { username } = request.body;
  // validate input ^^^

  const userData = {
    Username: username,
    Pool: USER_POOL,
  };
  const cognitoUser = new CognitoUser(userData);

  cognitoUser.signOut(() => {
    response.send({ ok: true });
  });
};

exports.signOutUser = signOutUser;
