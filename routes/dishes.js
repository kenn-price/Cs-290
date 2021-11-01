const express = require('express');
const router = express.Router({mergeParams: true});
const advancedResults= require('../middleware/advancedResults')
const Dish = require('../models/dish')

const {getDishes, getDish, createDish, updateDish, deleteDish
}= require('../controllers/dishes');

///api/v1/dishes
// /api/v1/restaurants/:id/dishes
router.route('/').get(advancedResults(Dish, {path: 'restaurants',
select: 'name items' }),getDishes).post(createDish);
router.route('/:dishId').get(getDish).put(updateDish).delete(deleteDish);

module.exports = router;