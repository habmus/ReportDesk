const express = require("express") // import express
const mysql = require("mysql") // import mysql
const path = require('path')
const app = express(); //running express erver
const bodyParser = require('body-parser');

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

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the "pages" directory
app.use('/pages', express.static(path.join(__dirname, 'pages')));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/css', express.static(path.join(__dirname, 'css')));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log('Username:', username);
  console.log('Password:', password);

  dbconnect.query('SELECT * FROM users WHERE email = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      res.status(500).send('An error occurred');
    } else if (results.length > 0) {
      // If the password matches, redirect to the homepage or dashboard
      res.redirect('/pages/homepage.html'); // Adjusted the path to your actual homepage
    } else {
      // If no user is found with that username, send an incorrect credentials message
      res.status(401).send('Incorrect Username/Password');
    }
  });
});


app.listen(5001, () => {
  console.log("Server is listening on 5001"); 
})