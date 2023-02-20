const db = require('../db');
const QRCode = require('qrcode');
const speakeasy = require('speakeasy');
const mailer = require('./mailer');
const ejs = require('./ejs');
const uuid = require('uuid') ;
const validator = require('validator');
//validator.isEmail('foo@bar.com'); //=> true


class TwoFA {

async activate(activationCode,email) { 
  return {success:true};
}

async renewSecret(email) { 
  try {
   let activationCode = uuid.v4() ;
      let result = await  this.register(email,activationCode);
	  if(result.success === false) 
		  return result;

      const mailBody  = await ejs.renderTemplate('register_2fa',{link:"https://udifili.com/api/activate?activationCode="+activationCode+"&email="+email});
      const mailResult = await mailer.sendMail(email,null,"Register new 2FA service",mailBody);
      return {success:true};
   }  catch(e) { 
	   console.error(e);
      return {httpCode:403,success:false,code:"MAILER_ERROR",message:e.stack};
   }
	
}

async register(email,activationCode) {
    const secret = speakeasy.generateSecret({ length: 20 ,name:'Difuzia 2FA' });
    try { 
      const  row  = await db('accounts').select('*').where('email','=',email).first();
      let result ; 
      if (row) {
         result = await db('accounts').update({secret:secret.base32 , qrcode:secret.otpauth_url,activation_code:activationCode}).where('email',email);
      } else { 
         result  = await db('accounts').insert({email:email,secret:secret.base32 , qrcode:secret.otpauth_url,activation_code:activationCode}); 
      }
        return {success:true,result:result};
      } catch(e) { 
  	 return {httpCode:403,success:false,code:"REGISTER_ERROR",message:e.stack};
      }
}


async verify(email, token) {
     const secret = speakeasy.generateSecret({ length: 20 ,name:'Difuzia 2FA'});
     let row  = await db('accounts').select('*').where('email','=',email).first();
     if (!row) {
      return {httpCode:403,success:false,code:"NOT_FOUND",message:'Email not found'};
    }

    const verified = speakeasy.totp.verify({
      secret: row.secret,
      encoding: 'base32',
      token: token
    });

    if (verified) {
      console.log("verified successfuly :",email , "with code:",token);
      await db('accounts').update({verified_once:"Y"}).where('email',email); 
      return res.json({'success':true});
    } else {
	    console.log("Failed to verify ",email, "with code:",token);
      return {httpCode:403,'success':false,code:"VERIFY_ERROR" ,message:'Cannot verify the token , please try again'};
    }
};


async qrToDataUrl(qrcode) { 
	return new Promise(function(resolve,reject) { 
	    QRCode.toDataURL(row.qrcode,function(err,dataUrl) {
		    if(err) reject(err);
                return resolve(dataUrl);
            });
	})
}
async qrcode(email) { 

     try {
       let row  = await req.app.locals.db('accounts').select('*').where('email','=',email).first();
     console.log("row:",row);
     if (!row) {
      return register(email);
     // return res.status(401).json({success:false,code:"NOT_FOUND",message:'Email not found'});
     }
     if(row.verified_once == "Y") { 
           return {httpCode:403,success:false,code:"ALREADY_REGISTERED",message:'You can register your barcode only one time , please register again if you need new registration'};
     }	
	const dataUrl = await this.qrToDataUrl(row.qrcode);
        return res.json({success:true,dataUrl:dataUrl});
     } catch(e) {
           return {httpCode:403,success:false,code:"QRCODE_ERROR",message:'Failed to generate qr code'};

     }
}
}

module.exports = new TwoFA();

