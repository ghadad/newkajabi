const sqlite3 = require('knex');

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data.db',
  },
  useNullAsDefault: true
});


async function initDb() { 
  try {
	  await knex.schema.dropTable('accounts');
  await knex.schema
    .createTable('accounts', table => {
      table.increments();
	    table.string('email');
      table.string('secret');
      table.string('qrcode');
      table.string('verified_once');
    });
} catch(e) {
  console.error(e);
};
 return knex ;
}

module.exports = initDb ;

