var data = require('../layout.data');
var Session = require('../models/session.model');
var Product = require('../models/products.model');
var sessionMiddleware = require('../middlewares/session.middleware');

module.exports.get = async function(req, res){
  var sessionID = req.signedCookies.sessionId;
  var session = await Session.findOne({sessionID: sessionID});

  var wishListLength = session.wishlist.length;
  var cartLength = session.cart.length;

  var products = await Product.find({_id: {$in: session.wishlist}})

  res.render('./wishlist/index', {
      data: data.data, 
      products,
      wishListLength: sessionMiddleware.wishListLength,
      cartLength: sessionMiddleware.cartLength, 
      cartItems: sessionMiddleware.cartItems,
      finalPrice: sessionMiddleware.finalPrice
  });
}