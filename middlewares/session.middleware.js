var ids = require('short-id');
var Session = require('../models/session.model');
var Product = require('../models/products.model');

module.exports = async function(req, res, next) {
    var randomID = ids.generate();
    var sessionID = req.signedCookies.sessionId;
    if (!sessionID) {
        res.cookie('sessionId', randomID, {
            signed: true
        });

        Session.create({ sessionID: randomID });
    }

    var session = await Session.findOne({ sessionID: sessionID });

    if (session != null) {

        var wishListLength = session.wishlist.length || 0;

        var cartLength = session.cart.length || 0;

        var productID = session.cart.map(cart => {
            return cart.idProduct
        });

        var cartItems = await Product.find({ _id: { $in: productID } });

        var countCart = session.cart.map(cart => {
            return cart.count
        });

        for (let i = 0; i < cartItems.length; i++) {
            cartItems[i].countCart = countCart[i];
            cartItems[i].total = cartItems[i].price * countCart[i]
        }


        var finalPrice = 0;

        cartItems.forEach(product => {
            finalPrice += product.total
        })

        res.locals.wishListLength = wishListLength;
        res.locals.cartLength = cartLength;
        res.locals.cartItems = cartItems;
        res.locals.finalPrice = finalPrice;
    }

    next();
}