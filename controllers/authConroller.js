const StatusCodes =require('http-status-codes')
const Customerror =require('../errors')
const User =require('../model/User')
const {attachCookiesToResponse,creatPayloadToken}=require('../utils')

const register =async (req,res)=>{
    const {name,email,password}=req.body
    const emailAlreadyExists = await User.findOne({email});
    if(emailAlreadyExists){
        throw new Customerror.BadRequestError('Email already exists')
    }

    //makes the first user as an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user =await User.create({name,email,password,role})
    //creat jwt and cookie
    const userDetails=creatPayloadToken({user});
    attachCookiesToResponse({res,payload:userDetails})

     
    res.status(StatusCodes.CREATED).json(userDetails)
} 
const login =async (req,res)=>{
    const {email,password}=req.body;
    if (!email || !password) {
        throw new Customerror.BadRequestError('Please provide email and password');
      }
    const user =await User.findOne({email})
    if(!user){throw new Customerror.NotFoundError("not found user with this email")}

    //compare password
    const isVAlidPassword=await user.comparePassword(password)
    if (!isVAlidPassword){throw new Customerror.UnauthenticatedError("the password is wrong")};
    //creat jwt and cookie
    const userDetails=creatPayloadToken({user});
    attachCookiesToResponse({res,payload:userDetails})
    
    res.status(StatusCodes.OK).json(userDetails)
} 
const logout =(req,res)=>{
    res.cookie('token','',{
        httpOnly: true,
        expires:new Date(Date.now())

    })
    res.status(StatusCodes.OK).json("Happy Experience")
} 

module.exports={
    register,login,logout
}