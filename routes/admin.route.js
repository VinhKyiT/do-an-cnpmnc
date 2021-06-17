var express = require('express');
var router = express.Router();
var controller = require('../controllers/admin.controller');
var path = require('path');
var multer  = require('multer')
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
var upload = multer({
    storage: storage
})

router.get('/', controller.get);
router.get('/logout', controller.logout);

//Category
router.get('/category', controller.category);
router.post('/category/create', controller.createCategory)
router.get('/category/edit/:cateID', controller.getEditCate)
router.post('/category/edit/:cateID', controller.postEditCate)
router.get('/category/delete/:cateID', controller.deleteCate)

//Category Detail
router.post('/category-detail/create/:categoryID', controller.createDetailCate)
router.get('/detail-category/delete/:detailCate', controller.deleteDetailCate)
router.get('/detail-category/edit/:detailCate', controller.getEditDetailCate)
router.post('/detail-category/edit/:detailCate', controller.postEditDetailCate)

//Products
router.get('/products', controller.product);
router.get('/products/edit/:productID', controller.getEditProduct);
router.post('/products/create', upload.array('avatar', 4), controller.createProduct);
router.post('/products/import', controller.postImportProduct);
router.post('/products/edit/:productID', upload.fields([
    {name: "avatar-0", maxCount: 1},
    {name: "avatar-1", maxCount: 1},
    {name: "avatar-2", maxCount: 1},
    {name: "avatar-3", maxCount: 1}]),
    controller.postEditProduct
    )
router.get('/products/delete/:productID', controller.deleteProduct)

//Users
router.get('/users', controller.user);
router.get('/users/delete/:accountID', controller.deleteUser);
router.post('/users/create', controller.createUser);
router.get('/users/edit/:accountID', controller.getEditUser);
router.post('/users/edit/:accountID', controller.postEditUser);

//Roles
router.get('/roles', controller.getRole);
router.post('/roles/create', controller.createRole);
router.get('/roles/edit/:roleID', controller.getEditRole);
router.post('/roles/edit/:roleID', controller.postEditRole);
router.get('/roles/delete/:roleID', controller.deleteRole);
module.exports = router;

//Orders
router.get('/orders', controller.getOrders);
router.get('/orders/:orderID', controller.getOrder);
router.post('/orders/edit/:orderID', controller.postEditOrder);