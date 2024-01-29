const CustomError=require('../errors')
const {IsValidToken}=require('../utils')

const authenticateUser= (req,res,next)=>{

const token=req.signedCookies.token;


if(!token){throw new CustomError.UnauthenticatedError('No cookie')}


try {

    const {userId,name,role}=IsValidToken({token})
    req.user={userId,name,role}
    next()
} catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
}


}

const authorizePermissions=(...roles)=>{
return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
        throw new CustomError.UnauthenticatedError('No authorize permission');
    }
    next();
}
}

module.exports={authenticateUser,authorizePermissions}