const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('secrets.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the file-based SQLite database.');

	 
  db.run(`CREATE TABLE IF EXISTS users (
    userId TEXT PRIMARY KEY,
    secret TEXT NOT NULL,
    qrcode text not null
  )`, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Users table created successfully.');
  });
});

module.exports = db; 

