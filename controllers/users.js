const User = require('../models/user')
const asyncHandler =require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const restaurant = require('../models/restaurant');

// GET /api/v1/users
exports.getUsers= asyncHandler( async (req,res, next) => {
    res.status(200).json(res.advancedResults)
  });

 // PUT/api/v1/users 
  exports.createUser= asyncHandler( async (req,res, next) => {
    const user = await User.create(req.body)


    res.status(200).json({
        success: true,
        data: user,
    })
  });
// GET/api/v1/users/:id
  exports.getUsers= asyncHandler( async (req,res, next) => {
   const user = await User.findById(req.params.id)
   res.status(200).json({
    success: true,
    data: user,
})
  });

  // PUT/api/v1/users/:id
  exports.updateUser= asyncHandler( async (req,res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators:true
    })
    res.status(200).json({
     success: true,
     data: user,
 })
   });

   // Delete/api/v1/users/:id
  exports.deleteUser= asyncHandler( async (req,res, next) => {
    await User.findByIdAndDelete(req.params.id)
    
    res.status(200).json({
     success: true,
     data: user,
 })
   });