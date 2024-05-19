const mongoose=require('mongoose')
const validator=require('validator')
const bycryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        maxLength:[30,'cannot exceed lenght after 30 char'],
        minLength:[4,'at least 4 char required']
    },
    email:{
        type:String,
        required:[true,'email is required'],
        validate:[validator.isEmail,'email not matched'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'password id required'],
        minLength:[8,'password should be at least 8 latter or above'],
        select:false
    },
    
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true  
        }
    },
    role:{
        type:String,
        default:'user'
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password=await bycryptjs.hash(this.password,10)
})

userSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this._id},process.env.SECRET_KEY,{
        expiresIn:process.env.EXPIRES_IN
    })
}

userSchema.methods.comparePassword=async function(password){
    return await bycryptjs.compare(password,this.password)
}

userSchema.methods.getResetPasswordToken = function() {
    // Generate random token 
    let resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set resetPasswordToken for userSchema
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expiration time (15 minutes)
    this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    return resetToken;
};


 

const userModel=mongoose.model('Users',userSchema)
module.exports=userModel