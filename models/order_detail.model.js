let mongoose = require('mongoose');

let orderDetailSchema = new mongoose.Schema({
    orderId: {
        type: String,
        ref: 'Order'
    },
    productId: {
        type: String,
        ref: 'Product',
    },
    quantity: String,
})

let OrderDetail = mongoose.model('OrderDetail', orderDetailSchema, 'order_detail')
module.exports = OrderDetail;