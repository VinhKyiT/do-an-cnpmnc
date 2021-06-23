let data = require('../layout.data');
const Account = require('../models/account.model');
const Order = require('../models/order.model');
const OrderDetail = require('../models/order_detail.model')
var _ = require('lodash');
const md5 = require('md5')

module.exports.getProfile = async function(req, res){
    if (!req.signedCookies.userID){
        res.redirect('/authentication')
    }
    res.render('./account/index', {
        currentAccount: res.locals.currentAccount,
        data: data.data,
    })
}

module.exports.getChangePass = async function(req, res){
    //res.render('./account/password')
}

module.exports.getHistory = async function (req, res) {
    var orders = await Order.find({userId: res.locals.currentAccount._id}).sort({
        'date': -1
    });
    res.render("./account/orders", {
        data: data.data,
        currentAccount: res.locals.currentAccount,
        orders,
    });
};

module.exports.cancelOrder = async function (req, res) {
    let order = await Order.findById(req.params.orderId)

    order.status = 'canceled'
    order.markModified('status')
    order.save();
    res.redirect('back')
}

module.exports.getEdit = async function (req, res) {
    res.render('./account/edit', {
        data: data.data,
    })
}

module.exports.getOrdersDetail = async function (req, res) {
    let orderId = req.params.orderId;
    let ordersDetail = await OrderDetail.find({orderId: orderId})
        .populate('productId')
    res.render('./account/orders_detail', {
        data: data.data,
        ordersDetail
    })
}

module.exports.postEditAccount = async function (req, res) {
    var {password, confirm_password} = req.body;
    var account = await Account.findById(res.locals.currentAccount._id);

    if (password !== ''){
        if (confirm_password === ''){
            return
        }else{
            if (password !== confirm_password){
                res.render('./account/edit', {
                    data: data.data,
                    error: "Mật khẩu xác nhận không đúng"
                })
                return;
            }else{
                req.body.password = md5(md5(password))
            }
        }
    }

    _.extend(account, req.body);
    account.save();

    res.redirect('back');
}