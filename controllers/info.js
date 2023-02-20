const TwoFA = require("../services/TwoFA");

async function info(req, res) {
  let result = await TwoFA.count();
  if (result.success === false)
    return res.status(result.httpCode || 403).json(result);
  return res.json(result);
}

module.exports = {
  info: info,
};
