const express = require('express')
const authcontroller= require( '../controllers/auth.controller')
const authRouter=express.Router()


authRouter.post('/register',authcontroller.register)
authRouter.post('/login',authcontroller.login)
authRouter.post('/logout',authcontroller.logout)




module.exports=authRouter