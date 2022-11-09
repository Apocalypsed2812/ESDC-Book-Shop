const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const Staff = require('../models/Staff');
const Product = require('../models/Product');
const Category = require('../models/Category');
const multiparty = require('multiparty');
const upload = require('../../upload');
const crypto = require('crypto');
const nodemailer =  require('nodemailer');
const jwt = require("jsonwebtoken");
const credentials = require("../../credentials");

class AccountController{

    async renderHome(req, res){
        const category = await Category.find({}).lean()
        let PAGE_SKIP = 10
        let page = req.query.page || 0
        //console.log(page)
        let skip = PAGE_SKIP * page
        let count = await Product.count({});
        let query = {'quantity':{'$gt': 0}}
        let product = await Product
                .find(query)
                .skip(skip)
                .limit(PAGE_SKIP)
                .lean()
        // let product = []
        // productList.forEach(item => {
        //     if(item.quantity > 0){
        //         product.push(item)
        //     }
        // })
        res.render('./index', {product, category, page, count})
    }

    async renderCategoryProduct(req, res){
        let {category_product} = req.params
        const category = await Category.find({}).lean()
        console.log("category", category_product)
        let PAGE_SKIP = 10
        let page = req.query.page || 0
        //console.log(page)
        let skip = PAGE_SKIP * page
        let count = await Product.count({});
        let product = await Product
                .find({category_id: category_product})
                .skip(skip)
                .limit(PAGE_SKIP)
                .lean()
        console.log(product)
        res.render('./index', {product, category, page, count})
    }

    async renderSearch(req, res){
        let {name_search} = req.body
        const category = await Category.find({}).lean()
        let PAGE_SKIP = 10
        let page = req.query.page || 0
        //console.log(page)
        let skip = PAGE_SKIP * page
        let count = await Product.count({});
        let product = await Product
                .find({name: name_search})
                .skip(skip)
                .limit(PAGE_SKIP)
                .lean()
        res.render('./index', {product, category, page, count})
    }



    async renderProductDetail(req, res){
        let {id} = req.params
        const product_detail = await Product.find({_id: id}).lean()
        let product_category = product_detail[0].category
        const list_product_category = await Product.find({category: product_category}).lean()
        const product = await Product.find({}).lean()
        res.render('./product_detail', {product, product_detail, list_product_category})
    }

    renderForgotPassword(req, res){
        res.render('./forgot_password')
    }

    async createOTP(req, res, next) {
        const { phone, email, type} = req.body;
        const acc = await Account.findOne({ phone, email }).lean();
        if (!acc) {
            return res.json({ code: 1, message: "Tài khoản không tồn tại!" });
        }

        const otpfind = await OTP.findOne({ phone, type });
        if (otpfind) {
            await OTP.findOneAndDelete({ phone, type });
        }
        const otpCode = otp.createOTP();
        const data = { phone, code: otpCode, type };
        const o = new OTP(data);
        await o.save();
        otp.deleteOTP(o._id);
        console.log("OTP CODE: ", otpCode);
        sendMailOTP(email, otpCode, type);
        return res.json({ code: 0, message: "Create OTP Sucessfully" });
    }


    async forgotPassword(req, res){
        const { phone_forgot, email_forgot, otp_code } = req.body;
        const optFind = await OTP.findOne({ phone: phone_forgot, code: otp_code, type: "forgot_password" });
        if (!optFind) {
            // req.session.flash = {
            //     type: "error",
            //     message: "Otp Code is not correct!",
            //     title: "Error!",
            // };
            console.log("OTP đã hết hạn")
            res.redirect("/forgot_password");
            return;
        } else {
            const tokenObj = { phone_forgot };
            const token = jwt.sign(tokenObj, credentials.cookieSecret);
            res.cookie("resetpass", token, {
                maxAge: 900000,
                httpOnly: true,
            });
            res.redirect("/reset_password");
            return;
        }
    }

    renderResetPassword(req, res){
        res.render('./reset_password')
    }

    async resetPassword(req, res){
        const token = req.cookies.resetpass;
        if (!token) {
            console.log("Token cần thiết để reset password")
            res.redirect("/login");
            return;
        }
        const decoded = jwt.verify(token, credentials.cookieSecret);
        const account = await Account.findOne({
            phone: decoded.phone_forgot,
        }).lean();

        if (!account) {
            console.log("Taì khoản không tồn tại")
            res.redirect("/login");
        }
        const newPassword = req.body.password;
        const confirmPassword = req.body.password_confirm;
        if (newPassword !== confirmPassword) {
            //res.send("Mật khẩu không khớp");
            console.log("Mật khẩu không khớp")
        } else {
            console.log(account)
            const hash = await bcrypt.hash(newPassword, 10);
            await Account.findOneAndUpdate(
                { _id: account._id },
                { password: hash }
            );
            return res.json({code: 0, message: 'Reset mật khẩu thành công'})
        }
    }

    // renderRegister(req, res, next) {
    //     //delete req.session.user_id;
    //     let error = req.flash('error') || ''
    //     res.render("./register", {error});
    // }

    async loginByAccount(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        
        // if(!username.includes('@')){
        //     return res.json({code: 1, message: 'Email không hợp lệ'})
        // }

        let account = await Account.findOne({ username });
        if (account) {
            if (bcrypt.compareSync(password, account.password)) {
                req.session.user_id = account._id;
                if (account.role === "admin") {
                    return res.json({code: 0, message: 'Đăng nhập thành công'})
                } 
                else if(account.role === "user") {
                    return res.json({code: 1, message: 'Đăng nhập thành công', data: account})
                } 
                else if(account.role === "staffbh") {
                    return res.json({code: 2, message: 'Đăng nhập thành công', data: account})
                } 
                else if(account.role === "staffk") {
                    return res.json({code: 3, message: 'Đăng nhập thành công', data: account})
                } 
                else if(account.role === "staffkt") {
                    return res.json({code: 4, message: 'Đăng nhập thành công', data: account})
                } 
            } 
            else {
                return res.json({code: 5, message: 'Sai mật khẩu'})
            }
        } 
        else {
            return res.json({code: 4, message: 'Tài khoản không tồn tại'})
        }
    }

    logOut(req, res, next) {
        delete req.session.user_id;
        // delete req.session.change_password;
        res.redirect('/')
    }

    async register(req, res) {
        let {username, password, rePassword} = req.body
        if(password !== rePassword){
            return res.json({code: 1, message: 'Mật khẩu không khớp'})
        }

        const accountExist = await Account.findOne({username})
        // let {user_id} = await Counter.findOneAndUpdate(
        //     {}, 
        //     {$inc: {count: 1}}, 
        //     {new: true}
        // );
        console.log(accountExist)
        if(accountExist){
            return res.json({code: 3, message: 'Tài khoản đã tồn tại'})
        }
        const hashed = bcrypt.hashSync(password, 10)
        let data = {
            username,
            password: hashed,
            role: 'user',
            //user_id
        }
        const account = new Account(data)
        account.save()
        return res.json({code: 0, message: 'Đăng kí thành công'})
    }

    async checkChangePassword(req, res){
        let account = await Account.find({_id: req.session.user_id})
        if(account.token === 0){
            res.redirect('/change_password')
        }
    }

    async changePassword(req, res){
        let {old_password, new_password, re_new_password} = req.body
        const account = await Account.findOne({ _id: req.session.user_id }).lean();
        
        if(!bcrypt.compareSync(old_password, account.password)){
            return res.json({code: 1, message: 'Mật khẩu cũ không đúng'})
        }
        if(new_password !== re_new_password){
            return res.json({code: 2, message: 'Mật khẩu mới không khớp'})
        }
        const hash = await bcrypt.hash(new_password, 10);
        await Account.findByIdAndUpdate(account._id, {password: hash}, {
            new: true
        })
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Đổi mật khẩu thành công"})
            }
            else{
                return res.json({code: 3, message: "Khôg tìm thấy tài khoản để đổi mật khẩu"})
            }  
        })
        .catch(e => {
            return res.json({code: 4, message: e.message})
        })
    }

}

// send Mail
function sendMail(email, username, password) {
    //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
    var transporter =  nodemailer.createTransport({ // config mail server
        host: 'smtp.gmail.com',
        port: 465,
        //secure: true,
        auth: {
            user: 'phamhuynhanhtien123@gmail.com', //Tài khoản gmail vừa tạo
            pass: 'anhtien2812' //Mật khẩu tài khoản gmail vừa tạo
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    var content = '';
    content += `Send Email By Nodemailer`
    contentHTML = `<p>Username của bạn là ${username} </p> 
                    <p>Password của bạn là ${password} </p> 
                    <p>Bạn đã có thể tiến hành đăng nhập và đổi mật khẩu</p>`;
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'phamhuynhanhtien123@gmail.com',
        to: email,
        subject: 'Gửi Username và Password cho ví điện tử',
        text: content,
        html: contentHTML, //Nội dung html mình đã tạo trên kia :))
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
            //req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
            //res.redirect('/login');
        } else {
            console.log('Message sent: ' +  info.response);
            //res.redirect('/login');
        }
    });
}

// send Mail
function sendMailOTP(email, code, type) {
    //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
    var transporter =  nodemailer.createTransport({ // config mail server
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'phamhuynhanhtien123@gmail.com', //Tài khoản gmail vừa tạo
            pass: 'anhtien2812' //Mật khẩu tài khoản gmail vừa tạo
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    var content = '';
    content += `Send Email By Nodemailer`
    contentHTML = `<div>
                        <p>Mã OTP của bạn là ${code} </p>  
                        <p>Thời hạn nhập OTP là 1 phút</p>
                    </div>`;
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'phamhuynhanhtien123@gmail.com',
        to: email,
        subject: 'Gửi OTP để lấy lại mật khẩu',
        text: content,
        html: contentHTML, //Nội dung html mình đã tạo trên kia :))
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
            //req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
            //res.redirect('/login');
        } else {
            console.log('Message sent: ' +  info.response);
            //res.redirect('/login');
        }
    });
}

module.exports = new AccountController
