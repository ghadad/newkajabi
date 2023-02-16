const ejs = require('ejs');


module.exports.renderFile = async function(filename,data,options) { 
   return new Promise((resolve,reject) => { 
     ejs.renderFile(filename, data, options, function(err, str){
	     if(str) return resolve(str);
	     if(err) return reject(err.message);
   });
  });
}

