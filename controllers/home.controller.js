var data = require('../layout.data');
var Product = require('../models/products.model');
var DetailCategory = require('../models/detail_category.model')
var Category = require('../models/category.model')
var Account = require('../models/account.model');
var Role = require('../models/role.model');

module.exports.get = async function(req, res) {
    // if(req.signedCookies.userID){
    //     var account = await Account.findById(req.signedCookies.userID);
    //     var role = await Role.findOne({name: "admin"});
    //     if (account.id_role == role._id){
    //         res.redirect('/admin')
    //     }
    // }
    var products = await Product.find();
    var sessionId = req.signedCookies.sessionId;

    var phoneDetailCate = await DetailCategory.find({id_category: "6098d8278b869811e5d1b570"}); //phoneid
    var tabletDetailCate = await DetailCategory.find({id_category: "6098d8278b869811e5d1b571"}); //tabletid

    var list_phone_detail = phoneDetailCate.map(function(cate){
        return cate._id;
    });

    var list_tablet_detail = tabletDetailCate.map(function(cate){
        return cate._id;
    })

    var phones = await Product.find({ id_detail_category: { "$in": list_phone_detail }})
        .populate('id_detail_category');

    var tablets = await Product.find({ id_detail_category: { "$in": list_tablet_detail }})
        .populate('id_detail_category');

    products.forEach(product => {
        product.priceSale = product.price - (product.price * product.sale) / 100
    });

    res.render('./home/index', {
        data: data.data,
        phones,
        tablets,
        checkLogin: res.locals.checkLogin,
        products: products.slice(8, 14),
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice,
        phoneDetailCate,
    });
};