let Category = require('./models/category.model');
let DetailCategory = require('./models/detail_category.model');
let Product = require('./models/products.model');


let category;
let detail_device;
let detail_tablet;
let detail_accessories;
let detail_other;
let detail_smartwatch;

async function Data(){

    category = await Category.find();
    let device = await Category.findOne({name: "Điện thoại"});
    let tablet = await Category.findOne({name: "Máy tính bảng"});
    let accessories = await Category.findOne({name: "Phụ kiện"});
    let other = await Category.findOne({name: "Sản phẩm khác"});
    let smartwatch = await Category.findOne({name: "Đồng hồ"});

    detail_device = await DetailCategory.find({id_category: device.id});
    detail_tablet = await DetailCategory.find({id_category: tablet.id});
    detail_accessories = await DetailCategory.find({id_category: accessories.id});
    detail_smartwatch = await DetailCategory.find({id_category: smartwatch.id});
    detail_other = await DetailCategory.find({id_category: other.id});

    let newProducts = await Product.find()
        .populate('id_detail_category')

    newProducts = newProducts.slice(newProducts.length - 11, newProducts.length - 1);

    let bestSellers = await Product.find()
        .populate('id_detail_category')

    let bestSeller = bestSellers.filter(c => c.count > 0);

    let saleProducts = await Product.find()
        .populate('id_detail_category')

    let specialProducts = await Product.find().limit(5)
        .populate('id_detail_category')

    let products = await Product.find();

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

    let data = [category, detail_device, detail_tablet, detail_accessories, detail_other, newProducts, bestSeller, saleProducts, specialProducts, detail_smartwatch, products]

    module.exports.data = data
}

Data()

