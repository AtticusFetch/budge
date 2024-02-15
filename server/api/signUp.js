const {
  CognitoUserPool,
  CognitoUserAttribute,
} = require('amazon-cognito-identity-js');

const poolData = {
  UserPoolId: 'us-east-2_pn7gQHo7F',
  ClientId: '4ufjsimo5bhv3k1u5hu3k486nd',
};

const userPool = new CognitoUserPool(poolData);

const signUpUser = async (request, response) => {
  const { email, password, username } = request.body;
  // validate input ^^^
  const attributeList = [];

  const dataEmail = {
    Name: 'email',
    Value: email,
  };

  const attributeEmail = new CognitoUserAttribute(dataEmail);

  attributeList.push(attributeEmail);

  userPool.signUp(username, password, attributeList, null, (err, result) => {
    if (err) {
      response.json(err);
      console.log(err);
      return;
    }
    const cognitoUser = result.user;
    const user = {
      username: cognitoUser.getUsername(),
    };
    response.json(user);
  });
};

exports.signUpUser = signUpUser;
