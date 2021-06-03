var homeRoute = require('./home.route');
var productsRoute = require('./products.route');
var wishlistRoute = require('./wishlist.route');
var cartRoute = require('./cart.route');
var authenticationRoute = require('./authentication.route');
var adminRoute = require('./admin.route');
var checkoutRoute = require('./checkout.route');

var categoryAPI = require('../api/routes/category.route');
var categoryDetailAPI = require('../api/routes/category-detail.route');

var adminMiddleware = require('../middlewares/admin.middleware');


var route = function(app){
    app.use('/home', homeRoute);
    app.use('/products', productsRoute);
    app.use('/wishlist', wishlistRoute);
    app.use('/cart', cartRoute);
    app.use('/authentication', authenticationRoute);
    app.use('/admin', adminMiddleware,  adminRoute);
    app.use('/checkout', checkoutRoute);

    //api
    app.use('/api', categoryAPI)
    app.use('/api', categoryDetailAPI)
}

module.exports = route;