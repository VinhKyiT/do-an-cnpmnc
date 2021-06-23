var express = require('express');
var controller = require('../controllers/cart.controller');
var productController = require('../controllers/products.controller');
const { route } = require('./home.route');
var router = express.Router();

router.get('/', controller.get);

router.get('/remove/:productID', controller.removeCart);

router.post('/updateCart', controller.updateCart);

router.post('/', controller.updateCart);

module.exports = router;