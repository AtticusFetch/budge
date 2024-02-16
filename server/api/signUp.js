const { CognitoUserAttribute } = require('amazon-cognito-identity-js');

const { USER_POOL } = require('../auth/userPool');

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

  USER_POOL.signUp(username, password, attributeList, null, (err, result) => {
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
