var Account = require('../models/account.model');
var Role = require('../models/role.model');

module.exports = async function(req, res, next){
    res.setHeader("Content-Type", "text/html");
    if (!req.signedCookies.userID) {
        res.redirect('/authentication')
        res.end();
    }else{
        var account = await Account.findById(req.signedCookies.userID);
        var role = await Role.findById(account.id_role)
        res.locals.role = role.name
        res.locals.account = account;
        next()
    }
    
}