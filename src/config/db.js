const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectionDB=async()=>{
    try {
        const db=await mongoose.connect(process.env.MONGO_URI)

        console.log('db is connection ');

    }catch(err){
        console.log(err);
    }
    }


module.exports =   connectionDB;