const express = require('express');
const { loginUser } = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const foodController = require('../controllers/foodController');
const optionController = require('../controllers/optionController')
const orderController = require('../controllers/orderController')
const { verifyToken } = require('../config/jwtVerify')

const router = express.Router();

// user login
router.post('/login', loginUser);

//category
router.post('/create-category', verifyToken, categoryController.createCategory);
router.get('/fetch-all-category', categoryController.getCategories);
router.post('/delete-category',  verifyToken, categoryController.deleteCategory);

//food
router.post('/create-food', verifyToken, foodController.createFood);
router.get('/fetch-foods-by-category/:categoryId', foodController.getFoodByCategory);
router.get('/fetch-all-foods', foodController.getFoods);
router.post('/delete-food', foodController.deleteFood);

//option
router.get('/fetch-option', optionController.getOption);

//order
router.post('/create-order', orderController.createOrder);
router.get('/fetch-all-order', verifyToken, orderController.getOrders);
router.post('/update-order-status', verifyToken, orderController.updateOrderStatus)

module.exports = router;
