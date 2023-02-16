require('dotenv').config()
const nodemailer = require("nodemailer");

console.log(process.env.MAIL_PASSWORD);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'difuziacourses@gmail.com',
     pass: process.env.MAIL_PASSWORD
  }
});


module.exports.sendMail = async function(to,cc,subject,body ){ 
	   let mailsOptions = { 
		    from:'difuziacursese@gmail.com<difuzia courses>',
		    to:to,
		    cc:cc||null,
		    subject:subject,
		    html:body
	   };
	   return await transporter.sendMail(mailsOptions);
}
