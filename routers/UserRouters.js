const express=require('express')
const router=express.Router()
const {authenticateUser,authorizePermissions}=require('../middleware/authentication')
const {getAllUser,getSingleUser,updateUser,deleteUSer,showCurrentUser,updateUserPassword}=require('../controllers/UserController')


router.get('/',authenticateUser,authorizePermissions('admin'),getAllUser);
router.patch('/updateUser',authenticateUser,updateUser)
router.delete('/deleteUSer',authenticateUser,deleteUSer)
router.get('/showCurrentUser',authenticateUser,showCurrentUser)
router.patch('/updateUserPassword',authenticateUser,updateUserPassword)

router.get('/:id',authenticateUser,getSingleUser);

module.exports=router;
