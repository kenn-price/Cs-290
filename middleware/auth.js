const jwt = require('jsonwebtoken');
const asyncHandler= require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

// Protect Routes -- require login
exports.protect = asyncHandler(async(req, res, next) =>{
  // initialize token variable
let token;

// Check if token was passed in handler
if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
token = req.headers.authorization.split(' ')[1];

}
//verify token
if (!token){
  return next(new ErrorResponse('You must log in to access that resource', 401))  
}
 try{
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decodedToken)
    req.user = await User.findById(decodedToken.id)
    next()
 }catch (err){
console.log('Error verifying token')
console.error(err)
return next(new ErrorResponse('Not authorize to acess this resource', 401))  

 }
//continue

    
});

// Grant access to specific roles

exports.authorize= (...roles) =>{
    return(req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`Role ${req.user.role} is not authorized to acess this resource`,403)) 
        }
        next();
    }
}