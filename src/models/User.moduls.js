const mongoose = require('mongoose');

const Userschma=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address' ],
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        select:false
    
    },

},{timestamps:true})

// DO THIS
const User = mongoose.model('User', Userschma);
module.exports = User;
