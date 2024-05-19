const express =require('express')
const router=express.Router()
const userController=require('../controller/userController')


router.route('/register').post(userController.registerUser)
router.route('/login').post(userController.loginUser)
router.route('/logout').get(userController.logout)
router.route('/password/forget').post(userController.forGetPassword)
router.route('/password/reset/:token').put(userController.resetPassword)


module.exports=router