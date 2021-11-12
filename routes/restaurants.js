// Change to my api_1 when starting

const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const Restaurant = require('../models/restaurant')

const {protect, authorize} = require('../middleware/auth')

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

router.route('/').get(advancedResults(Restaurant, 'dishes'),getRestaurants).post(protect, authorize('publisher','admin'), createRestaurant);
router.route('/radius').get(getRestaurantsInRadius)
router.route('/:id').get(getRestaurant).put(protect,authorize('publisher','admin'), updateRestaurant).delete(protect,authorize('publisher','admin'), deleteRestaurant);
router.route('/:id/photo').put(protect, uploadRestaurantPhoto);
module.exports = router; // not turning