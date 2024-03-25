import { getUsers, getUser, getUserByEmail, getCoursecodes } from '../models/database.js';
import bcrypt from 'bcrypt';


export const user_list = (async (req,res)=> {
    const users = await getUsers()
    res.send(users)
  })

export const user_by_id = (async (req,res)=> {
  const user = await getUser(1)
  res.send(user)
})

export const user_by_email = (async (req,res)=> {
  const email = req.body.email
  const password = req.body.password
  const user = await getUserByEmail(email)
  console.log(user)
  if(user.length > 0)
  {
    const isPassWordValid = bcrypt.compareSync(password, user[0].password)
    if (isPassWordValid == true)
      {
        res.redirect('/users/getRecords')
      }
    else 
    res.send("<h1>Password not found</h1>")
  }
    else
    res.send("<h1>User not found</h1>")
})

export const get_course_codes = (async (req,res)=> {
  const courseCodes = await getCoursecodes()
  res.render("Records.ejs", {courseCodes})
})

