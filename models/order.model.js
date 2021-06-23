let mongoose = require('mongoose');
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

let orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'Account',
    },
    date: Date,
    status: String,
    payment_method: String,
    delivery_address: String,
    code: String,
    name: String,
    phone: String,
    email: String,
    companyName: String,
})

orderSchema.post('save', (order) => {
    sendEmail(order)
})

async function sendEmail(order) {
    var transporter = nodemailer.createTransport(
        smtpTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: "vinhkyit2905@gmail.com",
                pass: "jdmeicyzefuryeec",
            },
        })
    );

    var mailOptions = {
        from: "kttstore@gmail.com",
        to: "vinhkyit@ptd.edu.vn",
        subject: "[KTAA] HAVE A NEW ORDER!",
        html: `<h1>CÓ MỘT ĐƠN HÀNG MỚI</h1><br/><p>Nhấn vào link dưới đây để xem chi tiết đơn hàng</p><a href="http://localhost:4000/admin/orders/${order._id}">Click this link</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        }
    });
}

let Order = mongoose.model('Order', orderSchema, 'order')
module.exports = Order;