const express = require("express") // import express
const mysql = require("mysql") // import mysql
const path = require('path') //path finder
const app = express(); //running express server
const bodyParser = require('body-parser');
//const randomString = require("randomstring")

require('dotenv').config();

const dbconnect = mysql.createConnection({ // assigning var to mysql function
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

dbconnect.connect((error) => {
  if (error) console.log(error) //if error print error
  else console.log("Connected to MYSQL DB") // else prnt this mssg in node terminal
})

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the "pages" directory
app.use('/pages', express.static(path.join(__dirname, 'pages')));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/css', express.static(path.join(__dirname, 'css')));

app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html'); //send 
});

app.post("/password-reset", (req, res) => {
  const email = req.body.email; // gets email from pwreset email input
  

  console.log('Email:', email); // error handling

  dbconnect.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => { // get email from db
    if (error) {
      console.error('Database query error:', error);
      res.status(500).send('An error occurred');
    } else if (results.length > 0) {

      const randomString = randomstring.generate(); // generate random token 
      const content = '<p> Click this link to reset password: ' + results[0].email     // send an email message to the users email

    
      res.redirect('/pages/password-reset/page2.html'); 

    } else {
     
      res.status(401).send('Incorrect Email');
    }

  })

});

app.post("/login", (req, res) => {
  const email = req.body.email; //gets email from login email input
  const password = req.body.password; //gets password from login password input

  console.log('Email:', email);
  console.log('Password:', password);

  dbconnect.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      res.status(500).send('An error occurred');
    } else if (results.length > 0) {
      // If password match
      res.redirect('/pages/homepage.html'); // go to homepage
    } else {
      // If password dont match
      res.status(401).send('Incorrect Email/Password');// error code about incorrect credentials
    }
  });
});


app.listen(5001, () => {
  console.log("Server is listening on 5001"); // server link localhost:5001
})