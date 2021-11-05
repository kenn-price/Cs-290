const express = require('express');
const router = express.Router({mergeParams: true});
const advancedResults= require('../middleware/advancedResults')
const Dish = require('../models/dish')

const {protect, authorize} = require('../middleware/auth')


const {getDishes, getDish, createDish, updateDish, deleteDish
}= require('../controllers/dishes');

///api/v1/dishes
// /api/v1/restaurants/:id/dishes
router.route('/').get(advancedResults(Dish, {path: 'restaurants',
select: 'name items' }),getDishes).post(protect,authorize('publisher','admin'), createDish);
router.route('/:dishId').get(getDish).put(protect,authorize('publisher','admin'), updateDish).delete(protect,authorize('publisher','admin'), deleteDish);

module.exports = router;