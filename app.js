const express = require("express") // import express
const mysql = require("mysql") // import mysql
const path = require('path') //path finder
const app = express(); //running express server
const bodyParser = require('body-parser');
const crypto = require("crypto"); //
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer"); // for sending mails


// Inside your route

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


app.post("/password-reset", async (req, res) => {
  const email = req.body.email; //grab email from html 
  console.log('Email:', email);

  dbconnect.query('SELECT * FROM Users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      res.status(500).send('An error occurred');
    } else if (results.length > 0) {
      const resetToken = crypto.randomBytes(20).toString('hex'); //create random Token
      const hash = await bcrypt.hash(resetToken, 10);

      // created password_reset table in DB

      const deleteExistingTokens = 'DELETE FROM password_resets WHERE email = ?'; //remove current token
      dbconnect.query(deleteExistingTokens, [email], (error, results) => {
        if (error) console.log(error); // print error if it wasnt able to delele
      });

      const insertToken = 'INSERT INTO password_resets (email, token) VALUES (?, ?)';
      dbconnect.query(insertToken, [email, hash], (error, results) => { //insetr newest token in token field 
        if (error) {
          console.log(error);
          res.status(500).send('An error occurred during token generation');
        } else {
          const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com', //outlook email
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.EMAIL, // stored in .env
              pass: process.env.EMAIL_PASSWORD // host email stored in .env
            }
          });

          // sending reset link
          const mailOptions = {
            from: process.env.EMAIL, // sender
            to: email, // reciever
            subject: 'Password Reset', // Subject line
            html: `<p>Click <a href="http://localhost:5001/pages/password-reset/page2.html?token=${resetToken}&email=${email}">here</a> to reset your password</p>` //email message
          };
          // error handling
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email:", error);
              res.status(500).send('Error sending email: ' + error.message);
            } else {
              console.log('Email sent: ' + info.response);
              res.status(200).send('Reset password link sent to your email address.');
            }
          });
        }
      });
    } else {
      res.status(401).send('Email not found'); //print if email is not in the DB
    }
  });
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


app.get("/reportrequest", (req, res) => {
  reportType = parseInt(req.query.radio1);
  console.log(reportType)
    switch (reportType)
    {
        case 1:
            res.sendFile('/pages/Report-Preview-Daily.html', { root : __dirname});
            break;
        case 2:
            res.sendFile('/pages/Report-Preview-Monthly.html', { root : __dirname});
            break;
        case 3:
            res.sendFile('/pages/Report-Preview-Yearly.html', { root : __dirname});
            break;
        case 4:
            res.sendFile('/pages/Report-Preview-Duration.html', { root : __dirname});
            break;
        case 5:
            res.sendFile('/pages/Report-Preview-Location.html', { root : __dirname});
            break;
        case 6:
            res.sendFile('/pages/Report-Preview-Location.html', { root : __dirname}); 
            break;
        default:
            alert("error");
    }
  
});

app.post("/api/dailyNumbers", express.json(), (req, res) => {
  const  x = req.body.data.dateValue
  console.log(x);
  dbconnect.query("SELECT (SELECT COUNT(*) FROM count WHERE dateOfCount = ?) as countCount, (SELECT COUNT(*) FROM questions WHERE dateofQuestion = ?) as questionCount", [x, x], (error, results) => {
    if (error) 
    {
      console.error('Database query error:', error);
      res.status(500).send('An error occurred');
    } else if (results.length > 0)
    {
      const dailyNumbers ={count: results[0].countCount, question: results[0].questionCount};
      res.json(dailyNumbers);  
    }
  });
});

app.post("/api/monthlyNumbers", express.json(), (req, res) => {
  const  x = req.body.data.dateValue
  console.log(x);
  dbconnect.query("SELECT (SELECT COUNT(*) FROM count WHERE dateOfCount = ?) as countCount, (SELECT COUNT(*) FROM questions WHERE dateofQuestion = ?) as questionCount", [x, x], (error, results) => {
    if (error) 
    {
      console.error('Database query error:', error);
      res.status(500).send('An error occurred');
    } else if (results.length > 0)
    {
      const monthlyNumbers ={count: results[0].countCount, question: results[0].questionCount};
      res.json(dailyNumbers);  
    }
  });
});


app.listen(5001, () => {
  console.log("Server is listening on 5001"); // server link localhost:5001
})

