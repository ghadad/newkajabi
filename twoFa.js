
const QRCode = require('qrcode');
const speakeasy = require('speakeasy');

function register(req,res) {
  const secret = speakeasy.generateSecret({ length: 20 });

  req.app.locals.db.run(`INSERT INTO users (userId, secret) VALUES (?,?)`, [req.query.userId, secret.base32], function (err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
}


 function verify(req, res) {
	  console.log(req.body);
  const sql = `SELECT secret FROM users WHERE userId = ?`;
  req.app.locals.db.get(sql, [req.body.userId], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
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
  });
};


async function qrcode(req,res) { 
  const secret = speakeasy.generateSecret({ length: 20 });
	console.log(QRCode.toDataURL(secret.otpauth_url));
        QRCode.toDataURL(secret.otpauth_url,function(err,dataUrl) {
            res.send('<img src='+ dataUrl +'>');
	});
}

module.exports = { 
	 qrcode,
	 register , 
	 verify 
}

