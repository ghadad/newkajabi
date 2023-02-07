
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
  if(!req.body.email) 
     return  res.send('Missing email in query url');

   let row  = await req.app.locals.db('accounts').select('*').where('email','=',req.body.email).first();
    if (!row) {
      return res.status(401).send('User not found');
    }

    const verified = speakeasy.totp.verify({
      secret: row.secret,
      encoding: 'base32',
      token: req.body.token
    });

    if (verified) {
      res.send('Valid 2FA code');
    } else {
      res.status(401).send('Invalid 2FA code');
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

