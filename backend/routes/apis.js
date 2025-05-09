const express = require('express');
const { loginUser } = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const foodController = require('../controllers/foodController');
const optionController = require('../controllers/optionController')
const deliveryZoneController = require('../controllers/deliveryZoneController')
const extraController = require('../controllers/extraController')
const orderController = require('../controllers/orderController')
const paymentController = require('../controllers/paymentController')
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
router.put('/update-food/:id', foodController.updateFood);
router.post('/delete-food', foodController.deleteFood);

//option
router.get('/fetch-option', optionController.getOption);

//deliveryzone
router.get('/fetch-deliveryzone', deliveryZoneController.getDeliveryZone);

//extra
router.get('/fetch-extra', extraController.getExtra);

//order
router.post('/create-order', orderController.createOrder);
router.get('/fetch-all-order', verifyToken, orderController.getOrders);
router.post('/update-order-status', verifyToken, orderController.updateOrderStatus)

//payments
router.post('/paypal-create-order', paymentController.paypalCreateOrder);
router.post('/paypal-capture-order', paymentController.paypalCaptureOrder);

router.post('/stripe-create-order', paymentController.stripeCreateOrder);

module.exports = router;
