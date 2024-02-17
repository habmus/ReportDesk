
// SELECT * FROM users WHERE email = 'user@example.com' AND password = 'userPassword';

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Robinvanpersie2$",
  database: "ReportDeskTest"
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

});

con.query("SELECT * FROM USERS WHERE email ='john@library.com' AND password = 'sergio' ", function (err, result, fields) {
  if (err) throw new Error("No Match");

  console.log("Match");

  // You can reuse 'con' for additional queries if needed
  con.query("SELECT * FROM another_table", function (err, result, fields) {
    // Handle the result or error here
  });
});









