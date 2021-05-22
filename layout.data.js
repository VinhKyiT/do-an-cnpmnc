var Category = require('./models/category.model');
var DetailCategory = require('./models/detail_category.model');
var Product = require('./models/products.model');

var category;
var detail_device;
var detail_tablet;
var detail_accessories;
var detail_other;
var detail_smartwatch;

async function Data(){
    category = await Category.find();
    var device = await Category.findOne({name: "Điện thoại"});
    var tablet = await Category.findOne({name: "Máy tính bảng"});
    var accessories = await Category.findOne({name: "Phụ kiện"});
    var other = await Category.findOne({name: "Sản phẩm khác"});
    var smartwatch = await Category.findOne({name: "Đồng hồ"});

    detail_device = await DetailCategory.find({id_category: device.id});
    detail_tablet = await DetailCategory.find({id_category: tablet.id});
    detail_accessories = await DetailCategory.find({id_category: accessories.id});
    detail_smartwatch = await DetailCategory.find({id_category: smartwatch.id});
    detail_other = await DetailCategory.find({id_category: other.id});

    var newProducts = await Product.find();

    newProducts = newProducts.slice(newProducts.length - 11, newProducts.length - 1);

    var bestSeller = await Product.find();

    var saleProducts = await Product.find();

    var specialProducts = await Product.find().limit(5);

    var products = await Product.find();

    newProducts.forEach(product => {
        product.priceSale = product.price - (product.price*product.sale)/100;
    });

    bestSeller.forEach(product => {
        product.priceSale = product.price - (product.price*product.sale)/100;
    });

    saleProducts.forEach(product => {
        product.priceSale = product.price - (product.price*product.sale)/100;
    });

    specialProducts.forEach(product => {
        product.priceSale = product.price - (product.price*product.sale)/100;
    });

    var data = [category, detail_device, detail_tablet, detail_accessories, detail_other, newProducts, bestSeller, saleProducts, specialProducts, detail_smartwatch, products]

    module.exports.data = data
}

Data()

