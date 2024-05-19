const jwt=require('jsonwebtoken')
const userModel=require('../model/userModel')
const asyncError = require('./asyncError')
const ErrorHandler = require('../utils/errorhandler')

exports.isAuthenticated=asyncError(async(req,res,next)=>{
    let {token}=req.cookies
    if(!token){
        return next(new ErrorHandler('token is required',404))
    }
    let decodedData= jwt.verify(token,process.env.SECRET_KEY)
    req.user= await userModel.findById(decodedData.id)
     
     
     
    next()
     
})

exports.authorizeRole=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`this role isn't for ${req.user.role}`,403))

        }
        next()
    }
    

}

