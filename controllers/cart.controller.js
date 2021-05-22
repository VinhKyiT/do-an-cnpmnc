var data = require('../layout.data');
var Product = require('../models/products.model');
var Account = require('../models/account.model');
var products = [];
const axios = require('axios');
var listCity = [];
var name = '';
var phone = '';
var email = '';

module.exports.get = async function(req, res) {
    var currentUser = await Account.findOne({ _id: req.signedCookies.userID });
    if (req.session.cart){
        products = req.session.cart.products;
    }

    if (currentUser) {
        name = currentUser.name;
        phone = currentUser.phone;
        email = currentUser.email;
    }

    await axios.get('https://thongtindoanhnghiep.co/api/city').then(response => {
        response.data.LtsItem.map(c => {
            var city = {
                "id": c.ID,
                "name": c.Title
            }
            listCity.push(city)
        })
    }).catch(err => {
        console.log(err)
    })

    res.render('./cart/index', {
        data: data.data,
        products,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice,
        listCity,
        name,
        email,
        phone
    });
}

module.exports.removeCart = async function(req, res) {
    var productID = req.params.productID;
}