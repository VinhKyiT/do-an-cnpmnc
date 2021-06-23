var express = require('express');
var controller = require('../controllers/checkout.controller');
const { route } = require('./home.route');
var router = express.Router();

router.get('/', controller.get);
router.post('/:code', controller.post);
router.get('/success/:code', controller.getSuccess)


module.exports = router;