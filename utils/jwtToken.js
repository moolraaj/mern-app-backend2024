const sendToken=(user,statusCode,res)=>{
    let token=user.getJwtToken()
    let options={
        expires:new Date(Date.now()+process.env.EXPIRES_COOCKIE*24*60*60*1000),
        httpOnly:true
    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token
    })

}
module.exports=sendToken