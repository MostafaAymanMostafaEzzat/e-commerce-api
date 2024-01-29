const express=require('express')
const router=express.Router()
const {authenticateUser,authorizePermissions}=require('../middleware/authentication')
const {
    getAllProduct,getsingleProduct,updateProduct,createProduct,deleteProduct,uploadImage
}=require('../controllers/productController')
const{getSingleProductReviews}=require('../controllers/reviewcontroller')


router.get('/',getAllProduct);
router.post('/',authenticateUser,authorizePermissions('admin'),createProduct)
router.post('/uploadImage',authenticateUser,authorizePermissions('admin'),uploadImage)
router.get('/getSingleProductReviews/:id',getSingleProductReviews);

router.delete('/:id',authenticateUser,authorizePermissions('admin'),deleteProduct)
router.patch('/:id',authenticateUser,authorizePermissions('admin'),updateProduct)
router.get('/:id',getsingleProduct);

module.exports=router;