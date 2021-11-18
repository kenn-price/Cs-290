// Change to my api_1 when starting

const express = require('express');
const router = express.Router();
const {protect, authorize} = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/user')


const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}= require('../controllers/users');

router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedResults(User),getUsers).post(createUser)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router; // not turning