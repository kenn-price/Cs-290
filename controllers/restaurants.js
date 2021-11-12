
const errorHandler = require('../middleware/errorHandler');
const Restaurant= require('../models/restaurant')
const ErrorHandler = require('../utils/errorResponse')
const asyncHandler =require('../middleware/asyncHandler')
const geocoder= require('../utils/geocoder');
const path = require('path');


exports.getRestaurants = asyncHandler(async (req,res, next) => {
res.status(200).json(res.advancedResults)
       
});

    exports.getRestaurant =asyncHandler(async (req,res, next) => {
     
        const restaurant = await Restaurant.findById(req.params.id);
        if(!restaurant){
        return  next(new ErrorHandler(`Restaurant not found with id of ${req.params.id}`,500));    
         } 
         res.status(200).json({
             success: true,
             data: restaurant,
         });
});

exports.createRestaurant= asyncHandler( async (req,res, next) => {
   // Check if user has already created a restaurant
   const publishedRestaurant= await Restaurant.findOne({user: req.user.id})
   if(publishedRestaurant && req.user.role !== 'admin'){
       return next(new ErrorHandler('This user has already created a Restaurant',400));
   }

    req.body.user=req.user.id
   const newRestaurant= await Restaurant.create(req.body);
                                        //console.log(req.body);
    res.status(201).json({
        success: true,
       data:newRestaurant,
   });
});

exports.updateRestaurant= asyncHandler( async (req,res, next) => {
 
const restaurant = await Restaurant.findByIdAndUpdate(req.params.id);
if (!restaurant){
    return  next(new ErrorHandler(`Restaurant not found with id of ${req.params.id}`,500));     
    }

res.status(200).json({
    success: true,
    data: {},
});
});
exports.deleteRestaurant = asyncHandler(async (req,res, next) => {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id, req.body,{
            new: true,
            runValidators: true
        })
        
        if (!restaurant){
            return  next(new ErrorHandler(`Restaurant not found with id of ${req.params.id}`,500)); 
        }
        restaurant.remove();


        res.status(200).json({
            success: true,
            data: restaurant
        }); 
     });

//  / api/v1/restaurants/radius?key=value?zipcode=29550&distanceInMiles=100
        exports.getRestaurantsInRadius= asyncHandler(async (req,res, next) => {
           // Get data from req.query
        //    const zipcode = req.query.zipcode
        //    const distanceInMiles = req.query.distanceInMiles
            const {zipcode,distanceInMiles}= req.query
           // Get lat/lng from our geocoder
            const loc = await geocoder.geocode(zipcode)
            const lat = loc[0].latitude
            const lng = loc[0].longitude

            console.log(lat,lng);
           //Calculate radius using radians
           // Divide the given distance by the radius of the Earth
            const earthRadiusInMiles = 3959
            const radius = distanceInMiles/ earthRadiusInMiles;
           // Query the DB and return response
           const restaurants = await Restaurant.find({
               location: {$geoWithin:{ $centerSphere: [ [lng , lat], radius ] }}
           })

           res.status(200).json({
               sucess: true,
               count: restaurants.length,
               data: restaurants
           })
            });
            exports.uploadRestaurantPhoto = asyncHandler(async (req,res, next) => {
               // FInd Restaurant
                const restaurant = await Restaurant.findById(req.params.id)
                if (!restaurant){
                    return  next(new ErrorHandler(`Restaurant not found with id of ${req.params.id}`,500)); 
                }
               //validate the image
               if(!req.files){
                return  next(new ErrorHandler(`Please upload an image file`,400)); 
               }
               const file = req.files.file

                //Make sure file is an image
                if(!file.mimetype.startsWith("image")){
                    return  next(new ErrorHandler(`Please upload an image file`,404)); 
                }
                // CHeck filesize
                if (file.size > process.env.FILE_UPLOAD_MAX_SIZE){
                return  next(new ErrorHandler(`Please upload an image file smaller than ${process.env.FILE_UPLOAD_MAX_SIZE}`,400)); 

                }
               
                // Change the filename: photo_restaurantid
                file.name = `photo_${restaurant._id}${path.parse(file.name).ext}`;
                
               //Move the image to  the proper location
                file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) =>{
                    if(err){
                        console.error(err)
                        return  next(new ErrorHandler(`Problem uploading file`, 500)); 
 
                    }
                })

                //Update the restaurant with the new image filename
                await Restaurant.findByIdAndUpdate(req.params.id, {photo: file.name})
                res.status(200).json({
                    success: true,
                    data:{
                        restaurant: restaurant._id,
                        file: file.name
                    },
                })
                //Send response(req.par)
             });