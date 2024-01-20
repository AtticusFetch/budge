const util = require('util');

const prettyPrintResponse = (response) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};

exports.prettyPrintResponse = prettyPrintResponse;
