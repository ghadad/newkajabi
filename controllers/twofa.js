const TwoFA = require("../services/TwoFA");
const v = require("validator");

async function activate(req, res) {
  const email = req.query.email;
  const activationCode = req.query.activationCode;

  if (!activationCode)
    return res.status(403).json({
      success: false,
      code: "MISSING_ACTIVATION_CODE",
      message: "missing activation code",
    });
  if (!email)
    return res.status(403).json({
      success: false,
      code: "MISSING_EMAIL",
      message: "missing email address",
    });
  if (!v.isEmail(email))
    return res.status(403).json({
      success: false,
      code: "INVALID_EMAIL",
      message: "Invalid email address",
    });

  let result = await TwoFA.activate(email);
  console.log(result);
  if (result.success === false)
    return res.status(result.httpCode || 403).json(result);
  return res.json(result);
}
async function renewSecret(req, res) {
  let email = req.query.email;

  if (!email)
    return res.status(403).json({
      success: false,
      code: "MISSING_EMAIL",
      message: "missing email address",
    });
  if (!v.isEmail(email))
    return res.status(403).json({
      success: false,
      code: "INVALID_EMAIL",
      message: "Invalid email address",
    });

  let result = await TwoFA.renewSecret(email);
  console.log(result);
  if (result.success === false)
    return res.status(result.httpCode || 403).json(result);

  return res.json(result);
}

async function register(req, res) {
  let email = req.body.email || req.query.email;
  if (!email)
    return res.status(403).json({
      success: false,
      code: "MISSING_EMAIL",
      message: "missing email address",
    });
  if (!v.isEmail(email))
    return res.status(403).json({
      success: false,
      code: "INVALID_EMAIL",
      message: "Invalid email address",
    });

  let result = await TwoFA.register(email);
  if (result.success === false)
    return res.status(result.httpCode || 403).json(result);
  return res.json(result);
}

async function verify(req, res) {
  if (!req.body.email)
    return res.json({ success: false, message: "Missing email in body url" });
  let result = await TwoFA.verify(req.body.email);
  if (result.success === false)
    return res.status(result.httpCode || 403).json(result);
  return res.json(result);
}

async function qrcode(req, res) {
  if (!req.body.email)
    return res.status(403).json({
      success: false,
      code: "MISSING_EMAIL",
      message: "missing email address",
    });

  let result = await TwoFA.qrcode(req.body.email);
  if (result.success === false)
    return res.status(result.httpCode || 403).json(result);
  return res.json(result);
}

module.exports = {
  activate,
  qrcode,
  register,
  verify,
  renewSecret,
};