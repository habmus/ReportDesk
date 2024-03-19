const express = require("express");
const mysql = require("mysql");
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

require('dotenv').config();

const dbconnect = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

dbconnect.connect((error) => {
  if (error) console.log(error);
  else console.log("Connected to MYSQL DB");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post("/password-reset", async (req, res) => {
  const email = req.body.email;
  console.log('Email:', email);

  dbconnect.query('SELECT * FROM Users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      res.status(500).send('An error occurred');
    } else if (results.length > 0) {
      const resetToken = crypto.randomBytes(20).toString('hex');
      const hash = await bcrypt.hash(resetToken, 10);

      const deleteExistingTokens = 'DELETE FROM password_resets WHERE email = ?';
      dbconnect.query(deleteExistingTokens, [email], (error, results) => {
        if (error) console.log(error);
      });

      const insertToken = 'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))';
      console.log('Hashed token:', hash);
      dbconnect.query(insertToken, [email, hash], (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send('An error occurred during token generation');
        } else {
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD
            }
          });

          const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Requested',
            html: `<p>Hi ${email}!, you have requested a password reset</p><p>Click <a href="http://localhost:5001/pages/password-reset/page2.html?token=${resetToken}&email=${email}">here</a> to reset your password</p>`
          };

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
      res.status(401).send('Email not found');
    }
  });
});

app.post("/set-new-password", async (req, res) => {
  const { token, email, newPassword } = req.body;
  console.log('Received token:', token);
  console.log('Received email:', email);
  console.log('Received newPassword:', newPassword);

  try {
    const getTokenQuery = 'SELECT token, expires_at FROM password_resets WHERE email = ?';
    dbconnect.query(getTokenQuery, [email], async (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        res.status(500).send('An error occurred');
      } else if (results.length > 0) {
        const storedToken = results[0].token;
        const expiredAt = results[0].expires_at;
        console.log('Stored token:', storedToken);
        console.log('Expired at:', expiredAt);

        const currentTime = new Date();
        if (currentTime > expiredAt) {
          console.log('Token has expired');
          res.status(401).send('Token has expired');
        } else {
          const isTokenValid = await bcrypt.compare(token, storedToken);
          console.log('Token validity:', isTokenValid);

          if (isTokenValid) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            console.log('Hashed new password:', hashedPassword);

            const updatePasswordQuery = 'UPDATE Users SET password = ? WHERE email = ?';
            dbconnect.query(updatePasswordQuery, [hashedPassword, email], (error, results) => {
              if (error) {
                console.error('Database query error:', error);
                res.status(500).send('An error occurred');
              } else {
                console.log('Password updated successfully');

                const deleteTokenQuery = 'DELETE FROM password_resets WHERE email = ?';
                dbconnect.query(deleteTokenQuery, [email], (error, results) => {
                  if (error) {
                    console.error('Database query error:', error);
                  } else {
                    console.log('Token deleted successfully');
                  }
                });

                res.status(200).send('Password reset successful');
              }
            });
          } else {
            console.log('Invalid token');
            res.status(401).send('Invalid token');
          }
        }
      } else {
        console.log('No token found for the provided email');
        res.status(401).send('Invalid or expired token');
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});


app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  dbconnect.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      res.status(500).send('An error occurred');
    } else if (results.length > 0) {
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Password is correct, perform login logic
        res.redirect('/pages/records.html');
      } else {
        // Password is incorrect
        res.status(401).send('Incorrect Email/Password');
      }
    } else {
      // User not found
      res.status(401).send('Incorrect Email/Password');
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
  const  x = req.body.data.dateValue;
  let cleanDate = x.slice(0,7);
  cleanYear = cleanDate.substring(0,4);
  cleanMonth = cleanDate.substring(5,7);
  console.log(cleanMonth);
  const date = new Date(cleanYear,cleanMonth);

 const dateArray = [];
for(let i = 0; i < 6; i++)
{   
    date.setMonth(date.getMonth()-1);
    dateISO =(date.toISOString());
    saveDate = dateISO.slice(0,7);
    dateArray.push(saveDate);
}
console.log(dateArray)

  dbconnect.query("SELECT (SELECT COUNT(*) FROM questions WHERE dateofQuestion LIKE ?) as ?, (SELECT COUNT(*) FROM questions WHERE dateofQuestion LIKE ?) as ?, (SELECT COUNT(*) FROM questions WHERE dateofQuestion LIKE ?) as ?, (SELECT COUNT(*) FROM questions WHERE dateofQuestion LIKE ?) as ?, (SELECT COUNT(*) FROM questions WHERE dateofQuestion LIKE ?) as ?, (SELECT COUNT(*) FROM questions WHERE dateofQuestion LIKE ?) as ?;", [dateArray[0] +'%',dateArray[0], dateArray[1]+'%', dateArray[1], dateArray[2]+'%', dateArray[2], dateArray[3]+'%', dateArray[3], dateArray[4]+'%', dateArray[4], dateArray[5]+'%', dateArray[5]], (error, results) => {
    if (error) 
    {
      console.error('Database query error:', error);
      res.status(500).send('An error occurred');
    } else if (results.length > 0)
    {
      
      console.log(Object.keys(results[0]))
      months = Object.keys(results[0])
      console.log(Object.values(results[0]))
      monthValue = Object.values(results[0])
      const monthlyNumbers = {months, monthValue};
      res.json(monthlyNumbers);  
    }
  });
});

app.post("/api/yearlyNumbers", express.json(), (req, res) => {
  const  targetYear = req.body.data.dateValue;
  let yearOnly = targetYear.slice(0,4);
  console.log(yearOnly);
  dbconnect.query("SELECT" +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=8) as hr8am," +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=9) as hr9am," +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=10) as hr10am," +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=11) as hr11am," +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=12) as hr12pm," +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=13) as hr1pm," +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=14) as hr2pm," +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=15) as hr3pm," +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=16) as hr4pm," +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=17) as hr5pm," +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=18) as hr6pm," +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=19) as hr7pm," +
"(SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=20) as hr8pm;",
[yearOnly,yearOnly,yearOnly,yearOnly,yearOnly,yearOnly,yearOnly,yearOnly,yearOnly,yearOnly,yearOnly,yearOnly,yearOnly], (error, results) => {
    if (error) 
    {
      console.error('Database query error:', error);
      res.status(500).send('An error occurred');
    } else if (results.length > 0)
    {
      console.log(results)
      
      yearlyValues = Object.values(results[0])
      res.json(yearlyValues);
    }
  });
});


app.listen(5001, () => {
  console.log("Server is listening on 5001"); // server link localhost:5001
})

