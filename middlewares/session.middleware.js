var totalPrice = 0;
var cartLength = 0;
var cartItems = [];

module.exports = async function(req, res, next) {
    var timeOut = 86400000
    req.session.cookie.originalMaxAge = timeOut;

    if (req.session.cart){
        totalPrice = req.session.cart.totalPrice;
        cartLength = req.session.cart.products.length
        cartItems = req.session.cart.products
    }

    res.locals.cartLength = cartLength;
    res.locals.cartItems = cartItems;
    res.locals.finalPrice = totalPrice;

    next();
}