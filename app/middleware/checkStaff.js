const Account = require("../models/Account");
//const setFlashMessage = require("../lib/setFlashMessage");
module.exports = async function checkLogin(req, res, next) {
    const account = await Account.findOne({ _id: req.session.user_id }).lean();
    console.log(account)
    if (account) {
        if (account.role === "staffbh" || account.role === "staffk" || account.role === "staffkt") {
            req.account = account;
            next();
        } else {
            /*req.session.flash = setFlashMessage(
              "error",
              "Invalid account",
              "Please Login!"
            );*/
            console.log('role staff không hợp lệ');
            res.redirect("/");
        }
    } else {
        /*req.session.flash = setFlashMessage(
            "error",
            "Invalid account",
            "Please Login!"
        );*/
        console.log('không tìm thấy account trong check_staff');
        res.redirect("/");
    }
};