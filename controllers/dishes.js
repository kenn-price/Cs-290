const Dish= require('../models/dish');
const Restaurant= require('../models/restaurant')
const ErrorHandler = require('../utils/errorResponse')
const asyncHandler =require('../middleware/asyncHandler')

// Get api/v1/dishes
// get /api/v1/restaurants/:id/dishes
exports.getDishes = asyncHandler(async (req,res, next) => {
// let query

    if (req.params.id){
        const dishes= await Dish.find({ restaurant:req.params.id});
        return res.status(200).json({
            sucess: true,
            count:dishes.length,
            data: dishes,
        });
    } else {
        res.status(200).json(res.advancedResults);
    }

});
  

exports.getDish = asyncHandler(async (req,res, next) => {
   const dish_item = await Dish.findById(req.params.dishId).populate({
     path: 'restaurants',
    select: 'name items' 
   })
   if (!dish){
       return next(new ErrorHandler(`No dish with ID of ${req.params.dishId}`, 400))
   }

    res.status(200).json({
        success: true,
        count: dishes.length,
        data:dishes
    })
});
//Post
exports.createDish = asyncHandler(async (req,res, next) => {
   //Update the req.body to add restaurant _id
   req.body.restaurant= req.params.id;
   req.body.user= req.user.id;
    // Get the restaurant
const restaurant = await Restaurant.findById(req.params.id)

    // Make sure restaurant exists
if(!restaurant){
    return next(new ErrorHandler(`No restaurant with ID of ${req.params.id}`, 400))
}
// Ensure user is restaurant owner
if (restaurant.user.toString() != req.user.id && req.user.role != 'admin'){
    return  next(new ErrorHandler(`User ${req.user.id} not authorized to add a dish to the restaurant ${restaurant._id}. `,403));    
}
    //Create the restaurant, assigning
    const dish = await Dish.create(req.body) // This will include the restaurant _id we added

// Send response
res.status(201).json({
    sucess: true,
    data: dish
})

     });
// put
     exports.updateDish = asyncHandler(async (req,res, next) => {
        let Dish = await Dish.findById(req.params.dishId)

        if (!dish){
            return next(new ErrorHandler(`No dish with ID of ${req.params.dishId}`, 404))
        }
// Ensure user is DISH owner
if (dish.user.toString() != req.user.id && req.user.role != 'admin'){
    return  next(new ErrorHandler(`User ${req.user.id} not authorized to update dish ${dish._id}. `,403));    
}
        dish = await Dish.findByIdAndUpdate(req.params.dishId, req.body, {
            new: true,
            runValidators: true
        })

            res.status(200).json({
                sucess: true,
                data: dish,
            });
          });
          exports.deleteDish = asyncHandler(async (req,res, next) => {
            let dish = await Dish.findById(req.params.dishId)
    
            if (!dish){
                return next(new ErrorHandler(`No dish with ID of ${req.params.dishId}`, 404))
            }
            // Ensure iser is owner
            if (dish.user.toString() != req.user.id && req.user.role != 'admin'){
                return  next(new ErrorHandler(`User ${req.user.id} not authorized to delete dish ${dish._id}. `,403));    
            }
    
           await dish.remove()
    
                res.status(200).json({
                    sucess: true,
                    data: {},
                });
              });
         