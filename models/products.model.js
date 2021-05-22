var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    id_detail_category: String,
    name: String,
    price: Number,
    count: Number,
    code: String,
    description: Array,
    image: Array,
    code: String,
    sale: Number,
    weight: Number,
    quantity: Number
});

var Product = mongoose.model('Product', productSchema, 'products');

Product.prototype.priceSale = Product.price - (Product.price * Product.sale) / 100;

module.exports = Product;