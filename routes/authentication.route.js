var express = require('express');
var router = express.Router();
var controller = require('../controllers/authentication.controller');

router.get('/', controller.get);

router.get('/logout', controller.logout);

router.get('/forgot-pass', controller.getForgot)

router.post('/login', controller.postLogin);

router.post('/', controller.postSignUp);

module.exports = router;