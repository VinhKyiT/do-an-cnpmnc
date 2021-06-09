let Category = require('../models/category.model');
let DetailCategory = require('../models/detail_category.model');
let Product = require('../models/products.model');
let Account = require('../models/account.model')
let Role = require('../models/role.model');
let Order = require('../models/order.model');
let OrderDetail = require('../models/order_detail.model');
let md5 = require('md5');


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
    let products = await Product.find();

    for(let i = 0; i<products.length; i++ ){
        let detailCate = await DetailCategory.findById(products[i].id_detail_category);
        let category = await Category.findById(detailCate.id_category);
        products[i].type = category.name
    }

    res.render('./admin/products/products', {
        products,
        account: res.locals.account
    });
}

module.exports.createProduct = async function(req, res){
    let name = req.body.productName;
    let price = req.body.price;
    let code = req.body.code;
    let id_detail_category = req.body.categoryDetail;
    let description = req.body.description;
    req.body.avatar = []

    req.files.forEach(file => {
        let path = '/' + file.path.split('\\').slice(1).join('/');
        req.body.avatar.push(path)
    })
    description = description.split('\r').join('').split('\n');

    let product = new Product({
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
    let productID = req.params.productID;
    let product = await Product.findById(productID)

    product.description = product.description.join('\n');

    res.render('./admin/products/editProduct', {
        product,
        description: product.description.toString()
    })
}

module.exports.postEditProduct = async function(req, res){
    let productID = req.params.productID;
    let product = await Product.findById(productID);
    let description = req.body.description;
    description = description.split('\r').join('').split('\n');

    product.name = req.body.nameProduct;
    product.price = req.body.price;
    product.count = req.body.count;
    product.code = req.body.code;
    product.description = description;

    for (let file of Object.keys(req.files)) {
        let index = parseInt(file.split('avatar-').join(''));
        let data = req.files[file];
        let path = '/' + data[0].path.split('\\').slice(1).join('/');
        product.image[index] = path;
        product.markModified('image')
    }

    product.save();

    res.redirect('/admin/products');
}

module.exports.deleteProduct = async function(req, res){
    let productID = req.params.productID;

    await Product.findByIdAndDelete(productID);

    res.redirect('back');
}

//Category
module.exports.category = async function(req, res){
    let category = await Category.find();
    let cateObj = [];
    let detailObj = [];

    for(let i = 0; i < category.length; i++){
        let detailCate = await DetailCategory.find({id_category: category[i]._id});

        for(let i = 0; i<detailCate.length; i++){
            let products = await Product.find({id_detail_category: detailCate[i]._id});


            detailCate[i].countItems = products.length;
        }

        let myCateObj = {id: category[i]._id,name: category[i].name, countItems: detailCate.length};
        let myDetailObj = {
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
    let name = req.body.categoryName;

    let category = new Category();
    category.name= name;

    await Category.create(category);

    res.redirect('back');
}

module.exports.getEditCate = async function(req, res){
    let cateID = req.params.cateID;

    let category = await Category.findById(cateID);

    res.render('./admin/category/editCategory', {
        category,
        account: res.locals.account
    })
}

module.exports.postEditCate = async function(req, res){
    let cateID = req.params.cateID;
    let name = req.body.cateName;

    await Category.findOneAndUpdate(
        {_id: cateID},
        {$set: {name: name}}
    );

    res.redirect('/admin/category')
}

module.exports.deleteCate = async function(req, res){
    let cateID = req.params.cateID;

    await Category.findByIdAndDelete(cateID);

    res.redirect('/admin/category')
}

//Category Detail
module.exports.createDetailCate = async function(req, res){
    let name = req.body.detailName;
    let categoryID = req.params.categoryID;

    let detailCate = new DetailCategory();
    detailCate.name = name;
    detailCate.id_category = categoryID

    await DetailCategory.create(detailCate);

    res.redirect('back');
}

module.exports.deleteDetailCate =async function(req, res){
    let detailCateID = req.params.detailCate;

    await DetailCategory.findByIdAndDelete(detailCateID);

    res.redirect('back')
}

module.exports.getEditDetailCate = async function(req, res){
    let detailCateID = req.params.detailCate;

    let detailCate = await DetailCategory.findById(detailCateID);
    let category = await Category.find();

    res.render('./admin/category/editDetailCategory',{
        detailCate,
        category,
        account: res.locals.account
    })
}

module.exports.postEditDetailCate = async function(req, res){
    let nameDetail = req.body.detailCateName;
    let categoryID = req.body.category;
    let detailCateID = req.params.detailCate;

    let detailCate = await DetailCategory.findById(detailCateID);

    detailCate.name = nameDetail;
    detailCate.id_category = categoryID;

    await detailCate.save();

    res.redirect('/admin/category')
}

//Users
module.exports.user = async function(req, res){
    let accounts = await Account.find();
    let roles = await Role.find();
    for(let i = 0; i<accounts.length; i++){
        let role = await Role.findById(accounts[i].id_role);
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
    let newAccount = new Account(req.body);
    Account.create(newAccount);
    res.redirect('back')
}

module.exports.deleteUser = async function(req, res){
    let accountID = req.params.accountID
    await Account.findByIdAndDelete(accountID)
    res.redirect('back')
}

module.exports.getEditUser = async function(req, res){
    let acc = await Account.findById(req.params.accountID);
    let roles = await Role.find();
    res.render('./admin/users/editUser', {
        acc,
        roles
    })
}

module.exports.postEditUser = async function(req, res){
    let account = await Account.findById(req.params.accountID);
    account.name = req.body.name;
    account.email = req.body.email;
    account.phone = req.body.phone;
    account.id_role = req.body.id_role;
    await account.save();
    res.redirect('/admin/users')
}

//Role
module.exports.getRole = async function(req, res){
    let roles = await Role.find();

    res.render('./admin/role/index', {
        roles
    })
}

module.exports.createRole = async function(req, res){
    let role = new Role(req.body);
    await Role.create(role);
    res.redirect('back');
}

module.exports.getEditRole = async function(req, res){
    let editRole = await Role.findById(req.params.roleID);

    res.render('./admin/role/editRole', {
        editRole,
        account: res.locals.account
    })
}

module.exports.postEditRole = async function(req, res){
    let role = await Role.findById(req.params.roleID);
    role.name = req.body.name;
    role.markModified('name');
    role.save();
    res.redirect('back');
}

module.exports.deleteRole = async function(req, res){
    await Role.findByIdAndDelete(req.params.roleID);
    res.redirect('back')
}

//Orders
module.exports.getOrders = async function(req, res){
    let orders = await Order.find().sort({
        'date': -1,
        'status': 1,
        'payment_method': 1,
    })
        .populate('userId');

    res.render('./admin/orders/index', {
        orders
    })
}

module.exports.getOrder = async function(req, res){
    let order = await Order.findById(req.params.orderID)
    res.render('./admin/orders/editOrder',{
        order
    })
}

module.exports.postEditOrder = async function(req, res){
    let orderToEdit = await Order.findById(req.params.orderID)

    orderToEdit.payment_method = req.body.payment_method;
    orderToEdit.delivery_address = req.body.delivery_address;
    orderToEdit.status = req.body.status;

    orderToEdit.markModified('payment_method');
    orderToEdit.markModified('delivery_address');
    orderToEdit.markModified('status');

    orderToEdit.save();
    res.redirect('back')
}















