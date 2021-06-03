var express = require('express');
var router = express.Router();
var controller = require('../controllers/category-detail.controller');

router.get('/category-detail', controller.get);
router.get('/category-detail/:cateID', controller.getByCateID);

module.exports = router;