const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           
  password: 'meghna',           
  database: 'expense_tracker'  
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
