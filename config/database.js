const mongoose=require('mongoose')


const connectDb=()=>{

    mongoose.connect('mongodb://localhost:27017/e-commerce').then((data)=>{
       console.log(`database is connected on the port ${data.connection.port}`)
   
    })
}
module.exports=connectDb