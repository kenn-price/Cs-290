const crypto = require('crypto')
const User = require('../models/user')
const ErrorHandler = require('../utils/errorResponse')
const asyncHandler =require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail')

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
    return next(new ErrorResponse('Please provide an email and password', 400))
  }

// Check for user
    const user = await User.findOne({email}).select('+password')
  if (!user){
    return next(new ErrorResponse('Invalid credentials', 401))
  }

// check if the entered password matches the password in DB
const isMatch = await user.matchPassword(password);
if(!isMatch){
  return next(new ErrorResponse('Invalid credentials', 401))
}


sendTokenResponse(user,200, res);


     // Create JWT Token
     
     });
// POST /api/v1/auth/forgotpassword
exports.forgotPassword = asyncHandler(async(req,res,next)=>{
  const user = await User.findOne({email: req.body.email})


  if(!user){
    return next( new ErrorResponse('no user found with that email', 404))  // Bad security
  }

  // Get a reset token
const resetToken = user.getResetPasswordToken()

  // Save that token to the user
await user.save({validateBeforeSave: false});

// create reset url
// Format==>https://localhost:3000/api/v1/auth/resetpassword/:resettoken
const resetUrl= `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

// Create message
const message=`You are receiving this email because someone has requested th reset of a password at Restaurant API. Please make a PUT request to: \n\n ${resetUrl}`;

// send email
try{
  await sendEmail({
      recipient: user.email,
      subject:'Password Reset Token',
      message
})
res.status(200).json({
  success: true,
  data:'Email sent',
});
}catch(err){
  console.log(err)

  //Clear reset password field from the DB
  user.resetPasswordToken= undefined
  user.resetPasswordExpire= undefined
  await user.save({validateBeforeSave:false});
  return next(new ErrorResponse('Problem sending email',500))
}


 
});
//PUT/ api/v1/auth/resetpassword/:resetToken
exports.resetPassword = asyncHandler(async(req,res,next)=>{
 //Get hased token
const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')

 //FInd user with resetPasswordToken that matches the provided token, after hashing
 // Make sure is not past expiration date
 
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire:{
      $gt: Date.now()
    }
  });

  if(!user)
{
  return next(new ErrorResponse('invalid token or expired', 400))
}

// set new password
user.password=req.body.password
user.resetPasswordToken= undefined;
user.resetPasswordExpire= undefined;
await user.save();

  sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async(req,res,next)=>{
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    data:user,
  });
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