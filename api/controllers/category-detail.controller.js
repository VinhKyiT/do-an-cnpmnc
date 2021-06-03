var DetailCategory = require('../../models/detail_category.model');

module.exports.get = async function(req, res){
    var detail_category = await DetailCategory.find();

    res.json(detail_category);
}

module.exports.getByCateID = async function(req, res){
    var cateID = req.params.cateID;
    var detail_category = await DetailCategory.find({id_category: cateID});

    res.json(detail_category);
}