const jwt = require('jsonwebtoken');
const User = require('../models/User.moduls');

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    const token= req.cookies.token || req.header.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Unauthorized'})

    }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user= await User.findById(decoded.userId);
    if(!user){
        return res.status(401).json({message:'Unauthorized'})
    }
    req.user = user;
   return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports ={
    verifyToken

} ;