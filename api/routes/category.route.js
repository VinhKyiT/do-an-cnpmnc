var express = require('express');
var router = express.Router();
var controller = require('../controllers/category.controller');

router.get('/category', controller.get);

module.exports = router;