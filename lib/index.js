// const moment = require('moment');

/**
 * take the request, extract the log information and send it
 *
 * curl -X GET http://localhost:30000/api/ping
 */
exports.sendLog = (req, res) => {
  console.log(req.body);
  res.status(200).send();
};
