var express = require('express');
var router = express.Router();
var controller = require('../controllers/admin.controller');

router.get('/', controller.get);
router.get('/products', controller.product);
router.get('/category', controller.category);
router.get('/users', controller.user);
router.post('/create', controller.create);
router.get('/delete/:cateID', controller.deleteUser);

module.exports = router;