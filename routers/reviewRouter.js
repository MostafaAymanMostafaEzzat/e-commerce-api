const express=require('express')
const router=express.Router()
const {createReview, getAllReviews, getSingleReview, updateReview, deleteReview,}=require('../controllers/reviewcontroller')
const {authenticateUser,authorizePermissions}=require('../middleware/authentication')
 

router.get('/',getAllReviews);
router.post('/',authenticateUser,createReview)


router.delete('/:id',authenticateUser,deleteReview)
router.patch('/:id',authenticateUser,updateReview)
router.get('/:id',getSingleReview);

module.exports=router;