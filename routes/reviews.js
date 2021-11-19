const express = require('express');
const router = express.Router({mergeParams: true});
const advancedResults= require('../middleware/advancedResults')
const Review = require('../models/review')

const {protect, authorize} = require('../middleware/auth')


const {getReviews,getReview}
= require('../controllers/reviews');

///api/v1/reviews
// /api/v1/restaurants/:id/reviews
router.route('/').get(advancedResults(Review, {path: 'restaurant',
select: 'name description' }),getReviews);

router.route('/:id').get(getReview)


module.exports = router;