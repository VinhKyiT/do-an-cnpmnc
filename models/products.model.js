var mongoose = require('mongoose');
var detail_category = require('./detail_category.model')

var productSchema = new mongoose.Schema({
    id_detail_category: {
        type: String,
        ref: 'DetailCategory'
    },
    name: String,
    price: Number,
    count: Number,
    code: String,
    description: Array,
    image: Array,
    code: String,
    sale: Number,
    quantity: Number
});

var Product = mongoose.model('Product', productSchema, 'products');

Product.prototype.priceSale = Product.price - (Product.price * Product.sale) / 100;

module.exports = Product;