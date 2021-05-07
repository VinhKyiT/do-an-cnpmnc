var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
    sessionID: String,
    cart: Array,
    wishlist: Array
});

var Session = mongoose.model('Session', sessionSchema, 'session');

module.exports = Session;