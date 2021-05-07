var express = require('express');
var router = express.Router();
var controller = require('../controllers/authentication.controller');

router.get('/', controller.get);

router.get('/logout', controller.logout);

router.post('/login', controller.postLogin);

router.post('/', controller.postSignUp);

module.exports = router;