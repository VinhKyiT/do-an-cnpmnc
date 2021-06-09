let data = require('../layout.data');
let Product = require('../models/products.model');
let Category = require('../models/category.model');
let DetailCategory = require('../models/detail_category.model');
let Cart = require('../models/cart.model');
let Wishlist = require('../models/wishlist.model');
let Order = require('../models/order.model')
let OrderDetail = require('../models/order_detail.model')
let Rating = require('../models/rating.model')

module.exports.get = function(req, res) {

}

let AdjustProductsPriceSale = function(products) {
    products.forEach(product => {
        product.priceSale = product.price - (product.price * product.sale) / 100;
    });
}

module.exports.getByCategory = async function(req, res) {
    let cateID = req.params.cateID;
    let page = req.query.page || 1;
    let limit = 9;

    let detail_category = await DetailCategory.findOne({_id: cateID});

    let totalProducts = await Product.find({ id_detail_category: cateID });
    let products = await Product.find({ id_detail_category: cateID })
        .skip((page * limit) - limit)
        .limit(limit);

    AdjustProductsPriceSale(products);

    let maxPage = Math.floor(totalProducts.length / limit)

    if ((totalProducts.length % limit) !== 0) {
        ++maxPage;
    }

    let count = (await Product.find({ id_detail_category: cateID })).length;

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
        maxPage,
        detail_category
    });
};

module.exports.getCategory = async function(req, res) {
    let page = req.query.page || 1;
    let cateId = req.params.cateId;
    let limit = 8;
    let sessionId = req.signedCookies.sessionId;

    let category = await Category.findOne({ _id: cateId });

    let detail_category = await DetailCategory.find({ id_category: category._id })

    let list_id_detail = detail_category.map(function(cate) {
        return cate._id;
    });

    let products = await Product.find({ id_detail_category: { "$in": list_id_detail } })
        .skip((page * limit) - limit)
        .limit(limit);

    AdjustProductsPriceSale(products)

    let count = await (await Product.find({ id_detail_category: { "$in": list_id_detail } })).length;

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
    let code = req.params.code;
    let product = await Product.findOne({ code: code });
    let detailCateId = product.id_detail_category;
    let totalRating = 0;

    let ratings = await Rating.find({productId: product._id.toString()})
        .populate('userId')
        .sort({
            'date': -1
        })

    for (let i = 0; i < ratings.length; i++) {
        totalRating = totalRating + ratings[i].grade
    }
    let everageRating = Math.round(totalRating / ratings.length)

    let userOrders = await Order.find({userId: req.signedCookies.userID});

    let list_order_id = userOrders.map(function(order) {
        return order._id;
    })

    let orderDetails = await OrderDetail.find({orderId: {"$in": list_order_id}})

    let isOrdered = false;

    for (let i = 0; i < orderDetails.length; i++) {
        if (orderDetails[i].productId == product._id)
            isOrdered = true;
    }

    let detail_category = await DetailCategory.findOne({_id: detailCateId});

    product.priceSale = product.price - (product.price * product.sale) / 100;

    let relatedProducts = await Product.find({ id_detail_category: detailCateId });
    let relatedCount = relatedProducts.length - 1;

    AdjustProductsPriceSale(relatedProducts)

    res.render('./products/detail_products', {
        data: data.data,
        product,
        relatedProducts,
        relatedCount,
        detail_category,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice,
        isOrdered,
        ratings,
        everageRating
    })
};

module.exports.addToCart = async function(req, res) {
    let productID = req.params.productID;

    let product = await Product.findOne({_id: productID});
    product.priceSale = product.price - (product.price * product.sale) / 100;

    Cart.add(product);
    req.session.cart = Cart.getCart();

    res.redirect('back');
};

module.exports.removeFromCart = async function(req, res) {
    let productID = req.params.productID;

    let product = await Product.findOne({_id: productID});
    product.priceSale = product.price - (product.price * product.sale) / 100;

    req.session.cart = Cart.removeCart();

    res.redirect('back');
};

module.exports.addToWishList = async function(req, res) {
    let productID = req.params.productID;

    let product = await Product.findOne({_id: productID});

    Wishlist.add(product);

    req.session.wishList = Wishlist.getWishlist();
    res.redirect('back');
};

module.exports.search = async function(req, res) {
    let productName = req.query.product.toLowerCase();

    let results = await Product.find()
        .populate('id_detail_category')

    let products = results.filter(product => {
        return product.name.toLowerCase().indexOf(productName) !== -1;
    })

    AdjustProductsPriceSale(products)

    res.render('./products/search', {
        data: data.data,
        products,
        paggination: false,
        cartLength: res.locals.cartLength,
        cartItems: res.locals.cartItems,
        finalPrice: res.locals.finalPrice
    })
}

module.exports.postRating = async function(req, res) {
    let grade = req.body.grade;
    let comment = req.body.comment;
    let date = new Date();
    let productId = req.params.productId;

    console.log(grade)

    let newRating = new Rating();
    newRating.userId = req.signedCookies.userID;
    newRating.grade = grade;
    newRating.comment = comment;
    newRating.date = date;
    newRating.productId = productId;

    Rating.create(newRating);

    res.redirect('back');
}