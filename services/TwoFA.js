const db = require("../db");
const QRCode = require("qrcode");
const speakeasy = require("speakeasy");
const mailer = require("./mailer");
const ejs = require("./ejs");
const uuid = require("uuid");
const validator = require("validator");
//validator.isEmail('foo@bar.com'); //=> true
const ACCOUNTS = "accounts";

class TwoFA {


  async count() {
    try {
      let count = await db(ACCOUNTS).count("id as accounts").first();
      return { success: true, ...count };
    } catch (e) {
      return {
        success: false,
        code: "DB_ERR",
        message: "Faield to fetch counts of accounts",
      };
    }
  }

  async activate(email,activationCode) {
    const result =  await db(ACCOUNTS).select("*").where("email","=",email).first();

    if(result.activation_code != activationCode) {
        console.log("activate:ACTIVATION_ERROR:",result);
        await this.upsertUser(email,"ACTIVATION_ERROR" );
        await db("scans").insert({
          email: email,
          status: 0,
          status_code :"ACTIVATION_ERROR - EMAIL INITIATOR"
        }).catch(e=>console.error("insert scans error - in activation",e));

        return { success: true };
    }
 
    await this.register(email,0);
    return { success: true };
  }

  async createSecret(email) {
    try {
      let activationCode = uuid.v4();
      await this.upsertUser(email,activationCode );
      const mailBody = await ejs.renderTemplate("register_2fa", {
        link:
          "https://udifili.com/api/activate?activationCode=" +
          activationCode +
          "&email=" +
          email,
      });
      const mailResult = await mailer.sendMail(
        email,
        null,
        "Register new 2FA service",
        mailBody
      );
      return { success: true };
    } catch (e) {
      console.error(e);
      return {
        httpCode: 403,
        success: false,
        code: "MAILER_ERROR",
        message: e.stack,
      };
    }
  }


  async upsertUser(email, activationCode,activated=0) {
    try {
      const row = await db("accounts")
        .select("*")
        .where("email", "=", email)
        .first();
      let result;
      if (row) {
        result = await db("accounts")
          .update({
            activation_code: activationCode,
          })
          .where("email", email);
      } else {
        result = await db("accounts").insert({
          email: email,
          activation_code: activationCode
        });
      }
      return { success: true, result: result };
    } catch (e) {
      return {
        httpCode: 403,
        success: false,
        code: "REGISTER_ERROR",
        message: e.stack,
      };
    }
  }

  async register(email, activated=0) {
    const secret = speakeasy.generateSecret({
      length: 20,
      name: "Difuzia 2FA",
    });
    try {
      const row = await db("accounts")
        .select("*")
        .where("email", "=", email)
        .first();
      let result;
      if (row) {
        result = await db("accounts")
          .update({
            secret: secret.base32,
            qrcode: secret.otpauth_url,
            activation_code: null,
            scans: 0,
            activated:activated
          })
          .where("email", email);
      } else {
        result = await db("accounts").insert({
          email: email,
          secret: secret.base32,
          qrcode: secret.otpauth_url,
          activation_code: null,
          scans: 0,
          activated:activated
        });
      }
      await db("scans").insert({
        email: email,
        status: 1,
        status_code:"SUCCESS"
      }).catch(e=>console.error("insert scans error",e));

      return { success: true, result: result };
    } catch (e) {
      await db("scans").insert({
        email: email,
        status: 0,
        status_code:"REGISTER_ERROR"
      }).catch(err=>console.error("insert scans error",err));
      return {
        httpCode: 403,
        success: false,
        code: "REGISTER_ERROR",
        message: e.stack,
      };
    }
  }

  async verify(email, token) {
    let row = await db("accounts")
      .select("*")
      .where("email", "=", email)
      .first();
    if (!row) {
      await db("verifications").insert({
        email: email,
        status: 0,
        status_code:"NOT_FOUND"
      }).catch(err=>console.error("insert verifications error",err));

      return {
        httpCode: 403,
        success: false,
        code: "NOT_FOUND",
        message: "Email not found",
      };
    }

    const verified = speakeasy.totp.verify({
      secret: row.secret,
      encoding: "base32",
      token: token,
    });

    if (verified) {
      console.log("verified successfuly :", email, "with code:", token);
      await db("accounts").update({ verified_once: "Y" }).where("email", email);
      await db("verifications").insert({
        email: email,
        status: 1,
        status_code:"SUCCESS"
      }).catch(err=>console.error("insert verifications error",err));

      return { success: true };
    } else {
      console.log("Failed to verify ", email, "with code:", token);
      await db("verifications").insert({
        email: email,
        status: 0,
        status_code:"VERIFY_ERROR"
      }).catch(err =>console.error("insert verifications error",err));


      return {
        httpCode: 403,
        success: false,
        code: "VERIFY_ERROR",
        message: "Cannot verify the token , please try again",
      };
    }
  }

  qrToDataUrl(qrcode) {
  const promise = new Promise(function(resolve, reject)  {
      QRCode.toDataURL(qrcode, function (err, dataUrl) {
        if (err) return reject(err);
        return resolve(dataUrl);
      });
  });

    return promise ;
  }

  async qrcode(email) {
    try {
      let row = await 
        db("accounts")
        .select("*")
        .where("email", "=", email)
        .first();
        console.log("row:", row);
      if (!row) {
         console.log("qrcode NOT FOUND:",row);
         await db("scans").insert({
          email: email,
          status: 0,
          status_code:"NOT_FOUND"
        }).catch(err => console.error("insert scans error",err));

         return {success:false,code:"NOT_FOUND",message:'Email not found'};
      }
      if(row.activation_code == "ACTIVATION_ERROR") {
        await db("scans").insert({
          email: email,
          status: 0,
          status_code:"ACTIVATION_ERROR - SITE INITIATOR"
        }).catch(err => console.error("insert scans error",err));

        console.log("qrcode ACTIVATION_ERROR:",row);
        return {
          httpCode: 403,
          success: false,
          code: "ACTIVATION_ERROR",
          message: "ACTIVATION_ERROR"
        };
      }
	    
      if (row.scans > 0) {
        console.log("qrcode ALREADY_REGISTERED:",row);
        await db("scans").insert({
          email: email,
          status: 0,
          status_code:"ALREADY_REGISTERED"
        }).catch( err => console.error("insert scans error",err));

        return {
          httpCode: 403,
          success: false,
          code: "ALREADY_REGISTERED",
          message:
            "You can scan your barcode only one time , please register again if you need new registration",
        };
      }
      if (false && row.activated != 1) {
        return {
          httpCode: 403,
          success: false,
          code: "NOT_ACTIVATED",
          message:
            "You didnt activate your registration  , look at you mail box for further instructions",
        };
      }

      await db("accounts").update({ scans:row.scans+1 }).where("email", email);
      const dataUrl = await this.qrToDataUrl(row.qrcode);
      await db("scans").insert({
        email: email,
        status: 1,
        status_code:"SUCCESS"
      }).catch( err => console.error("insert scans error",err));

      return { success: true, dataUrl: dataUrl };
    } catch (e) {
      console.error("QRCODE_ERROR:",e)
      await db("scans").insert({
        email: email,
        status: 0,
        status_code:"QRCODE_ERROR"
      }).catch(err => console.error("insert scans error",err));

      return {
        httpCode: 403,
        success: false,
        code: "QRCODE_ERROR",
        message: "Failed to generate qr code :"+e.stack,
      };
    }
  }
}

module.exports = new TwoFA();
