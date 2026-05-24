const app = require('./src/app');
const  connectionDB  = require('./src/config/db.js');
const port =process.env.PORT || 4000;
const dotenv = require('dotenv');
dotenv.config();

connectionDB().then(()=>{
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
}).catch((err)=>{
    console.log(err);
})





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});