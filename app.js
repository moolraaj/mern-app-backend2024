const express=require('express')
const app=express()
const productRouter=require('./router/productRoute')
const userRouter=require('./router/userRoute')
const errorMiddleware=require('./middleware/error')
const cookieParser=require('cookie-parser')
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1',productRouter)
app.use('/api/v1',userRouter)


app.use(errorMiddleware)

module.exports=app