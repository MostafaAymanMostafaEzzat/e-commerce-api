const {creatToken,IsValidToken,attachCookiesToResponse}=require('./jwt')
const creatPayloadToken =require('./creatPayloadToken')
const checkPermissions =require('./checkPermissins')


module.exports={
    creatToken,IsValidToken,attachCookiesToResponse,creatPayloadToken,checkPermissions
}