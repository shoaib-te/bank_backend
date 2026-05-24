const express = require('express')  
const authmiddleware=require('../middleware/auth.middlewar')
const auccontController= require('../controllers/account.controller')

const router=express.Router()



router.post('/',authmiddleware.verifyToken,auccontController.createAccount)


module.exports=router;