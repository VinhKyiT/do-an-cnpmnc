var Category = require('../models/category.model');
var DetailCategory = require('../models/detail_category.model');
var Product = require('../models/products.model');
var Account = require('../models/account.model');



module.exports.get = function(req, res){
    res.render('./admin/layouts/layout')
}

module.exports.product = async function(req, res){
    var products = await Product.find();

    for(let i = 0; i<products.length; i++ ){
        var detailCate = await DetailCategory.findById(products[i].id_detail_category);
        var category = await Category.findById(detailCate.id_category);
        products[i].type = category.name
    }

    res.render('./admin/products/products', {
        products
    });
}

module.exports.category = async function(req, res){
    var category = await Category.find();
    var cateObj = [];
    var detailObj = [];

    for(let i = 0; i < category.length; i++){
        var detailCate = await DetailCategory.find({id_category: category[i]._id});

        for(let i = 0; i<detailCate.length; i++){
            var products = await Product.find({id_detail_category: detailCate[i]._id});

            detailCate[i].countItems = products.length;
        }

        var myCateObj = {name: category[i].name, countItems: detailCate.length};
        var myDetailObj = {
            name: category[i].name,
            detailCate: detailCate
        };
        cateObj.push(myCateObj);
        detailObj.push(myDetailObj);
    }

    res.render('./admin/products/category', {
        category: cateObj,
        detailCate: detailObj
    })
}

module.exports.user = function(req, res){
    res.render('./admin/users/index')
}

module.exports.create = async function(req, res){
    var name = req.body.cateName;

    var category = new Category();
    category.name = name;

    Category.create(category);

    res.redirect('back');
}

module.exports.deleteUser = async function(req, res){
    var cateID = req.params.cateID

    await Category.findOneAndRemove({name: cateID});


    res.redirect('back')
}

