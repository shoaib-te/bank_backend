const express = require('express');
const { verifyToken } = require('../middleware/auth.middlewar');
const transactionRouter = express.Router();



transactionRouter.post('/',verifyToken)


module.exports = transactionRouter;