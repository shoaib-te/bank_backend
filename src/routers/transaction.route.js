const express = require('express');
const { verifyToken } = require('../middleware/auth.middlewar');
const transactionController = require('../controllers/transaction.controller');
const { verifysystemuser } = require('../middleware/auth.middlewar');
const transactionRouter = express.Router();


/** * create transaction
 * @route POST /api/transaction
 * @desc Create a new transaction
 * 
 */
transactionRouter.post('/',verifyToken,transactionController.createTransaction)

/** * reverse transaction
 * @route POST /api/transaction/systemuser/funds
 * @desc Reverse a transaction
 * 
 */
transactionRouter.post('/systemuser/funds', verifysystemuser, transactionController.fundsTransaction);


module.exports = transactionRouter;