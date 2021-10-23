const express = require('express');
const router = express.Router({mergeParams: true});

const {getDishes, getDish, createDish
}= require('../controllers/dishes');

///api/v1/dishes
// /api/v1/restaurants/:id/dishes
router.route('/').get(getDishes).post(createDish);
router.route('/:dishId').get(getDish);

module.exports = router;