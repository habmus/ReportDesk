const express = require("express") // import express
const mysql = require("mysql") // import mysql
const index = express(); //running express erver

const dbconnect = mysql.createConnection({ // assigning var to mysql function
  host: 'localhost', // my machine
  user: 'root', //username when signing up for mysql
  password: 'Robinvanpersie2$',
  database: 'ReportDeskTest'
})

dbconnect.connect((error) => {
  if (error) {
    console.log(error) 
  } else {
    console.log("Connected to MYSQL DB")
  }
})

index.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html'); //access html file
});

index.listen(5001, () => {
  console.log("Server is listening on 5001"); 
})

// SELECT * FROM users WHERE email = 'user@example.com' AND password = 'userPassword';

// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Robinvanpersie2$",
//   database: "ReportDeskTest"
// });
// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");

// });

// con.query("SELECT * FROM USERS WHERE email ='john@library.com' AND password = 'sergio' ", function (err, result, fields) {
//   if (err) throw new Error("No Match");

//   console.log("Match");

//   // You can reuse 'con' for additional queries if needed
//   con.query("SELECT * FROM another_table", function (err, result, fields) {
//     // Handle the result or error here
//   });
// });









