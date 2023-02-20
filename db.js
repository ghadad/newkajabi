const sqlite3 = require('knex');

console.log(process.env);
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : process.env.MYSQL_HOST ,
    port : process.env.MYSQL_PORT ,
    user : process.env.MYSQL_USERNAME ,
    password : process.env.MYSQL_PASSWORD,
    database : 'difuzia'
  }
});


module.exports = knex ;

