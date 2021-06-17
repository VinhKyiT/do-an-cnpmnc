var data = require('../layout.data');
var Product = require('../models/products.model');
var Account = require('../models/account.model');
var Order = require('../models/order.model');
var Cart = require('../models/cart.model');
var OrderDetail = require('../models/order_detail.model');
var products = [];
const axios = require('axios');
var listCity = [];
var name = '';
var phone = '';
var email = '';
let checkoutCode = '';

module.exports.get = async function(req, res) {
    if (!req.signedCookies.userID){
        res.redirect('/authentication')
    }
    let currentUser = await Account.findOne({ _id: req.signedCookies.userID });
    if (req.session.cart){
        products = req.session.cart.products;
    }

    if (currentUser) {
        name = currentUser.name;
        phone = currentUser.phone;
        email = currentUser.email;
    }

    let orders = await Order.find();

    checkoutCode = 'order_' + (orders.length+1);

    res.render('./checkout/index', {
        data: data.data,
        products,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice,
        listCity,
        name,
        email,
        phone,
        currentUser,
        checkoutCode
    });
}

module.exports.post = async function(req, res) {
    let country = req.body.countrySelect;
    let name = req.body.name;
    let companyName = req.body.companyName;
    let paymentMethod = req.body.paymentMethod;
    let address = req.body.address;
    let email = req.body.email;
    let phone = req.body.phone;
    let code = req.params.code;

    let newOrder = new Order();
    newOrder.userId = req.signedCookies.userID;
    newOrder.date = new Date();
    newOrder.status = 'pending';
    newOrder.payment_method = paymentMethod;
    newOrder.delivery_address = address;
    newOrder.code = code;
    newOrder.name = name;
    newOrder.email = email;
    newOrder.phone = phone;
    newOrder.companyName = companyName;
    Order.create(newOrder);

    for (let i = 0; i < res.locals.cartLength; i++) {
        let orderDetail = new OrderDetail();
        orderDetail.orderId = newOrder._id;
        orderDetail.productId = req.session.cart.products[i]._id;
        orderDetail.quantity = req.session.cart.products[i].quantity;
        orderDetail.price = req.session.cart.products[i].priceSale;
        await OrderDetail.create(orderDetail);
        let product = await Product.findById(req.session.cart.products[i]._id);
        if ((product.count - req.session.cart.products[i].quantity) >= 0){
            product.count = product.count - req.session.cart.products[i].quantity;
            product.markModified('count');
            product.save();
        }
        else res.redirect('/home')
    }

    req.session.destroy();
    res.locals.cartLength = 0;
    res.locals.cartItems = [];
    res.locals.finalPrice = 0;
    Cart.removeCart();

    res.render('./checkout/success', {
        data: data.data,
        newOrder,
    })


}

module.exports.removeCart = async function(req, res) {
    var productID = req.params.productID;
}