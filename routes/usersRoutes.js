import express from 'express';

import {user_list, user_by_id, user_by_email, get_course_codes} from '../controllers/userControl.js'
export const routerUser = express.Router()

routerUser.get('/', user_list)
routerUser.get('/getUser', user_by_id)
routerUser.post('/login', user_by_email)
routerUser.get('/getRecords', get_course_codes)
