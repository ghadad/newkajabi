
const QRCode = require('qrcode');
const speakeasy = require('speakeasy');



async function register(req,res) {
  const secret = speakeasy.generateSecret({ length: 20 });
  if(!req.body.email) 
     return  res.send('Missing email in query url');

  await req.app.locals.db('accounts').insert({email:req.body.email,secret:secret.base32 , qrcode:secret.otpauth_url}); 
  console.log(`A row has been inserted with rowid`);
}


async function verify(req, res) {
  const secret = speakeasy.generateSecret({ length: 20 });

  if(!req.body.email) 
     return  res.json({success:false,message:'Missing email in body url'});

   let row  = await req.app.locals.db('accounts').select('*').where('email','=',req.body.email).first();
    if (!row) {
      await req.app.locals.db('accounts').insert({email:req.body.email,secret:secret.base32 , qrcode:secret.otpauth_url}); 
      return res.status(401).json({success:false,code:"NOT_FOUND",message:'Email not found'});
    }

    const verified = speakeasy.totp.verify({
      secret: row.secret,
      encoding: 'base32',
      token: req.body.token
    });

    if (verified) {
      return res.json({'success':true});
    } else {
      return res.status(401).json({'success':false,code:"VERIFY_ERROR" ,message:'Cannot verify the token , please try again'});
    }
};


async function qrcode(req,res) { 
   if(!req.query.email) 
           return  res.send('Missing email in query url');

   let row  = await req.app.locals.db('accounts').select('*').where('email','=',req.query.email || req.body.email).first();
    if (!row) {
      return res.status(401).send('User not found');
    }
        QRCode.toDataURL(row.qrcode,function(err,dataUrl) {
            res.send('<img src='+ dataUrl +'>');
    });
}

module.exports = { 
	 qrcode,
	 register , 
	 verify 
}

