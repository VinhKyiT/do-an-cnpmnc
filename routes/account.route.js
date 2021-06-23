var express = require("express");
var controller = require("../controllers/account.controller");
var router = express.Router();

router.get("/", controller.getProfile);
//router.get("/change-password", controller.getChangePass);
router.get("/history", controller.getHistory);
router.get("/edit/:userId", controller.getEdit);
router.get("/history/cancel/:orderId", controller.cancelOrder)
router.get("/history/detail/:orderId", controller.getOrdersDetail)

router.post("/edit/:accountID", controller.postEditAccount)

module.exports = router;
