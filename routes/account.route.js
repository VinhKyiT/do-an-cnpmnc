var express = require("express");
var controller = require("../controllers/account.controller");
var router = express.Router();

router.get("/", controller.getProfile);
//router.get("/change-password", controller.getChangePass);
router.get("/history", controller.getHistory);
router.get("/history/cancel/:orderId", controller.cancelOrder)

module.exports = router;
