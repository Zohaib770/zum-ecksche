const express = require('express');
const { loginUser } = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const foodController = require('../controllers/foodController');
const optionController = require('../controllers/optionController')

const router = express.Router();

// user login
router.post('/login', loginUser);

//category
router.post('/create-category', categoryController.createCategory);
router.get('/fetch-all-category', categoryController.getCategories);

//food
router.post('/create-food', foodController.createFood);
router.get('/fetch-foods-by-category/:categoryId', foodController.getFoodByCategory);

//option
router.get('/fetch-option', optionController.getOption);



module.exports = router;
