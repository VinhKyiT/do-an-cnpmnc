var mongoose = require('mongoose');

var accountSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    phone: String,
    id_role: String,
    address: String,
    delivery_address: String,
});

var Account = mongoose.model('Account', accountSchema, 'account');

module.exports = Account;