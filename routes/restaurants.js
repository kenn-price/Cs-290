// Change to my api_1 when starting

const express = require('express');
const router = express.Router();

//Include other resources router
const dishRouter = require('./dishes');

// Reroute into other resource routers
router.use('/:id/dishes', dishRouter);

const {getRestaurants, 
    getRestaurant, 
    createRestaurant, 
    updateRestaurant, 
    deleteRestaurant,
    getRestaurantsInRadius 
}= require('../controllers/restaurants');

router.route('/').get(getRestaurants).post(createRestaurant);
router.route('/radius').get(getRestaurantsInRadius)
router.route('/:id').get(getRestaurant).put(updateRestaurant).delete(deleteRestaurant);

module.exports = router; // not turning