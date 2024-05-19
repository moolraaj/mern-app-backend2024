const ErrorHandler=require('../utils/errorhandler')

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500
    err.message=err.message|| "internal server error"


if(err.name==='CastError'){
    let message=`resource not found ${err.path}`
    err=new ErrorHandler(message,400)
}

if(err.code===11000){
    let message=`duplicate entry ${err.path}`
    err=new ErrorHandler(message,400)
}

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })


}