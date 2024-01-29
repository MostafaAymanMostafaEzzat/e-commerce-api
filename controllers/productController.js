const StatusCodes =require('http-status-codes')
const CustomError =require('../errors')
const Product =require('../model/Product');
const path=require('path')
const getAllProduct=async (req,res)=>{
    const products =await Product.find({})
    console.log('mmmmmm')
    res.status(StatusCodes.OK).json({products,count:products.length})

}

const getsingleProduct=async (req,res)=>{
    const{id:productId}=req.params

    const product =await Product.findOne({_id:productId}).populate('reviews')
    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
      }
    res.status(StatusCodes.OK).json({product})

}

const updateProduct=async (req,res)=>{
    const{id:productId}=req.params
    const product =await Product.findByIdAndUpdate({_id:productId},req.body,{
        new:true,
        runValidators:true
    })

    c
    
    res.status(StatusCodes.OK).json({product})

}

const createProduct=async (req,res)=>{
    req.body.user=req.user.userId
    const product=await Product.create(req.body);
    
    res.status(StatusCodes.CREATED).json({product})

}

const deleteProduct=async (req,res)=>{
    const{id:productId}=req.params
    const product =await Product.findOne({_id:productId})

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
      }
      console.log('1111')
      await product.deleteOne();
    res.status(StatusCodes.OK).json({msg: 'Success! Product removed.' })

}

const uploadImage=async (req,res)=>{
    if(!req.files){
        throw new CustomError.BadRequestError('No File Uploaded')
    }
    console.log(req.files);
    const productImage=req.files.image;

    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('Please Upload Image');

    }
    const maxSize=1024*1024

    if(!productImage.size > maxSize){
        throw new CustomError.BadRequestError(
            'Please upload image smaller than 1MB'
          );

    }

    const imagePath =path.join(__dirname,'../public/uploads/',productImage.name)

    await productImage.mv(imagePath)

    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` })
}

module.exports={
    getAllProduct,getsingleProduct,updateProduct,createProduct,deleteProduct,uploadImage
}