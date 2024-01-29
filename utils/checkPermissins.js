
const CustomError = require('../errors');

const checkPermissions =({reqUser,resourceId})=>{
    if(reqUser.role === 'admin') return;
    if(reqUser.userId === resourceId.toString()) return;
    throw new CustomError.UnauthenticatedError('Not authorized to access this route');
    

}

module.exports=checkPermissions