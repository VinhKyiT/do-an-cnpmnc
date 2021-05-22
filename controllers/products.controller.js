var data = require('../layout.data');
var Product = require('../models/products.model');
var Category = require('../models/category.model');
var DetailCategory = require('../models/detail_category.model');
var Cart = require('../models/cart.model');
var Wishlist = require('../models/wishlist.model');

module.exports.get = function(req, res) {

}

var AdjustProductsPriceSale = function(products) {
    products.forEach(product => {
        product.priceSale = product.price - (product.price * product.sale) / 100;
    });
}

module.exports.getByCategory = async function(req, res) {
    var cateID = req.params.cateID;
    var page = req.query.page || 1;
    var limit = 12;


    var totalProducts = await Product.find({ id_detail_category: cateID });
    var products = await Product.find({ id_detail_category: cateID })
        .skip((page * limit) - limit)
        .limit(limit);

    AdjustProductsPriceSale(products);

    var maxPage = Math.floor(totalProducts.length / limit)

    if ((totalProducts.length % limit) !== 0) {
        ++maxPage;
    }

    var count = await (await Product.find({ id_detail_category: cateID })).length;

    res.render('./products/index', {
        data: data.data,
        products: products,
        page: parseInt(page),
        limit: parseInt(limit),
        items: (products.length) / limit,
        countItems: parseInt(count),
        cateID,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice,
        maxPage
    });
};

module.exports.getCategory = async function(req, res) {
    var page = req.query.page || 1;
    var cateName = req.params.cateName;
    var limit = 8;
    var sessionId = req.signedCookies.sessionId;

    var category = await Category.findOne({ name: cateName });

    var detail_category = await DetailCategory.find({ id_category: category._id })

    var list_id_detail = detail_category.map(function(cate) {
        return cate._id;
    });

    var products = await Product.find({ id_detail_category: { "$in": list_id_detail } })
        .skip((page * limit) - limit)
        .limit(limit);

    AdjustProductsPriceSale(products)

    var count = await (await Product.find({ id_detail_category: { "$in": list_id_detail } })).length;

    res.render('./products/index', {
        data: data.data,
        products: products,
        page: parseInt(page),
        limit: parseInt(limit),
        items: (products.length) / limit,
        countItems: parseInt(count),
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice
    });
};

module.exports.getDetail = async function(req, res) {
    var code = req.params.code;
    var product = await Product.findOne({ code: code });

    product.priceSale = product.price - (product.price * product.sale) / 100;

    var relatedProducts = await Product.find({ id_detail_category: product.id_detail_category }).limit(6);

    AdjustProductsPriceSale(relatedProducts)

    res.render('./products/detail_products', {
        data: data.data,
        product,
        relatedProducts,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice
    })
};

module.exports.addToCart = async function(req, res) {
    var productID = req.params.productID;

    var product = await Product.findOne({_id: productID});
    product.priceSale = product.price - (product.price * product.sale) / 100;

    Cart.add(product);
    req.session.cart = Cart.getCart();

    res.redirect('back');
};

module.exports.removeFromCart = async function(req, res) {
    var productID = req.params.productID;

    var product = await Product.findOne({_id: productID});
    product.priceSale = product.price - (product.price * product.sale) / 100;

    req.session.cart = Cart.removeCart();

    res.redirect('back');
};

module.exports.addToWishList = async function(req, res) {
    var productID = req.params.productID;

    var product = await Product.findOne({_id: productID});

    Wishlist.add(product);

    req.session.wishList = Wishlist.getWishlist();

    res.redirect('back');
};

module.exports.search = async function(req, res) {
    var productName = req.query.product.toLowerCase();

    var results = await Product.find();

    var products = results.filter(product => {
        return product.name.toLowerCase().indexOf(productName) !== -1;
    });

    AdjustProductsPriceSale(products)

    res.render('./products/index', {
        data: data.data,
        products,
        paggination: false,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice
    })
}