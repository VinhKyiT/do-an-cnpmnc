let data = require('../layout.data');
let Product = require('../models/products.model');
let DetailCategory = require('../models/detail_category.model')
let Category = require('../models/category.model')
let Account = require('../models/account.model');
let Role = require('../models/role.model');

module.exports.get = async function(req, res) {
    // if(req.signedCookies.userID){
    //     let account = await Account.findById(req.signedCookies.userID);
    //     let role = await Role.findOne({name: "admin"});
    //     if (account.id_role == role._id){
    //         res.redirect('/admin')
    //     }
    // }
    let products = await Product.find();
    let sessionId = req.signedCookies.sessionId;

    let phoneDetailCate = await DetailCategory.find({id_category: "6098d8278b869811e5d1b570"}); //phoneid
    let tabletDetailCate = await DetailCategory.find({id_category: "6098d8278b869811e5d1b571"}); //tabletid
    let accessoriesCate = await DetailCategory.find({id_category: "6098d8278b869811e5d1b572"}) //accessoriesid

    let list_phone_detail = phoneDetailCate.map(function(cate){
        return cate._id;
    });

    let list_tablet_detail = tabletDetailCate.map(function(cate){
        return cate._id;
    })

    let list_accessories_detail = accessoriesCate.map(function(cate){
        return cate._id;
    })

    let phones_result = await Product.find({ id_detail_category: { "$in": list_phone_detail }})
        .populate('id_detail_category');

    let phones = phones_result.filter(p => p.count > 0);

    let tablets_result = await Product.find({ id_detail_category: { "$in": list_tablet_detail }})
        .populate('id_detail_category');

    let tablets = tablets_result.filter(p => p.count > 0);

    let accessories_result = await Product.find({ id_detail_category: {"$in": list_accessories_detail}})
        .populate('id_detail_category')

    accessories = accessories_result.filter(p => p.count > 0)

    products.forEach(product => {
        product.priceSale = product.price - (product.price * product.sale) / 100
    });

    res.render('./home/index', {
        data: data.data,
        phones,
        tablets,
        accessories,
        checkLogin: res.locals.checkLogin,
        products: products.slice(8, 14),
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice,
        phoneDetailCate,
    });
};