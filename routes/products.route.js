var express = require('express');
var controller = require('../controllers/products.controller');
var router = express.Router();

router.get('/', controller.get);

router.get('/search', controller.search);

router.get('/:cateID', controller.getByCategory);

router.get('/detail/:code', controller.getDetail);

router.get('/cate/:cateId', controller.getCategory);

router.get('/add-to-cart/:productID', controller.addToCart);

router.get('/remove-from-cart/:productID', controller.removeFromCart);

router.get('/add-to-wishlist/:productID', controller.addToWishList);

router.post('/rating/:productId', controller.postRating);


module.exports = router;