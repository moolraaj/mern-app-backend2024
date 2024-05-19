const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'name is required']
    },
    description:{
        type:String,
        required:[true,'name is required']
    },
    price:{
        type:Number,
        maxLength:[6,'not exceed max length'],
        required:[true,'price is required']
    },
    rating:{
        type:Number,
        default:0,
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,'category is required']
    },
    stock:{
        type:Number,
        default:1,
        required:[true,'stock is required'],
        maxLength:[4,'cannot exceed lenght']
    },
    numOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            Comment:{
                type:String,
                require:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'users',
        required:true

    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    
})

const productModel=mongoose.model('products',productSchema)
module.exports=productModel