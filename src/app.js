const express = require('express');
const authRouter = require('./routers/auth.route')
const accountRouter = require('./routers/account.route');
const cookieParser = require('cookie-parser');
const transactionRouter = require('./routers/transaction.route');
const app = express();



app.use(express.json()); // Parses application/json
app.use(express.urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!');
});

/**
 * all router 
 */
app.use('/api/auth',authRouter)
app.use('/api/account',accountRouter)
app.use('/api/transaction',transactionRouter)




module.exports = app;