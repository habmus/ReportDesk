const express = require("express") // import express
const mysql = require("mysql") // import mysql
const path = require('path')
const app = express(); //running express erver

require('dotenv').config();

const dbconnect = mysql.createConnection({ // assigning var to mysql function
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

dbconnect.connect((error) => {
  if (error) {
    console.log(error) 
  } else {
    console.log("Connected to MYSQL DB")
  }
})

app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the "pages" directory
app.use('/pages', express.static(path.join(__dirname, 'pages')));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/css', express.static(path.join(__dirname, 'css')));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(5001, () => {
  console.log("Server is listening on 5001"); 
})