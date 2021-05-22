var homeRoute = require('./home.route');
var productsRoute = require('./products.route');
var wishlistRoute = require('./wishlist.route');
var cartRoute = require('./cart.route');
var authenticationRoute = require('./authentication.route');
var adminRoute = require('./admin.route');

var route = function(app){
    app.use('/home', homeRoute);
    app.use('/products', productsRoute);
    app.use('/wishlist', wishlistRoute);
    app.use('/cart', cartRoute);
    app.use('/authentication', authenticationRoute);
    app.use('/admin', adminRoute);
}

module.exports = route;