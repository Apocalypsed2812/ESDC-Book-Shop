const Account = require('../models/Account');
const Staff = require('../models/Staff');
const bcrypt = require("bcrypt");
const Bill = require('../models/Bill');

class AdminController {

    // [GET] /admin/home
    async renderHome(req, res, next) {
        const account = await Account.find({role: 'user'}).lean()
        console.log(account)
        res.render('./admin/home', {account});
    }

    async renderStaff(req, res){
        let error = req.flash('error') || ''
        const staff = await Staff.find({}).lean()
        res.render('./admin/staff', {staff, error})
    }

    deleteUser(req, res){
        let {id} = req.params
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Account.findByIdAndDelete(id)
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Xóa user thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy user để xóa"})
            }
        
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    async addStaff(req, res){
        let {username, name, phone, email, address, staff_id, role} = req.body;
        let staff_data = await Staff.find({staff_id}).lean();
        console.log("Staff_data: ", staff_data)
        if(staff_data.length > 0){
            req.flash('error', 'Mã nhân viên đã tồn tại')
            res.redirect("/admin/staff");
            return
        }
        let data_staff = {
            username,
            email,
            name,
            phone,
            address,
            staff_id,
        };
        let password = '123456789'
        let hashed = bcrypt.hashSync(password, 10)
        let data_account = {
            username,
            password: hashed,
            role,
        };
        const staff = new Staff(data_staff);
        staff.save();
        const account = new Account(data_account);
        account.save();
        console.log("Thành công")
        res.redirect("/admin/staff");
    }

    editStaff(req, res){
        let {id} = req.params
        let {username, email, name, phone, address, username_old} = req.body
        console.log(id)
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Account.findOneAndUpdate({username: username_old}, {username}, {
            new: true
        })
        Staff.findByIdAndUpdate(id, {username, name, phone, address, email}, {
            new: true
        })
        .then(result => {
            if(result){
                return res.json({code: 0, message: "Cập nhật nhân viên thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy nhân viên để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    async renderBill(req, res, next){
        let bill = await Bill.find({}).lean()
        let product = bill.product
        product = JSON.stringify(product)
        res.render('./admin/bill', {bill, product})
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
}

module.exports = new AdminController;