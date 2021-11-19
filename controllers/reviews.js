const Review= require('../models/review');
const Restuarant= require('../models/restaurant')
const ErrorHandler = require('../utils/errorResponse')
const asyncHandler =require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Get api/v1/reviews
// get /api/v1/restaurants/:id/reviews
exports.getReviews = asyncHandler(async (req,res, next) => {
// let query

    if (req.params.id){
        const reviews= await Review.find({ restaurant:req.params.id});
        return res.status(200).json({
            sucess: true,
            count:reviews.length,
            data: reviews,
        });
    } else {
        res.status(200).json(res.advancedResults);
    }

});

// get /api/v1/revies/:id
exports.getReview = asyncHandler(async (req,res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path:'restaurant',
        select:'name description'
    });

    if(!review){
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404))
    }
 res.status(200).json({
     success: true,
     data: review,

 });
});