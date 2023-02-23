require("dotenv").config();
const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const twofa = require("./controllers/twofa");
const info = require("./controllers/info");
const basePath = "/api";
async function startApp() {
  app.use(express.static("public"));

  app.post(basePath + "/verify", twofa.verify);
  app.post(basePath + "/register", twofa.register);
  app.post(basePath + "/qrcode", twofa.qrcode);
  app.post(basePath + "/renew-secret", twofa.renewSecret);
  app.post(basePath + "/renew-secret", twofa.renewSecret);
  app.get(basePath + "/activate", twofa.activate);
  app.get(basePath + "/info", info.info);

  const port = process.env.PORT || 3000;
  app.listen(port, "0.0.0.0", function () {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

startApp()
  .then(function () {
    console.log("App starting !");
  })
  .catch(function (e) {
    console.error(e);
  });
