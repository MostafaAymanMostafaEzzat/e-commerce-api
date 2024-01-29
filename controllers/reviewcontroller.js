const StatusCodes =require('http-status-codes')
const CustomError =require('../errors')
const Review =require('../model/Review');
const Product =require('../model/Product');

const {checkPermissions}=require('../utils')

const createReview=async (req,res)=>{
    const {product:productId}=req.body;

    isValidProduct =await Product.findOne({_id:productId})
    if(!isValidProduct){
        throw new CustomError.BadRequestError(`No product with id : ${productId}`)
    }

    const aleardySubmitted=await Review.findOne({
        product:productId,
        user:req.user.userId
    })

    if(aleardySubmitted){
        throw new CustomError.BadRequestError('Already submitted review for this product')

    }



    req.body.user=req.user.userId
    const review=await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({review})
};

const getAllReviews=async (req,res)=>{
    const reviews =await Review.find({}).populate({
        path:'product',
        select:'name company price '
    })

    res.status(StatusCodes.OK).json({reviews,count:reviews.length})

};

const getSingleReview=async (req,res)=>{
    const review =await Review.findOne({_id:req.params.id})
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
      }
    res.status(StatusCodes.OK).json({review})
};

const updateReview=async (req,res)=>{
        const{id:reviewId}=req.params;
        const{comment,rating,title}=req.body;
        if(!comment || !rating || !title){ throw new CustomError.BadRequestError(`invaild credintial`);}
    const review =await Review.findOne({_id:reviewId})

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
      }
      checkPermissions({reqUser:req.user,resourceId:review.user})

      review.comment=comment;
      review.rating=rating;
      review.title=title;

await review.save()
    res.status(StatusCodes.CREATED).json({review})
};

const deleteReview=async (req,res)=>{
    const{id:reviewId}=req.params
    const review =await Review.findOne({_id:reviewId})

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
      }

          checkPermissions({reqUser:req.user,resourceId:review.user})
         
          await review.deleteOne()
    res.status(StatusCodes.OK).json({msg: 'Success! review removed.' })
};

const getSingleProductReviews=async (req,res)=>{
    const{id:productId}=req.params

    const reviews =await Review.find({product:productId})
    if (!reviews) {
        throw new CustomError.NotFoundError(`No reviews for the product  with id : ${productId}`);
      }
    res.status(StatusCodes.OK).json({reviews,count:reviews.length})
};



module.exports={createReview, getAllReviews, getSingleReview, updateReview, deleteReview,getSingleProductReviews}