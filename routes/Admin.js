const express = require('express');
const { renderHome } = require('../app/controllers/AccountController');
const router = express.Router()
const AdminController = require('../app/controllers/AdminController');
const checkAdmin = require("../app/middleware/checkAdmin");
//const flash = require("../app/middleware/flashMessage");
//const checkLogin = require("../app/middleware/checkLogin");

//Check Login
//router.use(checkLogin)

router.use(checkAdmin);
router.get('/home', AdminController.renderHome)
router.get('/staff', AdminController.renderStaff)
router.delete('/deleteUser/:id', AdminController.deleteUser)
router.post('/addStaff', AdminController.addStaff)
router.put('/editStaff/:id', AdminController.editStaff)
router.get('/bill', AdminController.renderBill)
router.get('/getBillById/:id', AdminController.getBillById)

module.exports = router;