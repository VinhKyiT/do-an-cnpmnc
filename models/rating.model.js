let mongoose = require('mongoose');

let ratingSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'Account'
    },
    productId: {
        type: String,
        ref: 'Product'
    },
    date: Date,
    grade: Number,
    comment: String
});

let Rating = mongoose.model('Rating', ratingSchema, 'rating');

module.exports = Rating;