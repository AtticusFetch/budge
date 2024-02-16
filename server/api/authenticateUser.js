const {
  AuthenticationDetails,
  CognitoUser,
} = require('amazon-cognito-identity-js');

const { USER_POOL } = require('../auth/userPool');

const authenticateUser = async (request, response) => {
  const { password, username } = request.body;
  // validate input ^^^

  const authenticationData = {
    Username: username,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userData = {
    Username: username,
    Pool: USER_POOL,
  };
  const cognitoUser = new CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess(result) {
      const userInfo = { username };
      userInfo.token = result.getAccessToken().getJwtToken();
      cognitoUser.getUserAttributes(function (err, attributes) {
        if (err) {
          console.error(err.message || JSON.stringify(err));
          return;
        }
        const id = attributes.find((a) => a.getName() === 'sub').getValue();
        userInfo.id = id;

        response.json(userInfo);
      });
    },

    onFailure(err) {
      console.error(err.message || JSON.stringify(err));
    },
  });
};

exports.authenticateUser = authenticateUser;
