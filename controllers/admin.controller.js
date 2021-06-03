var Category = require('../models/category.model');
var DetailCategory = require('../models/detail_category.model');
var Product = require('../models/products.model');
var Account = require('../models/account.model')
var Role = require('../models/role.model');
var md5 = require('md5');


//Home
module.exports.get = async function(req, res){
    res.render('./admin/layouts/layout', {
        role: res.locals.role,
        account: res.locals.account
    })
}

module.exports.logout = function(req, res) {
    res.clearCookie("userID");
    res.redirect('/home');
}

//Products
module.exports.product = async function(req, res){
    var products = await Product.find();

    for(let i = 0; i<products.length; i++ ){
        var detailCate = await DetailCategory.findById(products[i].id_detail_category);
        var category = await Category.findById(detailCate.id_category);
        products[i].type = category.name
    }

    res.render('./admin/products/products', {
        products,
        account: res.locals.account
    });
}

module.exports.createProduct = async function(req, res){
    var name = req.body.productName;
    var price = req.body.price;
    var code = req.body.code;
    var id_detail_category = req.body.categoryDetail;
    var description = req.body.description;
    req.body.avatar = []

    req.files.forEach(file => {
        var path = '/' + file.path.split('\\').slice(1).join('/');
        req.body.avatar.push(path)
    })
    description = description.split('\r').join('').split('\n');

    var product = new Product({
        id_detail_category: id_detail_category,
        name: name,
        price: price,
        code: code,
        image: req.body.avatar,
        count: 10,
        description: description
    })
    console.log(product)
    await Product.create(product);

    res.redirect('back')
}

module.exports.getEditProduct = async function(req, res){
    var productID = req.params.productID;
    var product = await Product.findById(productID)

    product.description = product.description.join('\n');

    res.render('./admin/products/editProduct', {
        product,
        description: product.description.toString()
    })
}

module.exports.postEditProduct = async function(req, res){
    var productID = req.params.productID;
    var product = await Product.findById(productID);
    var description = req.body.description;
    description = description.split('\r').join('').split('\n');

    product.name = req.body.nameProduct;
    product.price = req.body.price;
    product.count = req.body.count;
    product.code = req.body.code;
    product.description = description;

    for (let file of Object.keys(req.files)) {
        var index = parseInt(file.split('avatar-').join(''));
        var data = req.files[file];
        var path = '/' + data[0].path.split('\\').slice(1).join('/');
        product.image[index] = path;
        product.markModified('image')
    }

    product.save();

    res.redirect('/admin/products');
}

module.exports.deleteProduct = async function(req, res){
    var productID = req.params.productID;

    await Product.findByIdAndDelete(productID);

    res.redirect('back');
}

//Category
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

        var myCateObj = {id: category[i]._id,name: category[i].name, countItems: detailCate.length};
        var myDetailObj = {
            id: category[i]._id,
            name: category[i].name,
            detailCate: detailCate
        };
        cateObj.push(myCateObj);
        detailObj.push(myDetailObj);
    }

    res.render('./admin/category/index', {
        category: cateObj,
        detailCate: detailObj,
        account: res.locals.account
    })
}

module.exports.createCategory = async function(req, res){
    var name = req.body.categoryName;

    var category = new Category();
    category.name= name;

    await Category.create(category);

    res.redirect('back');
}

module.exports.getEditCate = async function(req, res){
    var cateID = req.params.cateID;

    var category = await Category.findById(cateID);

    res.render('./admin/category/editCategory', {
        category,
        account: res.locals.account
    })
}

module.exports.postEditCate = async function(req, res){
    var cateID = req.params.cateID;
    var name = req.body.cateName;

    await Category.findOneAndUpdate(
        {_id: cateID},
        {$set: {name: name}}
    );

    res.redirect('/admin/category')
}

module.exports.deleteCate = async function(req, res){
    var cateID = req.params.cateID;

    await Category.findByIdAndDelete(cateID);

    res.redirect('/admin/category')
}

//Category Detail
module.exports.createDetailCate = async function(req, res){
    var name = req.body.detailName;
    var categoryID = req.params.categoryID;

    var detailCate = new DetailCategory();
    detailCate.name = name;
    detailCate.id_category = categoryID

    await DetailCategory.create(detailCate);

    res.redirect('back');
}

module.exports.deleteDetailCate =async function(req, res){
    var detailCateID = req.params.detailCate;

    await DetailCategory.findByIdAndDelete(detailCateID);

    res.redirect('back')
}

module.exports.getEditDetailCate = async function(req, res){
    var detailCateID = req.params.detailCate;

    var detailCate = await DetailCategory.findById(detailCateID);
    var category = await Category.find();

    res.render('./admin/category/editDetailCategory',{
        detailCate,
        category,
        account: res.locals.account
    })
}

module.exports.postEditDetailCate = async function(req, res){
    var nameDetail = req.body.detailCateName;
    var categoryID = req.body.category;
    var detailCateID = req.params.detailCate;

    var detailCate = await DetailCategory.findById(detailCateID);

    detailCate.name = nameDetail;
    detailCate.id_category = categoryID;

    await detailCate.save();

    res.redirect('/admin/category')
}

//Users
module.exports.user = async function(req, res){
    var accounts = await Account.find();
    var roles = await Role.find();
    for(let i = 0; i<accounts.length; i++){
        var role = await Role.findById(accounts[i].id_role);
        accounts[i].role = role.name
    }
    res.render('./admin/users/index', {
        account: res.locals.account,
        accounts,
        roles
    })
}

module.exports.createUser = async function(req, res){
    req.body.password = md5("123");
    var newAccount = new Account(req.body);
    Account.create(newAccount);
    res.redirect('back')
}

module.exports.deleteUser = async function(req, res){
    var accountID = req.params.accountID
    await Account.findByIdAndDelete(accountID)
    res.redirect('back')
}

module.exports.getEditUser = async function(req, res){
    var acc = await Account.findById(req.params.accountID);
    var roles = await Role.find();
    res.render('./admin/users/editUser', {
        acc,
        roles
    })
}

module.exports.postEditUser = async function(req, res){
    var account = await Account.findById(req.params.accountID);
    account.name = req.body.name;
    account.email = req.body.email;
    account.phone = req.body.phone;
    account.id_role = req.body.id_role;
    await account.save();
    res.redirect('/admin/users')
}

//Role
module.exports.getRole = async function(req, res){
    var roles = await Role.find();

    res.render('./admin/role/index', {
        roles
    })
}

module.exports.createRole = async function(req, res){
    var role = new Role(req.body);
    await Role.create(role);
    res.redirect('back');
}

module.exports.getEditRole = async function(req, res){
    var editRole = await Role.findById(req.params.roleID);

    res.render('./admin/role/editRole', {
        editRole,
        account: res.locals.account
    })
}

module.exports.postEditRole = async function(req, res){
    var role = await Role.findById(req.params.roleID);
    role.name = req.body.name;
    role.markModified('name');
    role.save();
    res.redirect('back');
}

module.exports.deleteRole = async function(req, res){
    await Role.findByIdAndDelete(req.params.roleID);
    res.redirect('back')
}
















