require('dotenv').config()
const express = require('express');
var cors = require('cors');
const speakeasy = require('speakeasy');
const twofa = require('./controllers/twofa');
const app = express();
app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

async function startApp()  { 

// Serve static files
app.use(express.static('public'));

const basePath  = "/api";
// GET method route



// Verify Google Authenticator code
app.post(basePath+'/verify',twofa.verify);
app.post(basePath+'/register',twofa.register);
app.post(basePath+'/qrcode',twofa.qrcode);
app.post(basePath+'/renew-secret',twofa.renewSecret);
app.get(basePath+'/renew-secret',twofa.renewSecret);
app.get(basePath+'/activate',twofa.activate);

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
