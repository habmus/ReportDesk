import express from 'express';

import {user_list, user_by_id, user_by_email, get_course_codes, reset_password, set_new_password} from '../controllers/userControl.js'
export const routerUser = express.Router()

routerUser.get('/', user_list)
routerUser.get('/getUser', user_by_id)
routerUser.post('/login', user_by_email)
routerUser.get('/getRecords', get_course_codes)
routerUser.post('/password-reset', reset_password)
routerUser.get('/password-reset', (req, res) => {
    res.render('password-reset/page1');
});

routerUser.get('/set-new-password', (req, res) => { //takes you to the second page of the password reset process
    const token = req.query.token; //gets the token from the url
    const email = req.query.email; //gets the email from the url
    res.render('password-reset/page2', { token, email });   //renders the page and passes the token and email to the page
  });
routerUser.post('/set-new-password', set_new_password) //this is the route that will be called when the user submits the new password form
routerUser.get('/password-reset-success', (req, res) => { //takes you to the third page of the password reset process
    res.render('password-reset/page3');
});

routerUser.get('/create-user', (req, res) => { //takes you to the create user page
    res.render('Create_user');
});
routerUser.get('/manage-user', (req, res) => { //takes you to the manage user page
    res.render('Manage_users');
});

