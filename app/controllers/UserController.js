const Account = require('../models/Account');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const bcrypt = require("bcrypt");
const upload = require('../../upload');
const multiparty = require('multiparty');
const nodemailer =  require('nodemailer');
const Order = require('../models/Order');
const Statistic = require('../models/Statistic')

class UserController {

    // [GET] /user/home
    async renderHome(req, res, next) {
        const account = req.account;
        let date = new Date()
        let month = date.getMonth() + 1
        let statistic = await Statistic.find({month}).lean()
        //Phân trang sản phẩm
        let PAGE_SKIP = 10
        let page = req.query.page || 0
        //console.log(page)
        let skip = PAGE_SKIP * page
        let query = {'quantity':{'$gt': 0}}
        let count = await Product.count({});
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
        
        const category = await Category.find({}).lean()
        const notify = await Notification.find({}).lean()
        const cart = account.cart
        var cart_product = []
        const len_cart = cart.length
        // cart.forEach(async (item) => {
        //     const p = await Product.findOne({_id: item.id}).lean()
        //     if(p){
        //         console.log(p)
        //         cart_product.push(p)
        //     } 
        // })
        // console.log( "Cart la",cart_product)
        cart.forEach(item => {
            cart_product.push(item)
        })
        console.log( "Cart la",cart_product)
        res.render('./user/home', {account, product, category, cart_product, len_cart, notify, count, page, statistic});
    }

    async renderSearch(req, res){
        let {name_search} = req.body
        const account = req.account;
        //Phân trang sản phẩm
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
        
        const category = await Category.find({}).lean()
        const notify = await Notification.find({}).lean()
        const cart = account.cart
        const cart_product = []
        const len_cart = cart.length
        // cart.forEach(async (item) => {
        //     const p = await Product.findOne({_id: item.id}).lean()
        //     if(p){
        //         cart_product.push(p)
        //     }
        // })
        // console.log(account)
        cart.forEach(item => {
            cart_product.push(item)
        })
        return res.render('./user/home', {account, product, category, cart_product, len_cart, notify, count, page});
    }

    async renderCategory(req, res){
        let {category_product} = req.params
        const account = req.account;
        //Phân trang sản phẩm
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
        
        const category = await Category.find({}).lean()
        const notify = await Notification.find({}).lean()
        const cart = account.cart
        const cart_product = []
        const len_cart = cart.length
        // cart.forEach(async (item) => {
        //     const p = await Product.findOne({_id: item.id}).lean()
        //     if(p){
        //         cart_product.push(p)
        //     }
        // })
        // console.log(account)
        cart.forEach(item => {
            cart_product.push(item)
        })
        //console.log( "Cart la",cart_product)
        return res.render('./user/home', {account, product, category, cart_product, len_cart, notify, count, page});
    }

    async renderCart(req, res, next) {
        const account = req.account;
        const cart = account.cart
        const cart_product = []
        let cart_quantity = cart.quantity
        const notify = await Notification.find({}).lean()
        const len_cart = cart.length
        let date = new Date()
        let month = date.getMonth() + 1
        let statistic = await Statistic.find({month}).lean()
        // cart.forEach(async (item) => {
        //     const p = await Product.findOne({_id: item.id}).lean()
        //     if(p){
        //         console.log(p)
        //         cart_product.push(p)
        //     }
        // })
        cart.forEach(item => {
            cart_product.push(item)
        })
        //console.log( "Cart la",cart_product)
        res.render('./user/cart', {cart_product, account, cart_quantity, len_cart, notify, statistic});
    }

    async renderOrder(req, res){
        const account = req.account;
        const cart = account.cart
        const cart_product = []
        let cart_quantity = cart.quantity
        const notify = await Notification.find({}).lean()
        const len_cart = cart.length
        const order = await Order.find({user_id: account._id}).lean()
        // cart.forEach(async (item) => {
        //     const p = await Product.findOne({_id: item.id}).lean()
        //     if(p){
        //         cart_product.push(p)
        //     }
        // })
        cart.forEach(item => {
            cart_product.push(item)
        })
        //console.log( "Cart la",cart_product)
        res.render('./user/order', {cart_product, account, cart_quantity, len_cart, notify, order});
    }

    async renderNotification(req, res, next) {
        const account = req.account;
        const cart = account.cart
        const cart_product = []
        let cart_quantity = cart.quantity
        const notify = await Notification.find({}).lean()
        const len_cart = cart.length
        // cart.forEach(async (item) => {
        //     const p = await Product.findOne({_id: item.id}).lean()
        //     if(p){
        //         cart_product.push(p)
        //     }
        // })
        cart.forEach(item => {
            cart_product.push(item)
        })
        res.render('./user/notification', {cart_product, account, cart_quantity, len_cart, notify});
    }

    async renderProductDetail(req, res, next) {
        let {id} = req.params
        const product_detail = await Product.find({_id: id}).lean()
        let product_category = product_detail[0].category
        const list_product_category = await Product.find({category: product_category}).lean()
        const product = await Product.find({}).lean()
        const account = req.account;
        const cart = account.cart
        const cart_product = []
        const len_cart = cart.length
        const notify = await Notification.find({}).lean()
        // cart.forEach(async (item) => {
        //     const p = await Product.findOne({_id: item.id}).lean()
        //     if(p){
        //         cart_product.push(p)
        //     }
        // })
        cart.forEach(item => {
            cart_product.push(item)
        })
        res.render('./user/product_detail',{product, product_detail, cart_product, len_cart, notify, account, list_product_category});
    }

    async renderNotificationDetail(req, res){
        let {id} = req.params
        const notify_detail = await Notification.find({_id: id}).lean()
        const account = req.account;
        const cart = account.cart
        const cart_product = []
        const len_cart = cart.length
        const notify = await Notification.find({}).lean()
        // cart.forEach(async (item) => {
        //     const p = await Product.findOne({_id: item.id}).lean()
        //     if(p){
        //         cart_product.push(p)
        //     }
        // })
        cart.forEach(item => {
            cart_product.push(item)
        })
        res.render('./user/notification_detail',{notify_detail, cart_product, len_cart, notify, account});
    }

    async renderInforUser(req, res, next){
        const account = req.account;
        const cart = account.cart
        const cart_product = []
        const len_cart = cart.length
        const notify = await Notification.find({}).lean()
        // cart.forEach(async (item) => {
        //     const p = await Product.findOne({_id: item.id}).lean()
        //     if(p){
        //         cart_product.push(p)
        //     }
        // })
        cart.forEach(item => {
            cart_product.push(item)
        })
        res.render('./user/infor_user', {cart_product, len_cart, notify, account})
    }

    async addToCart(req, res){
        try{
            const account = req.account
            let cart = account.cart
            let {id, quantity, quantity_product} = req.body
            if(quantity == 0){
                return res.json({code: 8, message:'Số lượng sản phẩm phải lớn hơn 0'})
            }
            if(quantity_product == 0){
                return res.json({code: 8, message:'Số lượng sản phẩm phải lớn hơn 0'})
            }
            if(parseInt(quantity_product) < parseInt(quantity)){
                return res.json({code: 7, message:'Số lượng sản phẩm không đủ'})
            }
            if(!id){
                return res.json({code: 1, message:'Thiếu tham số id'})
            }
            let flag = false
            cart.forEach(item => {
                if(item.id === id){
                    flag = true
                }
            })
            if(flag){
                return res.json({code: 2, message:'Sản phẩm đã có trong giỏ hàng'})
            }
            await Product.findByIdAndUpdate(id, {quantity_user: quantity}, {
                new: true
            })
            .then(result => {
                if(result){
                    console.log("Thành công")
                }
                else{
                    console.log("Thất bại")
                }  
            })
            .catch(e => {
                console.log("Có lỗi xảy ra")
            })
            let product = await Product.findOne({_id: id})
            if(!product){
                return res.json({code: 3, message:'Sản phẩm không tồn tại'})
            }
            //console.log(product)
            account.cart.push({
                id: id,
                name: product.name,
                quantity: product.quantity,
                image: product.image,
                old_price: product.old_price,
                new_price: product.new_price,
                quantity_user: product.quantity_user,
                category: product.category,
                description: product.description
            })
            //account.cart.push({id: id, quantity: 1})
            // await account.save()
            // return res.json({code: 0, message: "Thêm vào giỏ hàng thành công"})
            Account.findByIdAndUpdate(account._id, {cart}, {
                new: true
            })
            .then(result => {
                if(result){
                    return res.json({code: 0, message: "Thêm vào giỏ hàng thành công"})
                }
                else{
                    return res.json({code: 4, message: "Không tìm thấy giỏ hàng để thêm"})
                }  
            })
            .catch(e => {
                return res.json({code: 5, message: e.message})
            })
        }
        catch (err) {
            return res.json({code: 6, message: err.message})
        }
    }

    deleteProductCart(req, res){
        let {id} = req.params
        if(!id){
            return res.json({code: 1, message:'Thiếu tham số id'})
        }
        const account = req.account
        let cart = account.cart
        cart.forEach((item, index) => {
            if(item.id === id){
                console.log("CÓ thể xóa")
                cart.splice(index, 1)
            }
        })
        Account.findByIdAndUpdate(account._id, {cart}, {
            new: true
        })
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Xóa sản phẩm ra khỏi giỏ hàng thành công"})
            }
            else{
                return res.json({code: 4, message: "Không tìm thấy sản phẩm trong giỏ hàng để xóa"})
            }  
        })
        .catch(e => {
            return res.json({code: 5, message: e.message})
        })
    }

    deleteProductCartOrder(req, res){
        let {id} = req.params
        if(!id){
            return res.json({code: 1, message:'Thiếu tham số id'})
        }
        const account = req.account
        let cart = account.cart
        cart = []
        console.log("Pop thành công", cart)
        Account.findByIdAndUpdate(account._id, {cart}, {
            new: true
        })
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Xóa sản phẩm ra khỏi giỏ hàng thành công"})
            }
            else{
                return res.json({code: 4, message: "Không tìm thấy sản phẩm trong giỏ hàng để xóa"})
            }  
        })
        .catch(e => {
            return res.json({code: 5, message: e.message})
        })
    }

    async changeQuantityProduct(req, res){
        let {id, quantity_user, quantity} = req.body
        console.log(quantity_user, quantity)
        let new_quantity = parseInt(quantity) - parseInt(quantity_user)
        console.log("New quantity",  new_quantity)
        if(new_quantity < 0){
            new_quantity = 0
        }

        await Product.findByIdAndUpdate(id, {quantity: new_quantity}, {
            new: true
        })
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Cập nhật số lượng sản phẩm thành công"})
            }
            else{
                return res.json({code: 4, message: "Không tìm thấy sản phẩm để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 5, message: e.message})
        })
    }

    async changeProductStatistic(req, res){
        let {quantity_user, id} = req.body

        let statistic = await Statistic.find({_id: id}).lean()
        console.log("Statistic:", statistic)
        let product_sold = statistic[0].product_sold
        product_sold += parseInt(quantity_user)
        console.log("Product sold:", product_sold)

        await Statistic.findByIdAndUpdate(id, {product_sold})
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Cập nhật số lượng sản phẩm thống kê thành công"})
            }
            else{
                return res.json({code: 4, message: "Không tìm thấy sản phẩm thống kê để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 5, message: e.message})
        })
    }

    addOrder(req, res){
        let account = req.account
        let user_id = account._id
        let {name, phone, address, total, array_product} = req.body
        let date = getToday()
        let data = {
            name,
            phone, 
            address,
            total,
            user_id,
            status: 'Chờ Lấy Hàng',
            product: JSON.parse(array_product),
            date,
        }
        const order = new Order(data)
        order.save()
        return res.json({code: 0, message: 'Đặt hàng thành công'})
    }

    async changeInfor(req, res){
        let {username, email, phone, name, sex, date} = req.body
        let account = req.account
        let id = account._id
        // const accountExist = await Account.findOne({email})
        // if(accountExist){
        //     return res.json({code: 1, message: 'Email đã tồn tại'})
        // }
        Account.findByIdAndUpdate(id, {username, email, phone, name, sex, date}, {
            new: true
        })
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Cập nhật thông tin thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy tài khoản để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    changeAvatar(req, res){
        const account = req.account
        let id = account._id
        const form = new multiparty.Form()
        form.parse(req, (err, fields, files) => {
            if (err) console.log(err)
            console.log(files)
            console.log(fields)
            var oldPath = files.image[0].path
            upload(oldPath, files.image[0].originalFilename)
            let image = files.image[0].originalFilename
            Account.findByIdAndUpdate(id, {image}, {
                new: true
            })
            .then(result => {
                if(result){
                    console.log("Thành công")
                }
                else{
                    console.log("Thất bại")
                }  
            })
            .catch(e => {
                console.log("Có lỗi xảy ra")
            })
        })
        res.redirect('/user/user_infor')
    }
}

function getToday() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;
    return today;
}

module.exports = new UserController;