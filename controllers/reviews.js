const Review= require('../models/review');
const Restuarant= require('../models/restaurant')
const ErrorHandler = require('../utils/errorResponse')
const asyncHandler =require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const restaurant = require('../models/restaurant');

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

// POST /api/v1/restaurant/:id/reviews
exports.createReview = asyncHandler(async (req,res, next) => {
    // add the university and user ids to the request body
req.body.university = req.params.id
req.body.user= req.user.id

const restaurant= await restaurant.findById(req.params.id)

if(!restaurant){
    return next(new ErrorResponse(`No restaurant found with id of ${req.params.id}`, 404));

}

const review = await Review.create(req.body)// contains sumbitted data, plus the restaurant data

 res.status(201).json({
     success: true,
     data: review,

 });
});