const Review= require('../models/review');
const Restuarant= require('../models/restaurant')
const ErrorHandler = require('../utils/errorResponse')
const asyncHandler =require('../middleware/asyncHandler')

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