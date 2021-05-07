module.exports = function(req, res, next) {
    if (req.signedCookies.userID) {
        res.locals.checkLogin = true;
    } else {
        res.locals.checkLogin = false;
    }

    next();
}