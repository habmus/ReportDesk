import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config()
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise()

export async function getUsers() {
const [rows] = await pool.query("SELECT * FROM Users")
return rows
}


export async function getUser(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM users 
    WHERE userID = ?
    `,[id])
    return rows[0]
}

export async function getUserByEmail(email) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM users 
    WHERE email = ?
    `,[email])
    console.log(rows)
    return rows
}

export async function getCoursecodes(){
    const [rows] = await pool.query(`
    SELECT courseCode 
    FROM Courses
    `)
    console.log(rows)
    return rows
}

export async function getDailyReport(day){
    const [rows] = await pool.query(`
    SELECT 
    (SELECT COUNT(*) 
    FROM count WHERE dateOfCount = ?) as headCount, 
    (SELECT COUNT(*) 
    FROM questions WHERE dateofQuestion = ?) as questionCount
    `, [day, day])
    console.log(rows)
    return rows
}

export async function getMonthlyReport(dateArray){
    const [rows] = await pool.query(`
    SELECT 
    (SELECT COUNT(*) FROM questions WHERE dateofQuestion LIKE ?) as ?, 
    (SELECT COUNT(*) FROM questions WHERE dateofQuestion LIKE ?) as ?, 
    (SELECT COUNT(*) FROM questions WHERE dateofQuestion LIKE ?) as ?, 
    (SELECT COUNT(*) FROM questions WHERE dateofQuestion LIKE ?) as ?, 
    (SELECT COUNT(*) FROM questions WHERE dateofQuestion LIKE ?) as ?, 
    (SELECT COUNT(*) FROM questions WHERE dateofQuestion LIKE ?) as ?;
    `, [dateArray[0] +'%',dateArray[0], dateArray[1]+'%', dateArray[1], dateArray[2]+'%', dateArray[2], dateArray[3]+'%', dateArray[3], dateArray[4]+'%', dateArray[4], dateArray[5]+'%', dateArray[5]])
    console.log(rows)
    return rows
}

export async function getYearlyReport(year){
    const [rows] = await pool.query(`
    SELECT
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=8) as hr8am,
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=9) as hr9am,
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=10) as hr10am,
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=11) as hr11am,
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=12) as hr12pm,
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=13) as hr1pm,
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=14) as hr2pm,
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=15) as hr3pm,
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=16) as hr4pm,
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=17) as hr5pm,
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=18) as hr6pm,
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=19) as hr7pm,
    (SELECT SUM(headCount) FROM count WHERE EXTRACT(year from dateofCount)=? AND EXTRACT(HOUR from dateOfCount)=20) as hr8pm;
    `, [year,year,year,year,year,year,year,year,year,year,year,year,year])
    console.log(rows)
    return rows
}

export async function getLocationReport(year){
    const [rows] = await pool.query(`
    SELECT 
    (SELECT COUNT(*) FROM questions WHERE EXTRACT(year from dateOfQuestion)=? and locationID = 1) as In_Person,  
    (SELECT COUNT(*) FROM questions WHERE EXTRACT(year from dateOfQuestion)=? and locationID = 2) as Phone,
    (SELECT COUNT(*) FROM questions WHERE EXTRACT(year from dateOfQuestion)=? and locationID = 3) as Online; 
    `, [year,year,year])
    console.log(rows)
    return rows
}

export async function getDurationReport(year){
    const [rows] = await pool.query(`
    SELECT 
    (SELECT COUNT(*) FROM questions WHERE EXTRACT(year from dateOfQuestion)=? and durationID = 1) as five,  
    (SELECT COUNT(*) FROM questions WHERE EXTRACT(year from dateOfQuestion)=? and durationID = 2) as twenty_nine,
    (SELECT COUNT(*) FROM questions WHERE EXTRACT(year from dateOfQuestion)=? and durationID = 3) as thirty;  
    `, [year,year,year])
    console.log(rows)
    return rows
}

export async function getCoursesReport(year){
    const [rows] = await pool.query(`
    SELECT Courses.courseCode, COUNT(*) AS numberOfQuestions
    FROM Questions
    INNER JOIN Courses ON Questions.courseID=Courses.courseID
    WHERE EXTRACT(year from Questions.dateOfQuestion)=?
    GROUP BY  Questions.courseID
    ORDER BY numberOfQuestions DESC
    LIMIT 5;
    `, [year])
    console.log(rows)
    return rows
}

export async function saveResetToken(email, token) {
    try {
      await pool.query(`
        INSERT INTO password_resets (email, token, expires_at)
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))
      `, [email, token]);
      console.log('Reset token saved successfully');
    } catch (error) {
      console.error('Error saving reset token:', error);
      throw error;
    }
  }

  export async function getUserByResetToken(token) {
    console.log('Received Token in getUserByResetToken:', token);
    const [rows] = await pool.query(`
      SELECT * 
      FROM password_resets
      WHERE expires_at > NOW()
    `);
    console.log('Reset Token Rows:', rows);
  
    for (const row of rows) {
      const isMatch = await bcrypt.compare(token, row.token);
      if (isMatch) {
        return row;
      }
    }
  
    return null;
  }

export async function updatePassword(email, hashedPassword) {
    const [result] = await pool.query(`
      UPDATE Users 
      SET password = ?
      WHERE email = ?
    `, [hashedPassword, email]);
    console.log('Update Password Result:', result);
  }

export async function deleteResetToken(email) {
    await pool.query(`
    DELETE FROM password_resets
    WHERE email = ?
    `, [email])
}
