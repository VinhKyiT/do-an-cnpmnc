let Account = require('../models/account.model')
module.exports = async function(req, res, next) {
    if (req.signedCookies.userID) {
        res.locals.checkLogin = true;
        let currentAccount = await Account.findById(req.signedCookies.userID).populate('id_role');
        res.locals.currentAccount = currentAccount;
    } else {
        res.locals.checkLogin = false;
    }

    next();
}