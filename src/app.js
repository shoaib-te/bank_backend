const express = require('express');
const authRouter = require('./routers/auth.route')
const accountRouter = require('./routers/account.route')
const app = express();



app.use(express.json()); // Parses application/json
app.use(express.urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send('Hello World!');
});

/**
 * all router 
 */
app.use('/api/auth',authRouter)
app.use('/api/account',accountRouter)




module.exports = app;