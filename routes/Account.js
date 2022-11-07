const express = require('express');
const router = express.Router()

const AccountController = require('../app/controllers/AccountController');

// [GET] /
router.get('/', AccountController.renderHome)

// [GET] /
router.get('/:category_product', AccountController.renderCategoryProduct)

// [GET] /search
router.post('/search', AccountController.renderSearch)

// log out
router.get('/home/logout', AccountController.logOut)

// [GET] /product_detail
router.get('/product_detail/:id', AccountController.renderProductDetail)

// [POST] /login
router.post('/login', AccountController.loginByAccount)

// [POST] /register
router.post('/register', AccountController.register)

// [POST] /change_password
router.post('/change_password', AccountController.changePassword)

// [GET] /forgot_password
router.get('/forgot_password', AccountController.renderForgotPassword)

// [POST] /otp
router.post('/otp', AccountController.createOTP)

// [POST] /forgot_password
router.post('/forgot_password', AccountController.forgotPassword)

// [GET] /reset_password
router.get('/reset_password', AccountController.renderResetPassword)

// [POST] /reset_password
router.post('/reset_password', AccountController.resetPassword)

module.exports = router