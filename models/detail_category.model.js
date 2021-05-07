var mongoose = require('mongoose');

var detailCategorySchema = new mongoose.Schema({
    name: String,
    image: String,
    id_category: String
});

var DetailCategory = mongoose.model('DetailCategory', detailCategorySchema, 'detail_category');

module.exports = DetailCategory;