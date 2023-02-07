const express = require('express');
const speakeasy = require('speakeasy');
const db = require('./initdb');
const twoFa = require('./twoFa');
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

async function startApp()  { 
app.locals.db = await db() ; 

// Serve static files
app.use(express.static('public'));

const basePath  = "/api";
// GET method route



// Verify Google Authenticator code
app.post(basePath+'/verify',twoFa.verify);
app.post(basePath+'/register',twoFa.register);
app.get(basePath+'/qrcode',twoFa.qrcode);

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0',function () {
  console.log(`Example app listening at http://localhost:${port}`);
});

}

startApp().then(function() { 
	 console.log("App starting !");
}).catch(function(e) { 
	console.error(e);
});
