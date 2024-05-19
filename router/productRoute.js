const express=require('express')
const router=express.Router()
const productController=require('../controller/productController')
const {isAuthenticated,authorizeRole}=require('../middleware/auth')

router.route('/product/new').post(isAuthenticated,authorizeRole('admin'),productController.createProduct)
router.route('/products').get(productController.findAllProducts)
router.route('/products/:id').get(isAuthenticated,authorizeRole('admin'),productController.findSingleProduct).delete(isAuthenticated,authorizeRole('admin'),productController.deleteSingleProduct).put(isAuthenticated,authorizeRole('admin'),productController.updateSingleProduct)
module.exports=router