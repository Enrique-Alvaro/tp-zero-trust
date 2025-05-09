const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: "miapp-db.cd2uoocycow2.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin1234",
  database: "my_db",
  port: 3306
});

module.exports = connection;
