var Category = require('../../models/category.model');

module.exports.get = async function(req, res){
    var category = await Category.find();

    res.json(category);
}