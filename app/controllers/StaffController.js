const Account = require('../models/Account');
const Category = require('../models/Category');
const bcrypt = require("bcrypt");
const upload = require('../../upload');
// const upload_file = require('../../upload_file');
const fs = require('fs');
const multiparty = require('multiparty');
const Product = require('../models/Product');
const Staff = require('../models/Staff');
const Bill = require('../models/Bill');
const Order = require('../models/Order');
const Import = require('../models/Import');
const Notification = require('../models/Notification');
const Statistic = require('../models/Statistic');
// const Link = require('../models/Link');
let isExistProductAddBil = [0]
let addBillFlag = false

let isExistProductStatistic = [0]
let addBillFlagStatistic = false

class StaffController {
    
    // [GET] /staff/home
    async renderHome(req, res, next) {
        res.render('./staff/home', {book, count_material, loan, loanM});
    }  

    async renderCategory(req, res, next){
        const category = await Category.find({}).lean()
        res.render('./staffk/category', {category})
    }

    async renderNotification(req, res, next){
        const notification = await Notification.find({}).lean()
        res.render('./staffbh/notification', {notification})
    }

    async renderProductbh(req, res, next){
        let error = req.flash('error') || ''
        const product = await Product.find({}).lean()
        res.render('./staffbh/product', {product, error})
    }

    async renderProductkt(req, res, next){
        let error = req.flash('error') || ''
        const product = await Product.find({}).lean()
        res.render('./staffkt/product', {product, error})
    }

    async renderProductk(req, res, next){
        let error = req.flash('error') || ''
        const product = await Product.find({}).lean()
        res.render('./staffk/product', {product, error})
    }

    renderProductDetail(req, res, next){
        res.render('./staff/product_detail')
    }

    async renderAddProduct(req, res){
        const account = req.account
        const category = await Category.find({}).lean()
        let staff = await Staff.find({username: account.username}).lean()
        res.render('./staffk/add_product', {category, account, staff: staff[0]})
    }

    async renderAddBill(req, res){
        const account = req.account
        const category = await Category.find({}).lean()
        let date = new Date()
        let month = date.getMonth() + 1
        let staff = await Staff.find({username: account.username}).lean()
        let statistic = await Statistic.find({month}).lean()
        res.render('./staffbh/add_bill', {category, account, statistic, staff: staff[0]})
    }

    async renderAddImport(req, res){
        const account = req.account
        const category = await Category.find({}).lean()
        let staff = await Staff.find({username: account.username}).lean()
        res.render('./staffk/add_import', {category, account, staff: staff[0]})
    }

    async renderBillbh(req, res, next){
        let bill = await Bill.find({}).lean()
        let product = bill.product
        product = JSON.stringify(product)
        res.render('./staffbh/bill', {bill, product})
    }

    async renderBillk(req, res, next){
        let bill = await Bill.find({}).lean()
        let product = bill.product
        product = JSON.stringify(product)
        res.render('./staffk/bill', {bill, product})
    }

    async renderBillkt(req, res, next){
        let bill = await Bill.find({}).lean()
        let product = bill.product
        product = JSON.stringify(product)
        res.render('./staffkt/bill', {bill, product})
    }

    async renderOrder(req, res, next){
        let order = await Order.find({}).lean()
        let product = order.product
        product = JSON.stringify(product)
        res.render('./staffbh/order', {order, product})
    }

    async renderImportbh(req, res, next){
        let importList = await Import.find({}).lean()
        let product = importList.product
        product = JSON.stringify(product)
        res.render('./staffbh/import', {importList, product})
    }

    async renderImportk(req, res, next){
        let importList = await Import.find({}).lean()
        let product = importList.product
        product = JSON.stringify(product)
        res.render('./staffk/import', {importList, product})
    }

    async renderImportkt(req, res, next){
        let importList = await Import.find({}).lean()
        let product = importList.product
        product = JSON.stringify(product)
        res.render('./staffkt/import', {importList, product})
    }

    async renderStatistic(req, res){
        res.render('./staffkt/statistic')
    }

    addCategory(req, res){
        let {name} = req.body;
        let data = {
           name,
        };
        const category = new Category(data);
        category.save();
        console.log("Thành công")
        res.redirect("/staff/category");
    }

    editCategory(req, res){
        let {id} = req.params
        let {name} = req.body
        console.log(id)
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Category.findByIdAndUpdate(id, {name}, {
            new: true
        })
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Cập nhật danh mục thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy danh mục để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    async addProduct(req, res){
        const form = new multiparty.Form()
        form.parse(req, async (err, fields, files) => {
            if (err) console.log(err)
            var oldPath = files.image[0].path
            upload(oldPath, files.image[0].originalFilename)
            let product_data = await Product.find({product_id: fields.id[0]})
            if(product_data.length > 0){
                req.flash('error', 'sản phẩm đã tồn tại')
                res.redirect("/staff/productk");
                return
            }
            let product = new Product({
                product_id: fields.id[0], 
                //product_id: getNextSequence("product_id"),
                name: fields.name[0], 
                quantity: fields.quantity[0], 
                description: fields.description[0],
                image: files.image[0].originalFilename,
                category: fields.category[0],
                category_id: fields.category_id[0],
                old_price:fields.old_price[0],
                new_price:fields.new_price[0],
            })
            product.save()
            .then(() => {
                console.log("Thêm sản phẩm thành công")
                res.redirect('/staff/productk')
            })
            .catch(e => {
                console.log("Thêm sản phẩm thất bại" + e.message)
                res.redirect('/staff/productk')
            })
        })
    }

    editProduct(req, res){
        let {id} = req.params
        let {name, quantity, description, old_price, new_price, category} = req.body
        console.log(id)
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Product.findByIdAndUpdate(id, {name, quantity, description, old_price, new_price, category}, {
            new: true
        })
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Cập nhật sản phẩm thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy sản phẩm để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    addNotify(req, res){
        const form = new multiparty.Form()
        form.parse(req, (err, fields, files) => {
            if (err) console.log(err)
            var oldPath = files.image[0].path
            upload(oldPath, files.image[0].originalFilename)
            let notify = new Notification({
                title: fields.title[0], 
                content: fields.content[0], 
                image: files.image[0].originalFilename,
            })
            notify.save()
            .then(() => {
                console.log("Thêm tin tức thành công")
                res.redirect('/staff/notification')
            })
            .catch(e => {
                console.log("Thêm tin tức thất bại" + e.message)
                res.redirect('/staff/notification')
            })
        })
    }

    editNotify(req, res){
        let {id} = req.params
        let {title, content} = req.body
        console.log(id)
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Notification.findByIdAndUpdate(id, {title, content}, {
            new: true
        })
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Cập nhật thông báo thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy thông báo để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    deleteNotify(req, res){
        let {id} = req.params
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Notification.findByIdAndDelete(id)
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Xóa thông báo thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy thông báo để xóa"})
            }
        
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    async getCategoryId(req, res){
        let {name} = req.body
        let category = await Category.findOne({name}).lean()
        console.log(category)
        if(category){
            return res.json({code: 0, message: 'Lấy id danh mục thành công', data: category._id})
        }
        return res.json({code: 1, message: 'Không tìm thấy danh mục'})
    }

    async getQuantityByIdProduct(req, res){
        let {id} = req.body
        let product = await Product.findOne({product_id: id}).lean()
        console.log("Product for bill", product)
        if(product){
            return res.json({code: 0, message: 'Lấy số lượng sản phẩm thành công', data: product})
        }
        return res.json({code: 1, message: 'Không tìm thấy sản phẩm'})
    }

    async getProductBillById(req, res){
        let {id} = req.body
        let product = await Product.findOne({product_id: id}).lean()
        console.log("Product for bill", product)
        if(product){
            return res.json({code: 0, message: 'Lấy số lượng sản phẩm thành công', data: product})
        }
        return res.json({code: 1, message: 'Không tìm thấy sản phẩm'})
    }

    addBill(req, res){
        let {id_customer, phone, address, date, total, product} = req.body
        console.log("Product json:")
        console.log(product)
        product = JSON.parse(product)
        console.log(product)

        let data = {
            name_customer: id_customer,
            phone,
            address, 
            date,
            total,
            product,
        }
        let bill = new Bill(data)
        bill.save()
        return res.json({code: 0, message: 'Thêm hóa đơn thành công'})
    }

    addImport(req, res){
        let {id_staff, phone, address, date, total, product} = req.body
        product = JSON.parse(product)
        console.log(product)

        let data = {
            id_staff,
            phone,
            address, 
            date,
            total,
            product,
        }
        let importList = new Import(data)
        importList.save()
        return res.json({code: 0, message: 'Thêm phiếu thành công'})
    }

    async getBillById(req, res){
        let {id} = req.params
        let bill = await Bill.find({_id: id}).lean()
        let product = bill[0].product
        console.log(product)
        if(product){
            return res.json({code: 0, message: 'Lấy danh sách sản phẩm thành công', data: product})
        }
        return res.json({code: 1, message: 'Lấy danh sách sản phẩm thất bại'})
    }

    async getOrderById(req, res){
        let {id} = req.params
        let order = await Order.find({_id: id}).lean()
        let product = order[0].product
        console.log(product)
        if(product){
            return res.json({code: 0, message: 'Lấy danh sách sản phẩm thành công', data: product})
        }
        return res.json({code: 1, message: 'Lấy danh sách sản phẩm thất bại'})
    }

    editBill(req, res){
        let {id} = req.params
        let {phone, address, id_customer, date, total} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Bill.findByIdAndUpdate(id, {phone, address, id_customer, date, total}, {
            new: true
        })
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Cập nhật hóa đơn thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy hóa đơn để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    editOrder(req, res){
        let {id} = req.params
        let {phone, address, name, status, total} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Order.findByIdAndUpdate(id, {phone, address, status, name, total}, {
            new: true
        })
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Cập nhật đơn hàng thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy hóa đơn để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    async getImportById(req, res){
        let {id} = req.params
        let importList = await Import.find({_id: id}).lean()
        let product = importList[0].product
        console.log(product)
        if(product){
            return res.json({code: 0, message: 'Lấy danh sách sản phẩm thành công', data: product})
        }
        return res.json({code: 1, message: 'Lấy danh sách sản phẩm thất bại'})
    }

    editImport(req, res){
        let {id} = req.params
        let {phone, address, date, total} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Import.findByIdAndUpdate(id, {phone, address, date, total}, {
            new: true
        })
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Cập nhật phiếu nhập hàng thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy phiếu nhập hàng để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    async getStatistic(req, res){
        let {month, year} = req.body
        let statistic = await Statistic.find({year}).lean()

        if(statistic.length === 0){
            return res.json({code: 1, message: 'Năm không hợp lệ'})
        }

        let temp = []
        statistic.forEach(item => {
            if(item.month == month){
                temp.push(item)
                let product_remain = parseInt(item.all_product) - parseInt(item.product_sold)
                Statistic.findByIdAndUpdate(item._id, {product_remain}, {
                    new: true
                })
                .then(p => {
                    if(p){
                        return res.json({code: 0, message: 'Tìm thấy dữ liệu thống kê', data: temp[0]})
                    }
                    else{
                        return res.json({code: 2, message: "Không tìm thấy thống kê để cập nhật"})
                    }  
                })
                .catch(e => {
                    return res.json({code: 3, message: e.message})
                })
            }
        })
    }

    async changeQuantityProduct(req, res){
        let {id, quantity} = req.body
        console.log(id)
        let product = await Product.find({_id: id}).lean()
        let isExistArray = false
        if(product){
            isExistProductAddBil.forEach(item => {
                if(item == id){
                    addBillFlag = true
                    isExistArray = true
                }
            })
        }

        let quantity_product = product[0].quantity
        let new_quantity = parseInt(quantity_product) - parseInt(quantity)
        console.log("New quantity",  new_quantity)
        if(new_quantity < 0){
            new_quantity = 0
        }

        if(!addBillFlag){
            await Product.findByIdAndUpdate(id, {quantity: new_quantity}, {
                new: true
            })
            .then(result => {
                if(result){
                    addBillFlag = false
                    if(!isExistArray){
                        isExistProductAddBil.push(id)
                    }
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
        addBillFlag = false
    }

    async changeProductStatistic(req, res){
        let {quantity_user, id} = req.body

        let statistic = await Statistic.find({_id: id}).lean()
        console.log("Statistic:", statistic)
        let product_sold = statistic[0].product_sold
        product_sold += parseInt(quantity_user)
        console.log("Product sold:", product_sold)
        let product_remain = statistic[0].all_product - product_sold

        await Statistic.findByIdAndUpdate(id, {product_sold, product_remain})
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

    deleteProduct(req, res){
        let {id} = req.params
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Product.findByIdAndDelete(id)
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Xóa sản sản phẩm thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy sản phẩm để xóa"})
            }
        
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    deleteCategory(req, res){
        let {id} = req.params
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Category.findByIdAndDelete(id)
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Xóa sản danh mục thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy danh mục để xóa"})
            }
        
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }
}

module.exports = new StaffController;