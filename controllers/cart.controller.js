var data = require('../layout.data');
var Product = require('../models/products.model');
var Account = require('../models/account.model');
let Cart = require('../models/cart.model');
var products = [];
const axios = require('axios');
var listCity = [];
var name = '';
var phone = '';
var email = '';

module.exports.get = async function(req, res) {
    var currentUser = await Account.findOne({ _id: req.signedCookies.userID });
    if (!currentUser){
        res.redirect('/authentication');
        return  
    }

    if (req.session.cart){
        products = req.session.cart.products;
    }

    if (currentUser) {
        name = currentUser.name;
        phone = currentUser.phone;
        email = currentUser.email;
    }

    res.render('./cart/index', {
        data: data.data,
        products,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice,
        name,
        email,
        phone
    });
}

module.exports.removeCart = async function(req, res) {
    var productID = req.params.productID;

    var product = await Product.findById(productID);

    var products = [...req.session.cart.products];

    req.session.cart.products.forEach(item => {
        if (product._id.equals(item._id)){
            var index = req.session.cart.products.indexOf(item);
            products.splice(index, 1);
            req.session.cart.products = products;
            req.session.cart.totalPrice -= item.priceSale * item.quantity;
        }
    });

    res.locals.finalPrice = 0;

    Cart.removeCartById(productID);

    res.redirect('back')
}

module.exports.updateCart = async function(req, res) {
    var totalPrice = 0;

    if (typeof req.body.item !== Object){
        res.locals.cartItems[0].quantity = parseInt(req.body.item) 
    }

    for (let i = 0; i < res.locals.cartItems.length; i++) {
        res.locals.cartItems[i].quantity = parseInt(req.body.item[i])    
        Cart.getCart().products[i].quantity = parseInt(req.body.item[i])   
    }
    
    res.locals.cartItems.forEach(item => {
        totalPrice += item.priceSale * item.quantity
    })
    
    Cart.getCart().totalPrice = totalPrice
    
    req.session.cart.totalPrice = totalPrice

    res.redirect('back')
}