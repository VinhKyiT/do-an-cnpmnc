var mongoose = require('mongoose');

var roleSchema = new mongoose.Schema({
    name: String
});

var Role = mongoose.model('Role', roleSchema, 'role');

module.exports = Role;