const Dish= require('../models/dish');
const Restuarant= require('../models/restaurant')
const ErrorHandler = require('../utils/errorResponse')
const asyncHandler =require('../middleware/asyncHandler')

// Get api/v1/dishes
// get /api/v1/restaurants/:id/dishes
exports.getDishes = asyncHandler(async (req,res, next) => {
    let query;


    if (req.params.id){
        query = Dish.find({ restaurant:req.params.id} )
    }else {
        query= Dish.find().populate({
            path: 'restaurant',
            select:'name items'
        });
    }


    const dishes = await query;
    res.status(200).json({
        success: true,
        count: teams.length,
        data:teams
    });
});
exports.getDish = asyncHandler(async (req,res, next) => {
   const team = await Dish.findById(req.params.dishId).populate({
     path: 'restaurants',
    select: 'name items' 
   })
   if (!team){
       return next(new ErrorHandler(`No dish with ID of ${req.params.dishId}`, 400))
   }

    res.status(200).json({
        success: true,
        count: teams.length,
        data:teams
    })
});
//Post
exports.createDish = asyncHandler(async (req,res, next) => {
   //Update the req.body to add university _id
   req.body.restaurant= req.params.id
    // Get the restaurant
const restaurant = await Restaurant.findById(req.params.id)

    // Make sure restaurant exists
if(!restaurant){
    return next(new ErrorHandler(`No restaurant with ID of ${req.params.id}`, 400))
}

    //Create the restaurant, assigning
    const team = await Dish.create(req.body) // This will include the university _id we added

// Send response
res.status(201).json({
    sucess: true,
    data: dish
})

     });
// put
     exports.updateDish = asyncHandler(async (req,res, next) => {
        let Dish = await Dish.findById(req.params.teamId)

        if (!dish){
            return next(new ErrorHandler(`No dish with ID of ${req.params.dishId}`, 404))
        }

        dish = await Dish.findByIdAndUpdate(req.params.teamId, req.body, {
            new: true,
            runValidators: true
        })

            res.status(200).json({
                sucess: true,
                data: dish,
            });
          });
          exports.deleteDish = asyncHandler(async (req,res, next) => {
            let Dish = await Dish.findById(req.params.teamId)
    
            if (!dish){
                return next(new ErrorHandler(`No dish with ID of ${req.params.dishId}`, 404))
            }
    
           await dish.remove()
    
                res.status(200).json({
                    sucess: true,
                    data: {},
                });
              });
         