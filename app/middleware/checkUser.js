const Account = require("../models/Account");
//const setFlashMessage = require("../lib/setFlashMessage");
module.exports = async function checkLogin(req, res, next) {
    const account = await Account.findOne({ _id: req.session.user_id }).lean();
    console.log(account)
    if (account) {
        if (account.role === "user") {
            req.account = account;
            next();
        } else {
            console.log('role user không hợp lệ');
            res.redirect("/");
        }
    } else {
        console.log('không tìm thấy account trong check_user');
        res.redirect("/");
    }
};