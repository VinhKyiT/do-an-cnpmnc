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
let paypal = require('paypal-rest-sdk');
let shortId = require('short-id')
let item = []
let code = '';

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

module.exports.getSuccess = async function(req, res) {
    let code = req.params.code;
    let newOrder = await Order.findOne({code: code});
    res.render('./checkout/success', {
            data: data.data,
            newOrder,
    })
}

module.exports.post = async function(req, res) {
    let country = req.body.countrySelect;
    // let name = req.body.name;
    // let companyName = req.body.companyName;
    // let paymentMethod = req.body.paymentMethod;
    // let address = req.body.address;
    // let email = req.body.email;
    // let phone = req.body.phone;
    code = req.params.code;

    let {name, email, phone, companyName, paymentMethod, address} = req.body;

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

    req.body.total_price = res.locals.finalPrice;
    req.body.total_price = req.body.total_price * 0.000043;
    req.body.total_price = req.body.total_price.toFixed(2);

    console.log(req.body.total_price)

    for (let i = 0; i < res.locals.cartLength; i++) {
        let orderDetail = new OrderDetail();
        orderDetail.orderId = newOrder._id;
        orderDetail.productId = req.session.cart.products[i]._id;
        orderDetail.quantity = req.session.cart.products[i].quantity;
        orderDetail.price = req.session.cart.products[i].priceSale;
        let price = (orderDetail.price* 0.000043).toFixed(2)
        let obj = {
            name: req.session.cart.products[i].name,
            sku: req.session.cart.products[i].code,
            price: parseFloat(price),
            currency: "USD",
            quantity: req.session.cart.products[i].quantity,
        }
        item.push(obj)
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

    if (paymentMethod === 'paypal')
        payPal(item, req, res);
    else
        res.render('./checkout/success', {
            data: data.data,
            newOrder,
        })


}

module.exports.removeCart = async function(req, res) {
    var productID = req.params.productID;
}

var payPal = (item, req, res) => {
    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        redirect_urls: {
            return_url: "http://localhost:4000/checkout/success/"+code,
            cancel_url: "http://localhost:4000/fail",
        },
        transactions: [
            {
                item_list: {
                    items: item,
                },
                amount: {
                    currency: "USD",
                    total: req.body.total_price,
                    details: {
                        subtotal: req.body.total_price,
                    }
                },
                description: "This is the payment description.",
            },
        ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
}