var data = require('../layout.data');
var Product = require('../models/products.model');
var Session = require('../models/session.model');

module.exports.get = async function(req, res) {
    var products = await Product.find();
    var sessionId = req.signedCookies.sessionId;

    products.forEach(product => {
        product.priceSale = product.price - (product.price * product.sale) / 100
    });

    res.render('./home/index', {
        data: data.data,
        checkLogin: res.locals.checkLogin,
        products: products.slice(8, 14),
        wishListLength: res.locals.wishListLength,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice
    });
};