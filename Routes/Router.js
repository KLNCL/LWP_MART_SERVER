const router = require("express").Router();
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const productConrtoller = require('../controller/productController');
const orderController = require('../controller/orderController');
const chatController = require('../controller/chatController'); 
const cartController = require('../controller/cartController'); 
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });



//user routs
router.get('/users', userController.getUsers);
router.get('/user/:userID', userController.findUser);
router.post('/createusers', userController.addUser);
router.post('/updateuser/:userID', userController.updateUser);
router.delete('/deleteuser/:userID', userController.deleteUser);
router.post('/userActivation/:userID', userController.userActivation);
router.post('/userDeactivation/:userID', userController.userDeactivation);

//loging routs
router.post('/login', authController.signin);
router.post('/adminlogin', authController.adminSignin);


//product routs
router.get('/product', productConrtoller.getProducts);
router.get('/products/:productID', productConrtoller.findProduct);
router.get('/product/user', productConrtoller.findProductUid);
router.post("/createproduct", upload.single("image"), productConrtoller.addProduct);
router.post('/updateproduct/:productID', productConrtoller.updateProdut);
router.delete('/deleteproduct/:productID', productConrtoller.deleteProduct);



//order routs
router.get('/getorder',orderController.getOrders);
router.post('/createorder', orderController.addOrder);
router.get('/orders/:seller_id', orderController.findOrderSid);
router.get('/order/userid', orderController.findOrderUid);
router.post('/orderupdate/:orderID', orderController.updateOrder);
router.delete('/deleteorder/:orderID', orderController.deleteOrder);


// Message routes
router.post('/sendmessage', chatController.sendMessage); // Send a new message
router.get('/messages/:sender/:receiver', chatController.getMessages); // Get chat messages between two users
router.get('/search-users', chatController.searchUsers); // Search users
router.get('/messages' , chatController.getAllMessages); //get all message
router.get('/messages/:sender', chatController.getAllMessagesById); // Get chat messages byi d
router.get('/chatted-users/:userId', chatController.getChattedUsers);
router.get('/usersChated/:userID', userController.findChatedUser); //get chated users //use

//Cart routs
router.post('/addToCart',cartController.addToCart);
router.delete('/removeCart/:cartId',cartController.removeFromCart);
router.post('/updateQty/:cartId', cartController.updateCartQuantity);
router.get('/getUser/:user_id', cartController.getUserCart);



module.exports = router;

