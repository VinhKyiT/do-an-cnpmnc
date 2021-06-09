let mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'Account',
    },
    date: Date,
    status: String,
    payment_method: String,
    delivery_address: String,
    code: String,
    name: String,
    phone: String,
    email: String,
    companyName: String,
})

let Order = mongoose.model('Order', orderSchema, 'order')
module.exports = Order;