const express = require('express');
const router = express.Router()
const UserController = require('../app/controllers/UserController');
const checkUser = require("../app/middleware/checkUser");
//const checkLogin = require("../app/middleware/checkLogin");
// const checkChangePassword = require("../app/middleware/checkChangePassword");

router.use(checkUser);
router.get('/home', UserController.renderHome)
router.get('/home/:category_product', UserController.renderCategory)
router.post('/search', UserController.renderSearch)
router.get('/product_detail/:id', UserController.renderProductDetail)
router.get('/user_infor', UserController.renderInforUser)
router.get('/notification', UserController.renderNotification)
router.get('/notification_detail/:id', UserController.renderNotificationDetail)
router.get('/cart', UserController.renderCart)
router.get('/order', UserController.renderOrder)
router.post('/addToCart', checkUser, UserController.addToCart)
router.post('/changeQuantityProduct', checkUser, UserController.changeQuantityProduct)
router.post('/addOrder', checkUser, UserController.addOrder)
router.post('/changeInfor', checkUser, UserController.changeInfor)
router.post('/changeAvatar', checkUser, UserController.changeAvatar)
router.delete('/deleteProductCart/:id', UserController.deleteProductCart)
router.delete('/deleteProductCartHeader/:id', UserController.deleteProductCart)
router.delete('/deleteProductCartOrder/:id', UserController.deleteProductCartOrder)
router.post('/changeProductStatistic', UserController.changeProductStatistic)

module.exports = router;