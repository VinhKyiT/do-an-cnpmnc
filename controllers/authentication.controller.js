var data = require('../layout.data');
var Account = require('../models/account.model');
var md5 = require('md5');
const { response } = require('express');
var Role = require('../models/role.model');

module.exports.get = async function(req, res) {

    res.render('./authentication/index', {
        data: data.data
    });
};

module.exports.postLogin = async function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var user = await Account.findOne({ email: email });
    var role = await Role.findOne({_id: user.id_role});

    if (!user) {
        res.render('./authentication/index', {
            error: "Account doesn't exits!",
            data: data.data,
            values: req.body
        });
        return;
    }

    if (md5(md5(password)) !== user.password) {
        res.render('./authentication/index', {
            error: "Wrong password!",
            data: data.data,
            values: req.body
        });
        return;
    }

    res.cookie('userID', user.id, {
        signed: true
    });
    if (role.name === "admin" || role.name === "staff"){
        res.redirect('/admin');
    }else if(role.name === "customer"){
        res.redirect('/home');
    }
};

module.exports.logout = function(req, res) {
    res.clearCookie("userID");
    res.redirect('back');
}

module.exports.postSignUp = async function(req, res) {
    var email = req.body.emailSignUp;
    var name = req.body.name;
    var phone = req.body.phone;
    var password = req.body.passwordSignUp;
    var confirmPass = req.body.confirmPassword;
    var errorSignUp = "";
    var address = "";
    var delivery_address = "";

    var user = await Account.findOne({ email: email });
    var role = await Role.findOne({name: "customer"});

    if (user) {
        errorSignUp = "Account already exist!";
        res.render('./authentication/index', {
            errorSignUp,
            data: data.data,
            values: req.body
        })
        return;
    }


    if (password !== confirmPass) {
        errorSignUp = "Confirm password is not correct!";
        res.render('./authentication/index', {
            errorSignUp,
            data: data.data,
            values: req.body
        })
        return;
    }

    if (password.length < 6) {
        errorSignUp = "Password must be at least 6 characters!"
        res.render('./authentication/index', {
            errorSignUp,
            data: data.data,
            values: req.body
        })
        return;
    }

    var newUser = new Account();

    newUser.email = email;
    newUser.name = name;
    newUser.password = md5(md5(password));
    newUser.phone = phone;
    newUser.id_role = role._id;
    newUser.address = address;
    newUser.delivery_address = delivery_address;

    Account.create(newUser);

    res.redirect('back');

}