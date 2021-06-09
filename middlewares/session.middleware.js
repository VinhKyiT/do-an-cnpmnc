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

        cartItems.forEach(element => {
            element.priceSale = element.price - (element.price * element.sale) / 100;
        });
        res.locals.cartLength = cartLength;
        res.locals.cartItems = cartItems;
        res.locals.finalPrice = totalPrice;
    }else{
        res.locals.cartLength = 0;
        res.locals.cartItems = [];
        res.locals.finalPrice = 0;
    }

    next();
}