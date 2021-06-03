var express = require('express');
var controller = require('../controllers/cart.controller');
const { route } = require('./home.route');
var router = express.Router();

router.get('/', controller.get);

router.get('/remove/:productID', controller.removeCart);

router.post('/', controller.updateCart);

module.exports = router;