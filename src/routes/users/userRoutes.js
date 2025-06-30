import express from 'express'
import registerUser from '../../controllers/users/register.js'
import loginUser from '../../controllers/users/login.js'
import getAllUsers from '../../controllers/users/getAllUsers.js'

const router = express.Router()


router.get('/users', getAllUsers) // get all users

router.post('/register', registerUser) // register a new user

router.post('/login', loginUser) // login a registered user

export default router