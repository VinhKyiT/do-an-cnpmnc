var data = require('../layout.data');
var sessionMiddleware = require('../middlewares/session.middleware');
var products = []

module.exports.get = async function(req, res){
  if (req.session.wishList){
      products = req.session.wishList.products;
  }

  res.render('./wishlist/index', {
      data: data.data, 
      products,
      cartLength: res.locals.cartLength,
      cartItems: res.locals.cartItems,
      finalPrice: res.locals.finalPrice,
  });
}