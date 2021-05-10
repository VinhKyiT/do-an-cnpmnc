var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    id: String,
    id_detail_category: String,
    name: String,
    price: Number,
    count: Number,
    status: Boolean,
    description: Array,
    image: Array,
    code: String,
    sale: Number,
    weight: Number
});

var Product = mongoose.model('Product', productSchema, 'products');

Product.prototype.priceSale = Product.price - (Product.price * Product.sale) / 100;

module.exports = Product;