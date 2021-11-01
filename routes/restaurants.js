// Change to my api_1 when starting

const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const Restaurant = require('../models/restaurant')

const {getRestaurants, 
    getRestaurant, 
    createRestaurant, 
    updateRestaurant, 
    deleteRestaurant,
    getRestaurantsInRadius,
    uploadRestaurantPhoto 
}= require('../controllers/restaurants');

//Include other resources router
const dishRouter = require('./dishes');

// Reroute into other resource routers
router.use('/:id/dishes', dishRouter);

router.route('/').get(advancedResults(Restaurant, 'dishes'),getRestaurants).post(createRestaurant);
router.route('/radius').get(getRestaurantsInRadius)
router.route('/:id').get(getRestaurant).put(updateRestaurant).delete(deleteRestaurant);
router.route('/:id/photo').put(uploadRestaurantPhoto);
module.exports = router; // not turning