const express = require('express');
const router = express.Router()
const StaffController = require('../app/controllers/StaffController');
const checkStaff = require("../app/middleware/checkStaff");
//const flash = require("../app/middleware/flashMessage");

router.use(checkStaff);
router.get('/home', StaffController.renderHome)
router.get('/category', StaffController.renderCategory)
router.get('/notification', StaffController.renderNotification)
router.get('/productbh', StaffController.renderProductbh)
router.get('/productkt', StaffController.renderProductkt)
router.get('/productk', StaffController.renderProductk)
router.get('/add_product', StaffController.renderAddProduct)
router.get('/product_detail', StaffController.renderProductDetail)
router.post('/addCategory', StaffController.addCategory)
router.put('/editCategory/:id', StaffController.editCategory)
router.post('/addProduct', StaffController.addProduct)
router.put('/editProduct/:id', StaffController.editProduct)
router.post('/addNotify', StaffController.addNotify)
router.put('/editNotify/:id', StaffController.editNotify)
router.delete('/deleteNotify/:id', StaffController.deleteNotify)
router.post('/getCategoryId', StaffController.getCategoryId)
router.get('/billbh', StaffController.renderBillbh)
router.get('/billk', StaffController.renderBillk)
router.get('/billkt', StaffController.renderBillkt)
router.get('/add_bill', StaffController.renderAddBill)
router.post('/getQuantityByIdProduct', StaffController.getQuantityByIdProduct)
router.post('/getProductBillById', StaffController.getProductBillById)
router.post('/addBill', StaffController.addBill)
router.get('/getBillById/:id', StaffController.getBillById)
router.put('/editBill/:id', StaffController.editBill)
router.get('/importbh', StaffController.renderImportbh)
router.get('/importk', StaffController.renderImportk)
router.get('/importkt', StaffController.renderImportkt)
router.get('/add_import', StaffController.renderAddImport)
router.post('/addImport', StaffController.addImport)
router.get('/getImportById/:id', StaffController.getImportById)
router.put('/editImport/:id', StaffController.editImport)
router.get('/statistic', StaffController.renderStatistic)
router.post('/getStatistic', StaffController.getStatistic)
router.post('/changeQuantityProduct', StaffController.changeQuantityProduct)
router.post('/changeProductStatistic', StaffController.changeProductStatistic)
router.delete('/deleteProduct/:id', StaffController.deleteProduct)
router.delete('/deleteCategory/:id', StaffController.deleteCategory)
router.get('/order', StaffController.renderOrder)
router.get('/getOrderById/:id', StaffController.getOrderById)
router.put('/editOrder/:id', StaffController.editOrder)

module.exports = router;