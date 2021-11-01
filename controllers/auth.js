const User = require('../models/user')
const ErrorHandler = require('../utils/errorResponse')
const asyncHandler =require('../middleware/asyncHandler')

//POST /api/v1/auth/register
exports.registerUser= asyncHandler( async (req,res, next) => {
  const {username, email, password, role }= req.body;

  const user = await User.create({
      username,
      email,
      password,
      role,
  });

  sendTokenResponse(user,201, res);
});


//POST/ api/v1/auth/login
   exports.loginUser= asyncHandler( async (req,res, next) => {
    const { email, password}= req.body;
  // Ensure email and password were included
  if (!email || !password) {
    return next(new ErrorHandler('Please provide an email and password', 400))
  }

// Check for user
    const user = await User.findOne({email}).select('+password')
  if (!user){
    return next(new ErrorHandler('Invalid credentials', 401))
  }

// check if the entered password matches the password in DB
const isMatch = await user.matchPassword(password);
if(!isMatch){
  return next(new ErrorHandler('Invalid credentials', 401))
}


sendTokenResponse(user,200, res);


     // Create JWT Token
     
     });

     //========Utility Fucntions==========
     //get token from model, create cookie, and send response
     const sendTokenResponse = (user, status, res) => {
      const token = user.getSignedJwtToken();

      // Cookie options
      const options ={
        expires: new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true
      };

      if(process.env.NODE_ENV=== 'production') {
       options.secure= true;

      }
  
      res.status(status)
      .cookie('Token', token, options)
      .json({
           success: true,
           token:token,
          
      });
     }