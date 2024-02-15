const {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
} = require('amazon-cognito-identity-js');
const poolData = {
  UserPoolId: 'us-east-2_pn7gQHo7F',
  ClientId: '4ufjsimo5bhv3k1u5hu3k486nd',
};
const userPool = new CognitoUserPool(poolData);

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
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess(result) {
      const accessToken = result.getAccessToken().getJwtToken();

      response.json(accessToken);
    },

    onFailure(err) {
      alert(err.message || JSON.stringify(err));
    },
  });
};

exports.authenticateUser = authenticateUser;
