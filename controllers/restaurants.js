
const errorHandler = require('../middleware/errorHandler');
const Restaurant= require('../models/restaurant')
const ErrorHandler = require('../utils/errorResponse')
const asyncHandler =require('../middleware/asyncHandler')
const geocoder= require('../utils/geocoder');


exports.getRestaurants = asyncHandler(async (req,res, next) => {
// Initialize query
let query;

//COpy req.query
const reqQuery={...req.query}

//Fields to exclude
const fieldsToRemove =['select','sort','page','limit'];

// Loop over fieldsToRemove and delete them from reqQuery
fieldsToRemove.forEach((param) =>{
    delete reqQuery[param];
});
//console.log(reqQuery);
// create custon query string
let queryStr=JSON.stringify(req.query);
queryStr.replace(/\b(gt|gte|lt|in)\b/g, (match) => '$' + match)
//console.log(queryStr);

query = Restaurant.find(JSON.parse(queryStr)).populate('dishes');

// Select Fields
if (req.query.select){
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
    //console.log(req.query.select);
}
// sort
if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
}else{
    query= query.sort('createdAt');
}
//Pagination logic
const page =parseInt(req.qury.page, 10) || 1
const limit= parseInt(req.qury.limit, 10) || 20
const startIndex = (page - 1)* limit
const endIndex = page * limit - 1
const total = await University.countDocuments()

query = query.skip(startIndex).limit(limit);
//Limit 20, Page 3

//Executing query
const restaurants = await query;
   // const restaurants= await Restaurant.find();

//Pagination results
const pagination ={}
// not on the last page
if(endIndex < total){
    pagination.next ={
      page: page + 1,
      limit  
    }
}

// not on the first page'
if(startIndex >0 ){
    pagination.prev ={
        page: page-1,
        limit
    };
}

   res.status(200).json({
    success: true,
    count: restaurants.length,
    pagination,
    data: restaurants
    });
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
   
   const newRestaurant= await Restaurant.create(req.body);
                                        //console.log(req.body);
    res.status(201).json({
        success: true,
       data:newRestaurant,
   });
});

exports.updateRestaurant= asyncHandler( async (req,res, next) => {
 
const restaurant = await Restaurant.findByIdAndUpdate(req.params.id);
if (!university){
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
        
        if (!university){
            return  next(new ErrorHandler(`Restaurant not found with id of ${req.params.id}`,500)); 
        }
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
            const loc = await geocoder.geocoder(zipcode)
            const lac = loc[0].latitude
            const lng = loc[0].longitude

            console.log(lat,lng);
           //Calculate radius using radians
           // Divide the given distance by the radius of the Earth
            const earthRadiusInMiles = 3959
            const radius = distanceInMiles/ earthRadiusInMiles;
           // Query the DB and return response
           const restaurants = await Restaurants.find({
               location: {$geoWithin:{ $centerSphere: [ [lng , lat], radius ] }}
           })

           res.status(200).json({
               sucess: true,
               count: restaurants.length,
               data: restaurants
           })
            });