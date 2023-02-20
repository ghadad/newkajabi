const ejs = require("ejs");

const TEMPLATES_DIR = "templates";
class EJS {
  async renderFile(filename, data, options) {
    return new Promise((resolve, reject) => {
      ejs.renderFile(filename, data, options, function (err, str) {
        if (str) return resolve(str);
        if (err) return reject(err.message);
      });
    });
  }
  async renderTemplate(template, data, options) {
    return this.renderFile(
      TEMPLATES_DIR + "/" + template + ".ejs",
      data,
      options
    );
  }
}

module.exports = new EJS();
