const router = require("express").Router();
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const productConrtoller = require('../controller/productController');
const orderController = require('../controller/orderController');
const chatController = require('../controller/chatController');


//user routs
router.get('/users', userController.getUsers);
router.get('/user/:userID', userController.findUser);
router.post('/createusers', userController.addUser);
router.post('/updateuser/:userID', userController.updateUser);
router.delete('/deleteuser/:userID', userController.deleteUser);


//loging routs
router.post('/login', authController.signin);


//product routs
router.get('/product', productConrtoller.getProducts);
router.get('/products/:productID', productConrtoller.findProduct);
router.get('/product/user', productConrtoller.findProductUid);
router.post('/createproduct', productConrtoller.addProduct);
router.post('/updateproduct/:productID', productConrtoller.updateProdut);
router.delete('/deleteproduct/:productID', productConrtoller.deleteProduct);



//order routs
router.get('/getorder',orderController.getOrders);
router.post('/createorder', orderController.addOrder);
router.get('/orders/sellerid', orderController.findOrderSid);
router.get('/order/userid', orderController.findOrderUid);
router.post('/orderupdate/:orderID', orderController.updateOrder);
router.delete('/deleteorder/:orderID', orderController.deleteOrder);


//message routs
router.get('/message',chatController.getMessages);


module.exports = router;

