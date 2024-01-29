const User=require('../model/User')
const StatusCode=require('http-status-codes')
const CustomError=require('../errors')
const {checkPermissions}=require('../utils')
const {attachCookiesToResponse,creatPayloadToken}=require('../utils')



const getAllUser=async (req,res)=>{
    const users=await User.find({role:'user'}).select('-password')
    res.status(StatusCode.OK).json({users,count:users.length})
}

const getSingleUser=async (req,res)=>{
    const user=await User.findOne({_id:req.params.id}).select('-password')
    if(!user){throw new CustomError.NotFoundError('there not user with this id')}
    checkPermissions({reqUser:req.user,resourceId:user._id})
    res.status(StatusCode.OK).json({user})
}

const updateUser=async (req,res)=>{
    const {email,name}=req.body
    if(!email || !name){
        throw new CustomError.BadRequestError('invailed credintial')
    }
    const user=await User.findOne({_id:req.user.userId});

    user.email=email
    user.name=name;
    console.log(email)
    await user.save()
        //creat jwt and cookie
        const userDetails=creatPayloadToken({user});
        attachCookiesToResponse({res,payload:userDetails})
    res.status(StatusCode.OK).json({userDetails})
}
const deleteUSer=async (req,res)=>{
    res.status(StatusCode.OK).json('deletUSer')
}
const showCurrentUser=async (req,res)=>{

    res.status(StatusCode.OK).json({user:req.user})
}
const updateUserPassword=async (req,res)=>{
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new CustomError.BadRequestError('Please provide both values');
    }
    
    const user=await User.findOne({_id:req.user.userId});
    const isPasswordCorrect= await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){ throw new CustomError.UnauthenticatedError('Invalid Credentials');}
    user.password=newPassword
    await user.save()

    res.status(StatusCode.OK).json({ msg: 'Success! Password Updated.' })
}

module.exports={getAllUser,getSingleUser,updateUser,deleteUSer,showCurrentUser,updateUserPassword}