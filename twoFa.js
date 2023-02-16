const QRCode = require('qrcode');
const speakeasy = require('speakeasy');
const mailer = require('./mailer');
const ejs = require('./ejs');


function validateEmail(input) { 
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex))
      return true;
    return false;
}

async function renewSecret(req,res) { 
 let email  = req.body.email || req.query.email ;

 if(!email)
      return res.status(403).json({success:false,code:"MISSING_EMAIL",message:'missing email address'});
  if(!validateEmail(email)) 
      return res.status(403).json({success:false,code:"INVALID_EMAIL",message:'Invalid email address'});
   
   try { 
	const mailBody  = await ejs.renderFile('./templates/register_2fa.ejs',{});
      	//const mailResult = await mailer.sendMail(email,null,"Register new 2FA service","<a href='https://udifili.com/api/register?email=" + email +"'>Create new 2FA registration</a>");
      	const mailResult = await mailer.sendMail(email,null,"Register new 2FA service",mailBody);
       	console.log(mailResult);
      return res.json({success:true});
   }  catch(e) { 
   	return res.status(403).json({success:false,code:"MAILER_ERROR",message:e.stack});
   }
	
}

async function register(req,res) {
  let email  = req.body.email || req.query.email ;
 if(!email)
      return res.status(403).json({success:false,code:"MISSING_EMAIL",message:'missing email address'});
  if(!validateEmail(email)) 
      return res.status(403).json({success:false,code:"INVALID_EMAIL",message:'Invalid email address'});

  const secret = speakeasy.generateSecret({ length: 20 ,name:'Difuzia 2FA' });
	 let row ;
    //  row  = await req.app.locals.db.raw('delete from accounts');
	console.log(await req.app.locals.db('accounts').select('*').where('email','=', email));
     row  = await req.app.locals.db('accounts').select('*').where('email','=',email).first();
    let result ; 
    if (row) {
       result = await req.app.locals.db('accounts').update({secret:secret.base32 , qrcode:secret.otpauth_url}).where('email',email);
    } else { 
       result  = await req.app.locals.db('accounts').insert({email:email,secret:secret.base32 , qrcode:secret.otpauth_url}); 
    }
	return res.json({result:result});

    
}


async function verify(req, res) {
  const secret = speakeasy.generateSecret({ length: 20 ,name:'Difuzia 2FA'});

  if(!req.body.email) 
     return  res.json({success:false,message:'Missing email in body url'});

   let row  = await req.app.locals.db('accounts').select('*').where('email','=',req.body.email).first();
    if (!row) {
	     console.log("user not found:",req.body.email);
      await req.app.locals.db('accounts').insert({email:req.body.email,secret:secret.base32 , qrcode:secret.otpauth_url}); 
      return res.status(401).json({success:false,code:"NOT_FOUND",message:'Email not found'});
    }

    const verified = speakeasy.totp.verify({
      secret: row.secret,
      encoding: 'base32',
      token: req.body.token
    });

    if (verified) {
    console.log("verified successfuly :",req.body.email , "with code:",req.body.token);
      await req.app.locals.db('accounts').update({verified_once:"Y"}).where('email',req.body.email); 
      return res.json({'success':true});
    } else {
	    console.log("Failed to verify ",req.body.email, "with code:",req.body.token);
      return res.status(401).json({'success':false,code:"VERIFY_ERROR" ,message:'Cannot verify the token , please try again'});
    }
};


async function qrcode(req,res) { 
   if(!req.body.email) 
       return res.status(403).json({success:false,code:"MISSING_EMAIL",message:'missing email address'});

     let row  = await req.app.locals.db('accounts').select('*').where('email','=',req.body.email).first();

    if (!row) {
	    return register(req,res);
      return res.status(401).json({success:false,code:"NOT_FOUND",message:'Email not found'});
    }
    if(row.verified_once == "Y") { 
           return res.status(401).send('You can register your barcode only one time , please register again if you need new registration');
    }	
		
        QRCode.toDataURL(row.qrcode,function(err,dataUrl) {
            res.json({success:true,qr:'<img src='+ dataUrl +'>'});
    });
}

module.exports = { 
	 qrcode,
	 register , 
	 verify  ,
	 renewSecret
}

