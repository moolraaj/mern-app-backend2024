const userModel=require('../model/userModel')
const asyncError=require('../middleware/asyncError')
const ErrorHandler = require('../utils/errorhandler')
const sendToken=require('../utils/jwtToken')
const sendEmail=require('../utils/sendEmail')
const crypto=require('crypto')
const registerUser=asyncError(async(req,res,next)=>{
    const {name,email,password}=req.body
    let user=await userModel.create({
        name,email,password,
        avatar:{
            public_id:'demo',
            url:'demo'
        }
    })
    sendToken(user,201,res) 

})


const loginUser=asyncError(async(req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password){
        return next(new ErrorHandler('mismatch credintials'),400)
    }
    let user=await userModel.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorHandler('email and password are wrong'),400) 
    }
    let isPasswordmatched= await user.comparePassword(password)

    if(!isPasswordmatched){
        return next(new ErrorHandler('email and password are wrong'),400) 
    }
    sendToken(user,200,res)  
})

const logout=(req,res,next)=>{
    res.cookie('token',null,{
        options:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:'log out successfully'
    })

}

const forGetPassword = asyncError(async (req, res, next) => {
    let user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Get reset token
    let resetToken = user.getResetPasswordToken();

    // Save the updated user object
    await user.save({ validateBeforeSave: false });

    // Create the link to send in the email
    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    // Create the message to send in the email
    const message = `Your reset password token is:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, then please ignore it.`;

    // Try to send the email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Ecommerce password',
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent successfully to ${user.email}`
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        next(new ErrorHandler(error.message, 500));
    }
});



const resetPassword = asyncError(async (req, res, next) => {
    // Create token hash
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find the user by the hashed token and ensure the token is not expired
    let user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    // If the user is not found or the token is expired, show an error
    if (!user) {
        return next(new ErrorHandler('Invalid token or token has expired', 404));
    }

    // Check if the new password and confirmation password match
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400));
    }

    // Set the new password and clear the reset token and expiry date
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user object
    await user.save();

    // Send a token (this is assuming you have a sendToken function that sends a JWT or similar)
    sendToken(user, 200, res);
});


module.exports={
    registerUser,
    loginUser,
    logout ,
    forGetPassword,
    resetPassword
}