const jwt=require('jsonwebtoken');

const creatToken= ({payload})=>{
    return  jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}


const IsValidToken=({token})=>{
  return  jwt.verify(token, process.env.JWT_SECRET)
}


const attachCookiesToResponse =({res,payload})=>{
    const oneDay=1000*60*60*24

    const token=creatToken({payload})
    

    console.log(token)
    res.cookie('token',token,{
        expires: new Date(Date.now() + oneDay),
        httpOnly:true,
        signed:true,
        secure:process.env.NODE_ENV === "production"
    })
   

}

module.exports={
    creatToken,IsValidToken,attachCookiesToResponse
}